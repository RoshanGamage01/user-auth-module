const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { paginate, toJSON } = require("./plugins");
const { roles } = require("../config/roles");

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
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error(
          "Password must contain at least one letter and one number"
        );
      }
    },
    private: true, // used by the toJSON plugin
  },
  // user_role_id: {
  //   type: String,
  // },
  role: {
    type: String,
    enum: roles,
    default: 'user',
  },
}, {timestamps: true});

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// const jwtSecretKey = process.env.JWT_SECRET_KEY;

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign({ userId: this._id }, jwtSecretKey);
//   return token;
// };

const User = mongoose.model("User", userSchema);

module.exports = User;