const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskFlow API is running' });
});

// Initial mock dataset for database seeding
const initialTasks = [
  {
    title: "Complete MERN Tech Assignment",
    description: "Implement CRUD operations, validations, search, filtering, and responsive UI for the COLL-EDGE CONNECT intern assignment.",
    status: "In Progress",
    priority: "High",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    category: "Work"
  },
  {
    title: "Refactor React Application State",
    description: "Replace the legacy review components with a clean task dashboard and implement premium glassmorphic styling.",
    status: "In Progress",
    priority: "High",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    category: "Work"
  },
  {
    title: "Buy Groceries & Weekly Meal Prep",
    description: "Get fresh spinach, eggs, milk, chicken breast, and oats. Meal prep for the upcoming weekdays.",
    status: "Pending",
    priority: "Low",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    category: "Personal"
  },
  {
    title: "Morning Cardio & Strength Training",
    description: "Perform 30 minutes of high-intensity interval training followed by a full body workout.",
    status: "Completed",
    priority: "Medium",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday
    category: "Personal"
  },
  {
    title: "Read Chapter 4 of Node.js Design Patterns",
    description: "Read about asynchronous control flow patterns using promises and async/await.",
    status: "Pending",
    priority: "Medium",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    category: "Work"
  }
];

// Connect to MongoDB and Seed Data
const connectDbAndSeed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tasktracker';
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB.');

    // Seeding database if empty
    const count = await Task.countDocuments();
    if (count === 0) {
      console.log('Task database is empty. Seeding initial data...');
      await Task.insertMany(initialTasks);
      console.log('Successfully seeded database with 5 initial tasks.');
    } else {
      console.log(`Database already contains ${count} tasks. Skipping seeding.`);
    }

    // Start Server after database connection is verified
    app.listen(PORT, () => {
      console.log(`Express Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Database connection / initialization failed:', err);
    process.exit(1);
  }
};

connectDbAndSeed();
