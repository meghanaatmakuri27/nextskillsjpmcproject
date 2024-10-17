const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { jwtAuthMiddleware, generateToken } = require("./../jwt");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");

// Configure NodeMailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST route to add a person (Signup)
router.post("/signup", async (req, res) => {
  console.log("Signup request received:", req.body);
  try {
    const data = req.body;
    const adminUser = await User.findOne({ role: "admin" });
    if (data.role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin user already exists" });
    }
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with same email already exists" });
    }
    const newUser = new User(data);
    const response = await newUser.save();
    console.log("New user created:", response);
    const payload = { id: response.id };
    const token = generateToken(payload);

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Welcome to Our Platform",
      text: `Hi ${newUser.fname},\n\nThank you for signing up!\n\nBest regards,\nYour Company`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email: email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate OTP
    const otp = speakeasy.totp({
      secret: process.env.OTP_SECRET,
      encoding: "base32",
      step: 300, // OTP is valid for 5 minutes
    });

    // Send OTP to user's email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Verify OTP Route
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Verify OTP
    const isValid = speakeasy.totp.verify({
      secret: process.env.OTP_SECRET,
      encoding: "base32",
      token: otp,
      step: 300, // OTP is valid for 5 minutes
      window: 1, // Allow a window of 1 step (5 minutes before or after)
    });

    if (!isValid) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    const payload = { id: user.id, role: user.role };
    const token = generateToken(payload);

    res.status(200).json({
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    console.log(user);
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both currentPassword and newPassword are required" });
    }
    const user = await User.findById(userId);
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid current password" });
    }
    user.password = newPassword;
    await user.save();
    console.log("Password updated");
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
