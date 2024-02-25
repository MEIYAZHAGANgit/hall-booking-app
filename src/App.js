import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customerBookingHistory, setCustomerBookingHistory] = useState([]);

  useEffect(() => {
    // Fetch rooms and bookings data from your backend
    // Replace this with your actual API endpoint
    fetch('http://localhost:5000/api/rooms/booked-data')
      .then(response => response.json())
      .then(data => setRooms(data));

    fetch('http://localhost:5000/api/customers/booked-data')
      .then(response => response.json())
      .then(data => setBookings(data));

    fetch('http://localhost:5000/api/customers/booking-history')
      .then(response => response.json())
      .then(data => setCustomerBookingHistory(data));
  }, []);

  return (
    <div className="App">
      <h1>Hall Booking App</h1>

      {/* Display rooms */}
      <div>
        <h2>Rooms</h2>
        <ul>
          {rooms.map(room => (
            <li key={room.id}>
              {room.name} - Seats: {room.seats}, Amenities: {room.amenities}, Price: {room.price}
            </li>
          ))}
        </ul>
      </div>

      {/* Display bookings */}
      <div>
        <h2>Bookings</h2>
        <ul>
          {bookings.map(booking => (
            <li key={booking.customerName + booking.date + booking.startTime}>
              {booking.customerName} booked {booking.roomName} on {booking.date} from {booking.startTime} to {booking.endTime}
            </li>
          ))}
        </ul>
      </div>

          }