
const express = require('express');
const { promisePool } = require('../config/db');
const authenticateJWT = require('../middleware/authenticateJWT');
const router = express.Router();

router.post('/', authenticateJWT, async (req, res) => {
    const { restaurantId, reservation_date, reservation_time, people_count, full_name } = req.body;
    const userId = req.user.userId; 

    console.log('POST /api/reservations - User ID:', userId, 'Body:', req.body);

    if (!restaurantId || !reservation_date || !reservation_time || !people_count || !full_name) {
        console.log('POST /api/reservations - Missing required fields');
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const [exists] = await promisePool.query(
            `SELECT * FROM reservations
             WHERE user_id = ? AND restaurant_id = ? AND reservation_date = ? AND reservation_time = ?`,
            [userId, restaurantId, reservation_date.split('T')[0], reservation_time]
        );

        if (exists.length > 0) {
            console.log('POST /api/reservations - Reservation already exists');
            return res.status(409).json({ message: 'Reservation already exists.' });
        }

        const query = `
            INSERT INTO reservations (user_id, restaurant_id, reservation_date, reservation_time, people_count, full_name)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const values = [userId, restaurantId, reservation_date.split('T')[0], reservation_time, people_count, full_name];
        const [result] = await promisePool.query(query, values);

        console.log('POST /api/reservations - Reservation created successfully with ID:', result.insertId);
        res.status(201).json({ message: 'Reservation created successfully', reservationId: result.insertId });
    } catch (error) {
        console.error('POST /api/reservations - Error inserting reservation:', error);
        res.status(500).json({ message: 'Failed to create reservation', error: error.message });
    }
});

router.get('/user/:userId', authenticateJWT, async (req, res) => {
    const { userId } = req.params;
    const loggedInUserId = req.user.userId;

    console.log('GET /api/reservations/user/:userId - Requested User ID:', userId, 'Logged In User ID:', loggedInUserId);

    if (loggedInUserId !== parseInt(userId, 10)) {
        console.log('GET /api/reservations/user/:userId - Unauthorized access attempt');
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        console.log('GET /api/reservations/user/:userId - Current Date:', currentDate);

        const [currentReservations] = await promisePool.query(
            `SELECT r.id, r.reservation_date, r.reservation_time, r.people_count, r.full_name, r.restaurant_id, rest.name AS restaurant_name
             FROM reservations r
             JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
             WHERE r.user_id = ? AND r.reservation_date >= ?
             ORDER BY r.reservation_date ASC`,
            [userId, currentDate]
        );
        console.log('GET /api/reservations/user/:userId - Current Reservations:', currentReservations);

        const [pastReservations] = await promisePool.query(
            `SELECT r.id, r.reservation_date, r.reservation_time, r.people_count, r.full_name, r.restaurant_id, rest.name AS restaurant_name
             FROM reservations r
             JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
             WHERE r.user_id = ? AND r.reservation_date < ?
             ORDER BY r.reservation_date DESC`,
            [userId, currentDate]
        );
        console.log('GET /api/reservations/user/:userId - Past Reservations:', pastReservations);
        res.status(200).json({ current: currentReservations, past: pastReservations });
    } catch (error) {
        console.error('GET /api/reservations/user/:userId - Error fetching reservations:', error);
        res.status(500).json({ message: 'Failed to fetch reservations', error: error.message });
    }
});

router.put('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { reservation_date, reservation_time, people_count, full_name, restaurantId } = req.body;
    const userId = req.user.userId;

    console.log('PUT /api/reservations/:id - Reservation ID:', id, 'User ID:', userId, 'Body:', req.body);

    if (!reservation_date || !reservation_time || !people_count || !full_name || !restaurantId) {
        console.log('PUT /api/reservations/:id - Missing required fields for update');
        return res.status(400).json({ message: 'All fields are required for update' });
    }
    try {
        const [reservation] = await promisePool.query('SELECT * FROM reservations WHERE id = ?', [id]);
        console.log('PUT /api/reservations/:id - Reservation found:', reservation);
        if (reservation.length === 0) {
            console.log('PUT /api/reservations/:id - Reservation not found');
            return res.status(404).json({ message: 'Reservation not found' });
        }

        if (reservation[0].user_id !== userId) {
            console.log('PUT /api/reservations/:id - Unauthorized update attempt. Reservation User ID:', reservation[0].user_id, 'Logged In User ID:', userId);
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await promisePool.query(
            `UPDATE reservations
             SET reservation_date = ?, reservation_time = ?, people_count = ?, full_name = ?, restaurant_id = ?
             WHERE id = ?`,
            [reservation_date.split('T')[0], reservation_time, people_count, full_name, restaurantId, id]
        );
        console.log('PUT /api/reservations/:id - Reservation updated successfully');
        res.status(200).json({ message: 'Reservation updated successfully' });
    } catch (error) {
        console.error('PUT /api/reservations/:id - Error updating reservation:', error);
        res.status(500).json({ message: 'Failed to update reservation', error: error.message });
    }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    console.log('DELETE /api/reservations/:id - Reservation ID:', id, 'User ID:', userId);

    try {
        const [reservation] = await promisePool.query('SELECT * FROM reservations WHERE id = ?', [id]);
        console.log('DELETE /api/reservations/:id - Reservation found:', reservation);

        if (reservation.length === 0) {
            console.log('DELETE /api/reservations/:id - Reservation not found');
            return res.status(404).json({ message: 'Reservation not found' });
        }

        if (reservation[0].user_id !== userId) {
            console.log('DELETE /api/reservations/:id - Unauthorized deletion attempt. Reservation User ID:', reservation[0].user_id, 'Logged In User ID:', userId);
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const [deleteResult] = await promisePool.query('DELETE FROM reservations WHERE id = ?', [id]);
        console.log('DELETE /api/reservations/:id - Delete Result:', deleteResult);
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/reservations/:id - Error deleting reservation:', error);
        res.status(500).json({ message: 'Failed to delete reservation', error: error.message });
    }
});

module.exports = router;