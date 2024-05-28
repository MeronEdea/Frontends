import React, { useState, useEffect } from 'react';
import './CoursePage.css';

function JoinPopup({ handleJoin, handleClose }) {
  const [joinCode, setJoinCode] = useState('');

  const handleSubmit = () => {
    handleJoin(joinCode);
    setJoinCode('');
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Enter Join Code</h2>
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Enter join code"
        />
        <button onClick={handleSubmit}>Join</button>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}

function CourseCard({ course, handleJoinClick }) {
  return (
    <div className="course-card">
      <h2>{course.title}</h2>
      <div className="course-details">
        <p><strong>Course Name:</strong> {course.name}</p>
        <p><strong>Pre-Request:</strong> {course.prerequest}</p>
        <p><strong>Course Duration:</strong> {course.duration}</p>
      </div>
      <button className="join-button" onClick={() => handleJoinClick(course.id)}>Join +</button>
    </div>
  );
}

function CoursePage() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [courses, setCourses] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    let isMounted = true;

    if (accessToken) {
      fetch('http://localhost:8000/api/student_courses/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
      .then(response => response.json())
      .then(data => {
        if (isMounted) {
          setCourses(data);
        }
      })
      .catch(error => console.error('Error fetching courses:', error));
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId);
  };

  const handleJoinCourse = (joinCode, courseId) => {
    if (accessToken && courseId) {
      const joinData = {
        join_code: joinCode,
      };

      fetch(`http://localhost:8000/api/join_course/${courseId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(joinData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error('Error joining course:', error);
        });
    }
    setShowPopup(false);
  };

  const handleJoinClick = (courseId) => {
    setSelectedCourse(courseId);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="course-page">
      <div className="course-list">
        <h1>Course List</h1>
        <ul>
          {courses.map((course) => (
            <li
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className={selectedCourse === course.id ? 'selected' : ''}
            >
              <span>{course.title}</span>
              <button onClick={() => handleJoinClick(course.id)}>Join +</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="course-cards">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} handleJoinClick={handleJoinClick} />
        ))}
      </div>
      {showPopup && <JoinPopup handleJoin={(joinCode) => handleJoinCourse(joinCode, selectedCourse)} handleClose={handleClosePopup} />}
    </div>
  );
}

export default CoursePage;
