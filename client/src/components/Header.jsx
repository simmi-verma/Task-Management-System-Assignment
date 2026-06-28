import React from 'react';
import { Search, Plus, Calendar } from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery, onAddTaskClick }) {
  // Get formatted current date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="header-date">
          <Calendar size={16} className="text-indigo" />
          <span>{today}</span>
        </div>
        <div className="header-search">
          <Search size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, descriptions..." 
          />
        </div>
      </div>

      <div className="header-actions">
        <button className="btn btn-primary btn-pulse" onClick={onAddTaskClick}>
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
