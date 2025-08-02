import { EMAIL_VERIFY_TEMPLATE } from '../congfig/emailTemplates.js';
import transporter from '../congfig/nodemailer.js'
import userModel from '../models/userModel.js'

import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const { name, dob, email } = req.body;

    if (!name || !dob || !email) {
      return res.json({ success: false, message: "Missing Detail" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const user = new userModel({ name, dob, email });
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = otp;
    user.otpExpireAt = Date.now() + 15 * 60 * 1000;
    console.log('Saving user to database...');
    await user.save();
    console.log('User saved successfully.');

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    };

    console.log('Sending email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
    return res.json({ success: true, userId: user._id, message: "OTP sent on Email" });

  } catch (error) {
    console.error('Register route error:', error)
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = otp;
    user.otpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Login OTP',
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, userId: user._id, token, message: "OTP sent to your email" });

  } catch (error) {
    console.error('Register route error:', error)
    return res.json({ success: false, message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.otp === '' || user.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.otp = '';
    user.otpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const googleLoginAndRegister = async (req, res) => {
  try {
    const { name, email } = req.body; 

    const user = await userModel.findOne({ email });
    
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token, user: { name: user.name, email: user.email } });
    } else {
      const newUser = new userModel({
        name,
        email,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      res.json({ success: true, token, user: { name: newUser.name, email: newUser.email } });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};