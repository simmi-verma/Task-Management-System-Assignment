import React from 'react';
import { Play, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

export default function StatsPanel({ stats, onOverdueClick }) {
  const { total = 0, pending = 0, inProgress = 0, completed = 0, overdue = 0, priority = { High: 0, Medium: 0, Low: 0 } } = stats;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="stats-container">
      {/* Total Tasks Card */}
      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper bg-blue-glow">
          <TrendingUp className="stat-icon text-blue" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Tasks</span>
          <h3 className="stat-value">{total}</h3>
          <span className="stat-subtext">Active tracker scope</span>
        </div>
      </div>

      {/* In Progress Card */}
      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper bg-amber-glow">
          <Play className="stat-icon text-warning" />
        </div>
        <div className="stat-info">
          <span className="stat-label">In Progress</span>
          <h3 className="stat-value">{inProgress}</h3>
          <span className="stat-subtext">{pending} pending in backlog</span>
        </div>
      </div>

      {/* Completed Card */}
      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper bg-emerald-glow">
          <CheckCircle2 className="stat-icon text-success" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Completed</span>
          <h3 className="stat-value">{completed}</h3>
          <div className="completion-bar-container">
            <div className="completion-bar-fill" style={{ width: `${completionRate}%` }}></div>
            <span className="completion-percentage">{completionRate}% rate</span>
          </div>
        </div>
      </div>

      {/* Overdue Card (Clickable to trigger filter) */}
      <div 
        className={`glass-card stat-card overdue-card ${overdue > 0 ? 'has-overdue animate-pulse-subtle' : ''}`}
        onClick={overdue > 0 ? onOverdueClick : undefined}
        style={{ cursor: overdue > 0 ? 'pointer' : 'default' }}
        title={overdue > 0 ? "Click to view overdue tasks" : ""}
      >
        <div className={`stat-icon-wrapper ${overdue > 0 ? 'bg-danger-glow' : 'bg-muted-glow'}`}>
          <AlertTriangle className={`stat-icon ${overdue > 0 ? 'text-danger' : 'text-muted'}`} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Overdue Tasks</span>
          <h3 className={`stat-value ${overdue > 0 ? 'text-danger-glow' : ''}`}>{overdue}</h3>
          <span className="stat-subtext">
            {overdue > 0 ? 'Requires immediate action' : 'All deadlines healthy'}
          </span>
        </div>
      </div>
    </section>
  );
}
