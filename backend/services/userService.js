const pool = require('../config/db');
const getUserByEmail = async (email) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
        conn.release();
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw error;
    }
};

const createUser = async (name, email, hashedPassword) => {
    try {
        const conn = await pool.getConnection();
        await conn.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
        conn.release();
    } catch (error) {
        throw error;
    }
};
module.exports = { getUserByEmail, createUser };
