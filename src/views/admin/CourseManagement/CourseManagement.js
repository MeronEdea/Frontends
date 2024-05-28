import React, { useState, useEffect } from 'react';
import './CourseManagement.css';
import axios from 'axios';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCourse, setEditedCourse] = useState({
    college: '',
    department: '',
    name: '',
    code: '',
    duration: '',
    year: '',
    prerequest: ''
  });
  const [showAddCoursePopup, setShowAddCoursePopup] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/courses/')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const addCourse = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/courses/', editedCourse);
      setCourses([...courses, response.data]);
      setShowAddCoursePopup(false);
    } catch (error) {
      console.error('Error adding course:', error.message);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:8000/api/courses/${id}/`);
        setCourses(courses.filter(course => course.id !== id));
      } catch (error) {
        console.error('Error deleting course:', error.message);
      }
    }
  };

  const handleEditClick = (id) => {
    setEditingId(id);
    const courseToEdit = courses.find(course => course.id === id);
    setEditedCourse(courseToEdit);
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/courses/${id}/`, editedCourse);
      const updatedCourses = courses.map(course => (course.id === id ? editedCourse : course));
      setCourses(updatedCourses);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating course:', error.message);
    }
  };

  return (
    <div className="course-management">
      <button className="add-course-btn" onClick={() => setShowAddCoursePopup(true)}>Add New Course</button>
      {showAddCoursePopup && (
        <div className="overlay">
          <div className="add-course-popup">
            <h3>Add Course</h3>
            <input
              type="text"
              value={editedCourse.college}
              onChange={(e) => setEditedCourse({ ...editedCourse, college: e.target.value })}
              placeholder="College"
            />
            <input
              type="text"
              value={editedCourse.department}
              onChange={(e) => setEditedCourse({ ...editedCourse, department: e.target.value })}
              placeholder="Department"
            />
            <input
              type="text"
              value={editedCourse.name}
              onChange={(e) => setEditedCourse({ ...editedCourse, name: e.target.value })}
              placeholder="Course Name"
            />
            <input
              type="text"
              value={editedCourse.code}
              onChange={(e) => setEditedCourse({ ...editedCourse, code: e.target.value })}
              placeholder="Course Code"
            />
            <input
              type="text"
              value={editedCourse.duration}
              onChange={(e) => setEditedCourse({ ...editedCourse, duration: e.target.value })}
              placeholder="Course Duration"
            />
            <input
              type="text"
              value={editedCourse.year}
              onChange={(e) => setEditedCourse({ ...editedCourse, year: e.target.value })}
              placeholder="Course Year"
            />
            <input
              type="text"
              value={editedCourse.prerequest}
              onChange={(e) => setEditedCourse({ ...editedCourse, prerequest: e.target.value })}
              placeholder="Course Prerequest"
            />
            <button onClick={addCourse}>Add Course</button>
            <button onClick={() => setShowAddCoursePopup(false)}>Cancel</button>
          </div>
        </div>
      )}
      <h3>List of Courses</h3>
      <table>
        <thead>
          <tr>
            <th>College</th>
            <th>Department</th>
            <th>Course Name</th>
            <th>Course Code</th>
            <th>Duration</th>
            <th>Year</th>
            <th>Prerequest</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{editingId === course.id ? <input type="text" value={editedCourse.college} onChange={(e) => setEditedCourse({ ...editedCourse, college: e.target.value })} /> : course.college}</td>
              <td>{editingId === course.id ? <input type="text" value={editedCourse.department} onChange={(e) => setEditedCourse({ ...editedCourse, department: e.target.value })} /> : course.department}</td>
              <td>{editingId === course.id ? <input type="text" value={editedCourse.name} onChange={(e) => setEditedCourse({ ...editedCourse, name: e.target.value })} /> : course.name}</td>
              <td>{editingId === course.id ? <input type="text" value={editedCourse.code} onChange={(e) => setEditedCourse({ ...editedCourse, code: e.target.value })} /> : course.code}</td>
              <td>{editingId === course.id ? <input type="text" value={editedCourse.duration} onChange={(e) => setEditedCourse({ ...editedCourse, duration: e.target.value })} /> : course.duration}</td>
              <td>{editingId === course.id ? <input type="text" value={editedCourse.year} onChange={(e) => setEditedCourse({ ...editedCourse, year: e.target.value })} /> : course.year}</td>
              <td>{editingId === course.id ? <input type="text" value={editedCourse.prerequest} onChange={(e) => setEditedCourse({ ...editedCourse, prerequest: e.target.value })} /> : course.prerequest}</td>
              <td>
                {editingId === course.id ? (
                  <button onClick={() => handleSaveEdit(course.id)}>Save</button>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => handleEditClick(course.id)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteCourse(course.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseManagement;
