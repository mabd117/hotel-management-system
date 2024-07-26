const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://mongo:27017/hotel', { useNewUrlParser: true, useUnifiedTopology: true });

const RoomSchema = new mongoose.Schema({
    number: Number,
    type: String,
    price: Number,
    status: String
});

const Room = mongoose.model('Room', RoomSchema);

app.use(express.json());

app.get('/rooms', async (req, res) => {
    const rooms = await Room.find();
    res.json(rooms);
});

app.post('/rooms', async (req, res) => {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
});

app.listen(3000, () => {
    console.log('Backend server is running on port 3000');
});

