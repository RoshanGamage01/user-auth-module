const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      NIC: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      pin: {
        type: String,
        unique: true
      },
      EMP_number: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      user_role_id: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
      islogin:{
        type: Boolean
      },
})

const jwtSecretKey = process.env.JWT_SECRET_KEY;

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({userId: this._id}, jwtSecretKey);
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        user_name: Joi.string().required(),
        email: Joi.string().required().email(),
        NIC: Joi.string().required(),
        password: Joi.string().required(),
        pin: Joi.string().required().min(6).max(6),
        EMP_number: Joi.number().required(),
        address: Joi.string().required(),
        user_role_id: Joi.string().required(),
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;