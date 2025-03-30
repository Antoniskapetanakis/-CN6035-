const jwt = require('jsonwebtoken');
const db = require('../config/db');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await db.connectDB();
    const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const user = users[0];

    if (password !== user.password_plain) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });

    res.json({ success: true, token, username: user.name });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { loginUser };
