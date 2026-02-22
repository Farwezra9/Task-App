const categoryModel = require('../models/categoriesModel');

exports.getAll = async (req, res) => {
  try {
    const categories = await categoryModel.getAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil kategori' });
  }
};