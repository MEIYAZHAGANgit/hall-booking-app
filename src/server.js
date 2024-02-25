const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

let rooms = [];
let bookings = [];

// Endpoint to create a room
app.post('/api/rooms', (req, res) => {
  const { name, seats, amenities, price } = req.body;
  const room = { id: rooms.length + 1, name, seats, amenities, price };
  rooms.push(room);
  res.json(room);
});

// Endpoint to book a room
app.post('/api/bookings', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;

  // Check if the room is already booked for the given date and time
  const isRoomBooked = bookings.some(booking => (
    booking.roomId === roomId &&
    booking.date === date &&
    (
      (startTime >= booking.startTime && startTime < booking.endTime) ||
      (endTime > booking.startTime && endTime <= booking.endTime)
    )
  ));

  if (isRoomBooked) {
    return res.status(400).json({ error: 'Room already booked for the given date and time' });
  }

  const booking = { id: bookings.length + 1, customerName, date, startTime, endTime, roomId };
  bookings.push(booking);
  res.json(booking);
});

// Endpoint to list all rooms with booked data
app.get('/api/rooms/booked-data', (req, res) => {
  const roomsWithBookedData = rooms.map(room => {
    const bookedData = bookings.filter(booking => booking.roomId === room.id);
    return {
      ...room,
      bookedData,
    };
  });
  res.json(roomsWithBookedData);
});

// Endpoint to list all customers with booked data
app.get('/api/customers/booked-data', (req, res) => {
  const customersWithBookedData = bookings.map(booking => {
    const room = rooms.find(room => room.id === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: room ? room.name : 'N/A',
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
  });
  res.json(customersWithBookedData);
});

// Endpoint to list how many times a customer has booked the room
app.get('/api/customers/booking-history', (req, res) => {
  const bookingHistory = bookings.map(booking => {
    const room = rooms.find(room => room.id === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: room ? room.name : 'N/A',
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: booking.id,
      bookingDate: new Date().toISOString(),
      bookingStatus: 'Confirmed',
    };
  });
  res.json(bookingHistory);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
