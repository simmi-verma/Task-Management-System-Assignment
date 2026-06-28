const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get statistics for tasks
router.get('/stats', async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'Pending' });
    const inProgress = await Task.countDocuments({ status: 'In Progress' });
    const completed = await Task.countDocuments({ status: 'Completed' });
    
    // Overdue tasks: status is not Completed and dueDate is less than current time
    const now = new Date();
    const overdue = await Task.countDocuments({
      status: { $ne: 'Completed' },
      dueDate: { $lt: now }
    });

    // Priority counts
    const highPriority = await Task.countDocuments({ priority: 'High' });
    const mediumPriority = await Task.countDocuments({ priority: 'Medium' });
    const lowPriority = await Task.countDocuments({ priority: 'Low' });

    res.json({
      total,
      pending,
      inProgress,
      completed,
      overdue,
      priority: {
        High: highPriority,
        Medium: mediumPriority,
        Low: lowPriority
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task statistics', error: err.message });
  }
});

// Get all tasks with filtering, search, and sorting
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, q, sortBy } = req.query;
    
    // Build query object
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Text search in title or description
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Build sort object
    let sort = { createdAt: -1 }; // default sorting: newest first
    if (sortBy) {
      const parts = sortBy.split(':');
      if (parts.length === 2) {
        const field = parts[0];
        const order = parts[1] === 'desc' ? -1 : 1;
        sort = { [field]: order };
      }
    }

    const tasks = await Task.find(query).sort(sort);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving tasks', error: err.message });
  }
});

// Get single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task details', error: err.message });
  }
});

// Create a new task (with validation)
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, category } = req.body;

    // Check for title validation (frontend will also do this, but backend is critical)
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: 'Title is required and must be at least 3 characters long' });
    }

    if (!dueDate) {
      return res.status(400).json({ message: 'Due date is required' });
    }

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      category
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
});

// Update a task (with validation)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, category } = req.body;

    // Custom validations
    if (title && title.trim().length < 3) {
      return res.status(400).json({ message: 'Title must be at least 3 characters long' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Apply updates if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (category !== undefined) task.category = category;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', taskId: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
});

module.exports = router;
