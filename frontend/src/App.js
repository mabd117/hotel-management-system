import React, { useState, useEffect } from 'react';

function App() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetch('http://localhost:31000/api/rooms')
            .then(response => response.json())
            .then(data => setRooms(data));
    }, []);

    return (
        <div className="App">
            <h1>Hotel Management System</h1>
            <ul>
                {rooms.map(room => (
                    <li key={room._id}>{room.number} - {room.type} - ${room.price} - {room.available ? 'Available' : 'Not Available'}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;

