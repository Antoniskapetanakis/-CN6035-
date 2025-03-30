
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { promisePool } = require('../config/db'); 


router.get('/profile/:userId', authenticateJWT, async (req, res) => {
    try {
        const userId = req.params.userId;

        if (req.user.userId !== parseInt(userId, 10)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const [user] = await promisePool.execute('SELECT name AS username, email, user_id FROM users WHERE user_id = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({
            username: user[0].username,
            email: user[0].email,
            id: user[0].user_id
        });
    } catch (err) {
        console.error('❌ Error fetching user profile:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.put('/profile', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.userId; 
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).json({ message: 'Username and email are required.' });
        }

        const [existingUser] = await promisePool.execute('SELECT user_id FROM users WHERE email = ? AND user_id != ?', [email, userId]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'This email is already in use by another user.' });
        }

        await promisePool.execute('UPDATE users SET name = ?, email = ? WHERE user_id = ?', [username, email, userId]);

        return res.json({ success: true, message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('❌ Error updating user profile:', error);
        return res.status(500).json({ message: 'Server error while updating profile.' });
    }
});


router.put('/change-password', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }

        const [user] = await promisePool.execute('SELECT password FROM users WHERE user_id = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const hashedPasswordFromDb = user[0].password;

        const passwordMatch = await bcrypt.compare(currentPassword, hashedPasswordFromDb);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid current password.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await promisePool.execute('UPDATE users SET password = ? WHERE user_id = ?', [hashedNewPassword, userId]);

        return res.json({ success: true, message: 'Password changed successfully!' });
    } catch (error) {
        console.error('❌ Error changing password:', error);
        return res.status(500).json({ message: 'Server error while changing password.' });
    }
});

router.get('/restaurants/search', async (req, res) => {
    try {
        const { name } = req.query;
        const [restaurants] = await promisePool.execute('SELECT * FROM restaurants WHERE name LIKE ?', [`%${name}%`]);
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('❌ Search Error:', error);
        res.status(500).json({ error: 'Error searching for restaurants.' });
    }
});

router.post('/register', async (req, res) => {
    console.log('POST /api/users/register - Request Body:', req.body);
    try {
        const { name, email, password } = req.body;

        console.log('Password before hashing:', password); 

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword); 

        const [existingUser] = await promisePool.execute('SELECT user_id FROM users WHERE email = ?', [email]); 
        if (existingUser.length > 0) {
            console.warn('Email already registered:', email);
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const [result] = await promisePool.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        const newUserId = result.insertId; 
        console.log('User registered successfully with ID:', newUserId);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('❌ Registration Error:', error);
        res.status(500).json({ error: 'Error registering user.' });
    }
});

router.post('/login', async (req, res) => {
    console.log('POST /api/users/login - Request Body:', req.body);
    try {
        const { email, password } = req.body;

        const [user] = await promisePool.execute('SELECT user_id, name, email, password FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            console.warn('Login failed - User not found:', email);
            return res.status(400).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user[0].password);

        if (!passwordMatch) {
            console.warn('Login failed - Invalid credentials for:', email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user[0].user_id, email: user[0].email },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1h' }
        );

        console.log('Login successful for user ID:', user[0].user_id, ' - Generated token:', token);

        res.status(200).json({
            message: 'Login successful',
            token,
            username: user[0].name,
            userId: user[0].user_id
        });
    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ error: 'Error logging in user.' });
    }
});

module.exports = router;