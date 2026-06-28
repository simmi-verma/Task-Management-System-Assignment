import React from 'react';
import { Calendar, Edit3, X, AlertCircle, CheckCircle, Circle } from 'lucide-react';

export default function TaskCard({ task, onStatusToggle, onEditClick, onDeleteClick }) {
  const { _id, title, description, status, priority, dueDate, category } = task;

  const isCompleted = status === 'Completed';
  
  // Format due date
  const dateObj = new Date(dueDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Check if overdue
  const now = new Date();
  // Reset time for accurate date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const isOverdue = dueDay < today && !isCompleted;
  const isDueToday = dueDay.getTime() === today.getTime() && !isCompleted;

  // CSS classes based on status / priority / category
  const priorityClass = `priority-${priority.toLowerCase()}`;
  const categoryClass = `category-${category.toLowerCase()}`;
  
  let dueDateClass = 'due-date-normal';
  if (isOverdue) dueDateClass = 'due-date-overdue';
  else if (isDueToday) dueDateClass = 'due-date-today';

  return (
    <div className={`glass-card task-card ${isCompleted ? 'task-completed' : ''}`}>
      
      <div className="task-card-header">
        <button 
          className="status-toggle-btn" 
          onClick={() => onStatusToggle(_id, isCompleted ? 'Pending' : 'Completed')}
          title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
        >
          {isCompleted ? (
            <CheckCircle className="status-icon text-success-glow" />
          ) : (
            <Circle className="status-icon text-muted" />
          )}
        </button>
        
        <div className="task-title-area">
          <h4 className="task-title" title={title}>{title}</h4>
          <span className={`badge category-badge ${categoryClass}`}>{category}</span>
        </div>
      </div>

      <div className="task-card-body">
        <p className="task-desc">{description || "No description provided."}</p>
      </div>

      <div className="task-card-footer">
        <div className={`task-due-date ${dueDateClass}`}>
          {isOverdue ? (
            <AlertCircle size={14} className="animate-pulse" />
          ) : (
            <Calendar size={14} />
          )}
          <span>{formattedDate}</span>
          {isOverdue && <span className="due-alert-text">Overdue</span>}
          {isDueToday && <span className="due-alert-text">Today</span>}
        </div>

        <div className="task-footer-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className={`badge priority-badge ${priorityClass}`}>
            <span className="dot"></span>
            <span>{priority}</span>
          </div>

          <div className="task-actions" style={{ position: 'static', opacity: 1 }}>
            <button 
              className="action-btn edit-btn" 
              onClick={() => onEditClick(task)}
              title="Edit Task"
            >
              <Edit3 size={15} />
            </button>
            <button 
              className="action-btn delete-btn" 
              onClick={() => onDeleteClick(_id)}
              title="Delete Task"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
