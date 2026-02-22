const Todo = require('../models/todoModel');

exports.create = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title wajib diisi' });
    }

    const todo = await Todo.create(req.user.id, req.body);
    res.status(201).json(todo);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal membuat todo' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const todos = await Todo.getAll(req.user.id);
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
};

exports.getById = async (req, res) => {
  try {
    const todo = await Todo.getById(req.params.id, req.user.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo tidak ditemukan' });
    }

    res.json(todo);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Todo.update(
      req.params.id,
      req.user.id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: 'Todo tidak ditemukan atau bukan milik anda' });
    }

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal update todo' });
  }
};

exports.delete = async (req, res) => {
  try {
    const success = await Todo.delete(req.params.id, req.user.id);

    if (!success) {
      return res.status(404).json({ message: 'Todo tidak ditemukan' });
    }

    res.json({ message: 'Todo berhasil dihapus' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus todo' });
  }
};