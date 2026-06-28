import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info,
  X,
  Plus,
  FolderOpen,
  Search,
  Sparkles
} from 'lucide-react';
import StatsPanel from './components/StatsPanel';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt:desc');
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Fetch tasks and stats from backend API whenever filters change
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [categoryFilter, statusFilter, priorityFilter, searchQuery, sortBy]);

  const fetchTasks = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (categoryFilter !== 'all') queryParams.append('category', categoryFilter);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (priorityFilter !== 'all') queryParams.append('priority', priorityFilter);
      if (searchQuery) queryParams.append('q', searchQuery);
      if (sortBy) queryParams.append('sortBy', sortBy);

      const response = await fetch(`/api/tasks?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to retrieve tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showToast('Error', 'Failed to retrieve tasks from database API.', 'danger');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/tasks/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Toast System
  const showToast = (title, message, type = 'primary') => {
    const id = Date.now();
    const newToast = { id, title, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after 4s
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Create Task Handler
  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create task');
      }

      showToast('Success', `Task "${result.title}" created successfully.`, 'success');
      setIsModalOpen(false);
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Error creating task:', error);
      showToast('Creation Failed', error.message, 'danger');
    }
  };

  // Update Task Handler
  const handleUpdateTask = async (taskData) => {
    if (!editTask) return;
    try {
      const response = await fetch(`/api/tasks/${editTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update task');
      }

      showToast('Updated', `Task "${result.title}" has been modified.`, 'success');
      setIsModalOpen(false);
      setEditTask(null);
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Error updating task:', error);
      showToast('Update Failed', error.message, 'danger');
    }
  };

  // Status Toggle Quick Handler
  const handleStatusToggle = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      const toastMessage = newStatus === 'Completed' 
        ? `Task marked as completed! 🎉` 
        : `Task status reset to ${newStatus}.`;
      
      showToast('Status Updated', toastMessage, 'success');
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Status Toggle Failed', 'Could not update task status.', 'danger');
    }
  };

  // Delete Task Handler
  const handleDeleteTask = async (taskId) => {

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      showToast('Deleted', 'Task has been permanently removed.', 'primary');
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Error deleting task:', error);
      showToast('Deletion Failed', 'Could not delete task.', 'danger');
    }
  };

  const openCreateModal = () => {
    setEditTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  const handleOverdueFilter = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setSortBy('dueDate:asc');
    showToast('Filtered Overdue', 'Showing active tasks ordered by due date.', 'primary');
  };

  // Resolve Toast Icon
  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon text-success" />;
      case 'danger':
        return <AlertTriangle className="toast-icon text-danger" />;
      case 'primary':
      default:
        return <Info className="toast-icon text-primary" />;
    }
  };

  return (
    <div className="app-container">
      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <div className="logo-container">
              <span className="logo-text" style={{ fontSize: '24px' }}>Task<span>Flow</span></span>
              <span className="badge badge-beta">Tracker</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary btn-pulse" onClick={openCreateModal}>
              <Plus size={18} />
              <span>Add Task</span>
            </button>
          </div>
        </header>

        {/* Stats Panel Widget */}
        <StatsPanel 
          stats={stats} 
          onOverdueClick={handleOverdueFilter}
        />

        {/* Filters and Sorting Board Controls */}
        <div className="board-controls" style={{ marginBottom: '24px' }}>
          <div className="filters-group">
            {/* Search Input */}
            <div className="filter-item" style={{ minWidth: '220px' }}>
              <div className="header-search" style={{ background: 'rgba(15, 23, 42, 0.02)', border: '1px solid var(--border-glass)', maxWidth: 'none', width: '100%' }}>
                <Search size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..." 
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-item">
              <label htmlFor="filter-category">Category</label>
              <select 
                id="filter-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="filter-item">
              <label htmlFor="filter-status">Status</label>
              <select 
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="filter-item">
              <label htmlFor="filter-priority">Priority</label>
              <select 
                id="filter-priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Sort Control */}
          <div className="filter-item">
            <label htmlFor="sort-tasks">Sort By</label>
            <select 
              id="sort-tasks"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt:desc">Newest Created</option>
              <option value="createdAt:asc">Oldest Created</option>
              <option value="dueDate:asc">Due Date (Soonest)</option>
              <option value="dueDate:desc">Due Date (Furthest)</option>
            </select>
          </div>
        </div>

        {/* Task Grid display */}
        <div className="task-grid">
          {tasks.map(task => (
            <TaskCard 
              key={task._id}
              task={task}
              onStatusToggle={handleStatusToggle}
              onEditClick={openEditModal}
              onDeleteClick={handleDeleteTask}
            />
          ))}

          {tasks.length === 0 && (
            <div className="glass-card empty-state">
              <div className="empty-icon-glow">
                <FolderOpen size={32} />
              </div>
              <h4>No tasks found</h4>
              <p>Create a task to start tracking your to-do list items.</p>
              <button className="btn btn-primary" onClick={openCreateModal}>
                <Plus size={18} />
                <span>Create Task</span>
              </button>
            </div>
          )}
        </div>

      </main>

      {/* Task Creation & Edit Modal */}
      <TaskModal 
        isOpen={isModalOpen}
        editTask={editTask}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editTask ? handleUpdateTask : handleCreateTask}
      />

      {/* Toasts Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            {getToastIcon(toast.type)}
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
