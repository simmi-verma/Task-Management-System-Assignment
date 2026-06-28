# TaskFlow — Premium Task Management System

TaskFlow is a modern, full-stack (MERN) Task Management Application designed with a sleek, glassmorphic user interface. It provides users with a comprehensive dashboard to track, organize, and manage their daily activities, featuring real-time analytics, dynamic search, sorting, filtering, and robust validation.

---

## 🚀 Key Features

- **Full CRUD Support**: Effortlessly create, read, update, and delete tasks with instant UI updates.
- **Dynamic Task Dashboard**:
  - **Live Search**: Instantaneous search matching task titles and descriptions.
  - **Multi-Criteria Filtering**: Filter tasks seamlessly by *Status* (Pending, In Progress, Completed), *Priority* (Low, Medium, High), and *Category* (Work, Personal).
  - **Sorting Options**: Sort tasks dynamically by Due Date, Priority, and Creation Date.
- **Dashboard Analytics & Statistics**:
  - Real-time counters showing:
    - **Total Tasks**
    - **Pending Tasks**
    - **In Progress Tasks**
    - **Completed Tasks**
    - **Overdue Tasks** (automatically determined by matching current time against task due dates).
  - Summaries of tasks categorized by priority levels.
- **Robust Schema & Validation**:
  - Mongoose models enforce validation constraints (e.g., minimum 3 characters for task titles, valid status/priority/category enums).
  - Built-in error handling and responsive notification toasts for user feedback.
- **Premium Glassmorphic Design**:
  - Modern typography using Google Fonts (*Inter* and *Outfit*).
  - Hand-crafted Vanilla CSS rules implementing a custom design system with custom variables, smooth transitions, and premium glassmorphic effects.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://react.dev/) (v19) with [Vite](https://vite.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Custom Glassmorphic Design System)

### Backend & Database
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **ORM**: [Mongoose ODM](https://mongoosejs.com/)

---

## 📂 Project Structure

```text
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components (StatsPanel, TaskCard, TaskModal, etc.)
│   │   ├── App.jsx         # Main application controller & state manager
│   │   ├── index.css       # Core design system and global styles
│   │   └── main.jsx        # App entry point
│   ├── vite.config.js      # Vite configurations
│   └── package.json        # Frontend dependencies & run scripts
│
└── server/                 # Express backend API server
    ├── models/             # Mongoose database models (Task.js)
    ├── routes/             # RESTful API route handlers (taskRoutes.js)
    ├── server.js           # Server initialization and db connection seeding
    └── package.json        # Backend dependencies & run scripts
```

---

## 💻 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18 or above recommended)
- **npm** (comes packaged with Node.js)
- **MongoDB** (local installation or MongoDB Atlas cluster connection)

---

### Step-by-Step Installation

#### 1. Clone the repository
```bash
git clone https://github.com/simmi-verma/Task-Management-System-Assignment.git
cd Task-Management-System-Assignment
```

*(Note: Navigate into the directory containing both `client` and `server` subfolders).*

#### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Open the `.env` file and configure your port and connection URI:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```
5. Start the backend development server (will seed the database with mock tasks if empty):
   ```bash
   npm run dev
   ```

The backend server should now be running on `http://localhost:5000`.

---

#### 3. Frontend Setup
1. Open a new terminal window and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Define the backend URL in the `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
5. Run the frontend development server:
   ```bash
   npm run dev
   ```

The application will start, usually accessible at `http://localhost:5173`.

---

## 📡 API Endpoints

The backend server exposes the following RESTful API endpoints at `/api/tasks`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/tasks` | Retrieve all tasks (supports query filters: `status`, `priority`, `category`, search query `q`, and sorting `sortBy`). |
| **GET** | `/api/tasks/stats` | Retrieve real-time task count metrics (total, pending, progress, completed, overdue). |
| **GET** | `/api/tasks/:id` | Fetch details of a single task by ID. |
| **POST** | `/api/tasks` | Create a new task. |
| **PUT** | `/api/tasks/:id` | Update an existing task. |
| **DELETE** | `/api/tasks/:id` | Delete a task. |
| **GET** | `/api/health` | Service status health check. |

---

## 📝 License
This project is licensed under the ISC License.
