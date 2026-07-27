require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');


const app = express();


// Middleware to parse JSON bodies
app.use(express.json());



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
const PORT = process.env.PORT || 3000;

app.listen(PORT,() =>{

    console.log(`Server is running on port ${PORT}`);
})