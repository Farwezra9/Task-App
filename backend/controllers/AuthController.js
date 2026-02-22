const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const SECRET_KEY = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hashedPassword, role: 'user', status: 'aktif'
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ token, name: user.name, email: user.email, role: user.role, status: user.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const expiresIn = rememberMe ? '7d' : '1d';

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.json({
      token,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 30);

    await User.setResetToken(email, resetToken, expiry);

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password",
      html: `
        <h3>Reset Password</h3>
        <p>Link berlaku 30 menit</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ message: "Link reset password dikirim ke email" });

  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Token tidak valid atau expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updatePassword(user.id, hashedPassword);

    res.json({ message: "Password berhasil direset" });

  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};