const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
      },
      resetToken: {
        type: String,
        default: null,
      },
      resetPasswordToken: String,
      resetPasswordExpires: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;