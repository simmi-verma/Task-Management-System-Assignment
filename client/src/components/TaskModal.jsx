import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function TaskModal({ isOpen, editTask, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Other');
  
  // Validation error states
  const [errors, setErrors] = useState({});

  // Reset inputs or pre-populate if editTask changes
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || '');
      setDescription(editTask.description || '');
      setStatus(editTask.status || 'Pending');
      setPriority(editTask.priority || 'Medium');
      setCategory(editTask.category || 'Other');
      
      // Format date to YYYY-MM-DD for date input
      if (editTask.dueDate) {
        const d = new Date(editTask.dueDate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        setDueDate(`${year}-${month}-${day}`);
      } else {
        setDueDate('');
      }
    } else {
      // Clear form for creation
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setPriority('Medium');
      setDueDate('');
      setCategory('Other');
    }
    setErrors({});
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  // Validation function
  const validateForm = () => {
    const tempErrors = {};
    if (!title.trim()) {
      tempErrors.title = 'Task title is required';
    } else if (title.trim().length < 3) {
      tempErrors.title = 'Title must be at least 3 characters long';
    } else if (title.trim().length > 100) {
      tempErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!dueDate) {
      tempErrors.dueDate = 'Due date is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: new Date(dueDate),
      category
    };

    onSubmit(taskData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card modal-container animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Sparkles className="icon-sparkle text-indigo" />
            <h3>{editTask ? 'Edit Task Details' : 'Create New Task'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">Title <span className="text-danger">*</span></label>
            <input
              type="text"
              id="task-title"
              placeholder="e.g., Complete backend endpoints"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? 'input-error' : ''}
              autoFocus
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              placeholder="Brief details about the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="task-category">Category</label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Work">💼 Work</option>
                <option value="Personal">🏠 Personal</option>
              </select>
            </div>

            <div className="form-group half-width">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="task-due">Due Date <span className="text-danger">*</span></label>
              <input
                type="date"
                id="task-due"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={errors.dueDate ? 'input-error' : ''}
              />
              {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
            </div>

            <div className="form-group half-width">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">🕒 Pending</option>
                <option value="In Progress">⚡ In Progress</option>
                <option value="Completed">✅ Completed</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
