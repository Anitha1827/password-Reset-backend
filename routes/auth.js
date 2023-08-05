const express = require("express");
const router = express.Router();
const mongoose = require ("mongoose")
const User = require("../models/user.js")
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require('randomstring');

//Implement the forgot password route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const User = mongoose.model('User');
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charLength = characters.length;
    let randomString = '';

    for (let i=0; i< length; i++){
      const randomIndex = Math.floor(Math.random() * charLength);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }


const randomString = generateRandomString(20);
user.resetToken = randomString;
await user.save();

  // Send the reset password link to the user's email
  const resetLink = `https://serene-churros-d3cac2.netlify.app/resetpassword/${randomString}`; 

  // Define the sendResetEmail function
const sendResetEmail = (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'anitha.h2711@gmail.com',
      pass: 'xnqsyrzdqztmlxbj',
    },
  });

  const mailOptions = {
    from: 'anitha.h2711@gmail.com',
    to: email,
    subject: 'Password Reset Link',
    html: `<p>Hello,</p>
          <p>Please click the following link to reset your password:</p>
          <p><a href="${resetLink}">Reset Password</a></p>
          <p>If you did not request a password reset, please ignore this email.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      // Handle the error, maybe return an error response to the client
    } else {
      console.log('Email sent:', info.response);
      // Handle the success, maybe return a success response to the client
    }
  });
};

sendResetEmail(email, resetLink, randomString);

  res.json({ message: 'Reset password link sent to your email.' });

})


// Reset Password Route
router.post('/reset-password/:randomString', async (req, res) => {
  const { randomString } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ randomString });

    if (!user) {
      return res.status(404).json({ error: 'Invalid random string' });
    }

    // Update user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.randomString = null; // Clear the random string
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Register page

  router.post('/register' , async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        email: email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'User registration failed' });
    }

  })

module.exports = router;
