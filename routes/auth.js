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
  const resetLink = `https://serene-churros-d3cac2.netlify.app/ResetPasswordPage/token=${randomString}`; 

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
router.post('/reset-password', async (req, res) => {
  const { randomString, newPassword } = req.body;

  try {
      // Retrieve the user from the database using the random string
      const user = await User.findOne({ resetToken: randomString});

      if(user) {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetToken = null;

        await user.save();

        return res.status(200).json( {message: "Password updated successfully"})
      }else {
        return res.status(404).json({ error: 'Invalid or expired link' });
      }
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
