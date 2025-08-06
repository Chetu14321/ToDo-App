// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const todoController = require('../controller/ToDoController');

// List-level routes
router.get('/', auth, todoController.getTodoLists);
router.post('/', auth, todoController.createTodoList);
router.put('/:id', auth, todoController.updateTodoList);
router.delete('/:id', auth, todoController.deleteTodoList);

// Item-level routes
router.post('/:listId/items', auth, todoController.addTodoItem);
router.put('/:listId/items/:itemId', auth, todoController.updateTodoItem);
router.delete('/:listId/items/:itemId', auth, todoController.deleteTodoItem);

module.exports = router;
