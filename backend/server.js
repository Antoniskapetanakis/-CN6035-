const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { promisePool } = require('./config/db'); 
const jwt = require('jsonwebtoken');

const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurants');
const reservationRoutes = require('./routes/reservations');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:8081', credentials: true }));


const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.sendStatus(403); 
    }
    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

app.get('/api/user/credentials/:userId', authenticateJWT, (req, res) => {
    const userId = req.params.userId;


    if (req.user.userId !== parseInt(userId, 10)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    promisePool.execute('SELECT username, email, password FROM users WHERE user_id = ?', [userId])
        .then(([results]) => {
            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }


            const { username, email, password } = results[0];
            res.json({ username, email, password });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: 'Database error', error: err });
        });
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);


app.use('/api/reservations', reservationRoutes);


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});