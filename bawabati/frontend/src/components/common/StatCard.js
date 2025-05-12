import React from 'react';
import { Link } from 'react-router-dom';
import './StatCard.css';

function StatCard({ title, value, icon, color, linkTo }) {
  const CardContent = () => (
    <>
      <div className={`stat-icon ${color}`}>
        <i className={icon}></i>
      </div>
      <div className="stat-info">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </>
  );

  return linkTo ? (
    <Link to={linkTo} className="stat-card">
      <CardContent />
    </Link>
  ) : (
    <div className="stat-card">
      <CardContent />
    </div>
  );
}

export default StatCard; 