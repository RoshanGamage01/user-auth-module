const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./Configs/db');
const cors = require('cors');
// const mongoose = require('mongoose');

app.use(express.json());
// mongoose.connect('mongodb://localhost:27017/user')
//     .then(() => console.log('Connected to MongoDB...'))
//     .catch((error) => console.log(error.message));

app.use(cors());


app.use('/api/users', require('./Routes/AuthRoutes'));
app.use('/api/role', require('./Routes/UserRoleRoutes'));
app.use('/api/user-permissions', require('./Routes/UserPermissions'));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})