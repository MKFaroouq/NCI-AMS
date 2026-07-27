const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io');

const app = express();
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:5173', // بورت الرياكت بتاعك
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));

// Middleware to parse JSON bodies
app.use(express.json());

const queueRoutes = require('./routes/queueRoutes'); 

app.use('/api', queueRoutes);

// Connect to MongoDB
async function DBconnection(){
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to DB');
    } catch (error) {
        console.error('Error connecting to DB:', error);
    }
} 
DBconnection();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // أو بورت الفرونت إند عندك (مثلاً 3000 أو 5173)
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log(` new user connect to system: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(' user disconnected from system: ', socket.id);
    });
});

// Port
const PORT = process.env.PORT || 3000;

server.listen(PORT,() =>{

    console.log(`Server is running on port ${PORT}`);
})