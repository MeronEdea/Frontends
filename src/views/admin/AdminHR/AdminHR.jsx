import React from 'react';
import { Link } from 'react-router-dom';
import './AdminHR.css';

const AdminHR = () => {
  return (
    <div className="management-page">
      <Link to="/course-management" className="card course-management">
        <h2>Course Management</h2>
      </Link>
      <Link to="/teacher-management" className="card teacher-management">
        <h2>Teacher Management</h2>
      </Link>
    </div>
  );
};

export default AdminHR;