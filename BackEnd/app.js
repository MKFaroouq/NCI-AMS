require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');


const bookingRoutes = require('./routes/bookingRoutes');
const clinicRoutes  = require('./routes/clinicRoutes');
const authRoutes    = require('./routes/authRoutes');
const app = express();


// Middleware to parse JSON bodies
app.use(express.json());

// routes
// app.use('/api', routes);
app.use("/api/auth", authRoutes);
// note* : you can use app.use("/auth", authRoutes) becase that we use in routes login without auth
app.use("/api", bookingRoutes);
app.use("/api/clinics", clinicRoutes);


// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
async function DBconnection(){
    try{
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/patientRequest');
        console.log('Connected to DB');
    } catch (error) {
        console.error('Error connecting to DB:', error.message);
        process.exit(1); // Exit the process with failure
    }
} 

DBconnection();


// Port
const PORT = process.env.PORT || 8000;

app.listen(PORT,() =>{

    console.log(`Server is running on port ${PORT}`);
})