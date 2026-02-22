const express = require('express');
const router = express.Router();
const TodosController = require('../controllers/TodosController');
const { verifyToken, isUser } = require('../middleware/middleware');

router.get('/', verifyToken, isUser, TodosController.getAll);
router.get('/:id', verifyToken, isUser, TodosController.getById);
router.post('/', verifyToken, isUser, TodosController.create);
router.put('/:id', verifyToken, isUser, TodosController.update);
router.delete('/:id', verifyToken, isUser, TodosController.delete);

module.exports = router;
