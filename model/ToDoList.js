// models/TodoList.js
const mongoose = require('mongoose');

const todoItemSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const todoListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [todoItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('TodoList', todoListSchema);
