const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./Configs/db');
// const mongoose = require('mongoose');

app.use(express.json());
// mongoose.connect('mongodb://localhost:27017/user')
//     .then(() => console.log('Connected to MongoDB...'))
//     .catch((error) => console.log(error.message));


app.use('/api/user', require('./Routes/AuthRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})