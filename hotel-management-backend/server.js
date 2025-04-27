// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sagar@1234', // update with your MySQL root password
  database: 'hotel__management_001' // change this if your DB name is different
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

// ROUTE: Handle booking from user/staff frontend
app.post('/api/book', (req, res) => {
  const {
   full_name, email, phone_number, address,
    check_in_date, check_out_date,
     total_visits, total_amount,
    paymentMethod, 
    isOffline
  } = req.body;

  // 1. Insert into guests table
  const guestQuery = `
    INSERT INTO guests (full_name, email, phone_number, address, total_visits)
    VALUES (?, ?, ?, ?, ?)
  `;
  const guestData = [full_name, email, phone_number, address, total_visits];

  db.query(guestQuery, guestData, (err, guestResult) => {
    if (err) {
      console.error('Error inserting into guests table:', err);
      return res.status(500).send('Failed to insert guest.');
    }

    const guestId = guestResult.insertId;

    // 2. Insert into bookings table
    const bookingQuery = `
      INSERT INTO bookings (guest_id, check_in_date, check_out_date, total_amount)
      VALUES (?, ?, ?, ?)
    `;
    const bookingData = [
      guestId, check_in_date, check_out_date, total_amount,
      paymentMethod, 'pending', isOffline ? 1 : 0
    ];

    db.query(bookingQuery, bookingData, (err, bookingResult) => {
      if (err) {
        console.error('Error inserting into bookings table:', err);
        return res.status(500).send('Failed to insert booking.');
      }

      // Done: trigger will handle frequent guest logic
      res.status(200).send('Booking and guest data saved successfully.');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
