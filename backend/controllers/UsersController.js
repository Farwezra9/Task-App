const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.getAll = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getById(id);
    if (!user) return res.status(404).json({ message: "User Tidak Ditemukan" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.create = async (req, res) => {
  try {
    const { name, email, password = "123", role = "user", status = "aktif" } = req.body;


    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    const updatedUser = await User.update(id, { name, email, role, status });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.json({ message: "User Dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
