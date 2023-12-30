const mongoose = require('mongoose');
// Define the MongoDB connection URL
const mongoURI = `mongodb://127.0.0.1:27017/${process.env.DB_NAME}`;



// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB...'))
    .catch((error) => console.log(error.message));


// Get the default connection
const db = mongoose.connection;


// Handle MongoDB connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


module.exports = db;