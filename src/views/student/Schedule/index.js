import React, { useState, useEffect } from 'react';
import './SchedulePage.css';

function SchedulePage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/api/display_schedule/')
      .then(response => response.json())
      .then(data => setCourses(data))
      .catch(error => console.error('Error fetching schedule:', error));
  }, []);

  return (
    <div className="schedule-page">
      <h1>Schedule</h1>
      <table>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Instructor</th>
            <th>Schedule</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.courseCode}</td>
              <td>{course.courseTitle}</td>
              <td>{course.instructor}</td>
              <td>{course.schedule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SchedulePage;
