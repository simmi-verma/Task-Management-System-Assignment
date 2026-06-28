const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [3, 'Task title must be at least 3 characters long'],
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'In Progress', 'Completed'],
      message: 'Status must be either Pending, In Progress, or Completed'
    },
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: 'Priority must be either Low, Medium, or High'
    },
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  category: {
    type: String,
    enum: {
      values: ['Work', 'Personal'],
      message: 'Category must be either Work or Personal'
    },
    default: 'Work'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
