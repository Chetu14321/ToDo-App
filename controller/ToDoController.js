// controllers/todoController.js
const TodoList = require('../model/ToDoList');

// // Get all todo lists for logged-in user
exports.getTodoLists = async (req, res) => {
  try {
    const lists = await TodoList.find({ user: req.userId });
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get to-do lists' });
  }
};

// Create a new todo list
exports.createTodoList = async (req, res) => {
  try {
    const newList = new TodoList({
      name: req.body.name,
      user: req.userId
    });
    await newList.save();
    res.status(201).json(newList);
  } catch (err) {
    console.error("Create To-do Error:", err);
    res.status(500).json({ error: 'Failed to create to-do list' });
  }
};

// Update a todo list name
exports.updateTodoList = async (req, res) => {
  try {
    const list = await TodoList.findOne({ _id: req.params.id, user: req.userId });
    if (!list) return res.status(404).json({ error: 'To-do list not found' });

    list.name = req.body.name || list.name;
    await list.save();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update to-do list' });
  }
};

// Delete a todo list
exports.deleteTodoList = async (req, res) => {
  try {
    const deleted = await TodoList.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ error: 'To-do list not found' });

    res.status(200).json({ message: 'To-do list deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete to-do list' });
  }
};

// Add a new item to a list
exports.addTodoItem = async (req, res) => {
  try {
    const { task } = req.body;

    if (!task || task.trim() === '') {
      return res.status(400).json({ error: 'Task is required' });
    }

    const list = await TodoList.findOne({ _id: req.params.listId, user: req.userId });
    if (!list) return res.status(404).json({ error: 'List not found' });

    list.items.push({ task: task.trim() });
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    console.error('Add Item Error:', err);
    res.status(500).json({ error: 'Failed to add item' });
  }
};


// Update a specific item
exports.updateTodoItem = async (req, res) => {
  try {
    const list = await TodoList.findOne({ _id: req.params.listId, user: req.userId });
    if (!list) return res.status(404).json({ error: 'List not found' });

    const item = list.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.task = req.body.task || item.task;
    item.completed = req.body.completed ?? item.completed;
    await list.save();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
};

// Delete an item from a list
exports.deleteTodoItem = async (req, res) => {
  try {
    const list = await TodoList.findOne({ _id: req.params.listId, user: req.userId });
    if (!list) return res.status(404).json({ error: 'List not found' });

    list.items = list.items.filter(item => item._id.toString() !== req.params.itemId);
    await list.save();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
