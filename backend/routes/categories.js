const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/CategoriesController');
const { verifyToken, isUser } = require('../middleware/middleware');

router.get('/', verifyToken, isUser, categoriesController.getAll);

module.exports = router;