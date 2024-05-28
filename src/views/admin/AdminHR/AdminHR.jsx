import React, { useState, useEffect } from 'react';
import './AdminHR.css';
import axios from 'axios';

const AdminHR = () => {
  const [activeTab, setActiveTab] = useState('teacher');
  const [teachers, setTeachers] = useState([]);
  const [showAddTeacherPopup, setShowAddTeacherPopup] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/teachers/');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error.message);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const addTeacher = async (teacher) => {
    try {
      const response = await axios.post('http://localhost:8000/api/add_teacher/', teacher);
      setTeachers([...teachers, response.data]);
      setShowAddTeacherPopup(false); // Close the pop-up after adding teacher
    } catch (error) {
      console.error('Error adding teacher:', error.message);
    }
  };

  const deleteTeacher = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`http://localhost:8000/api/delete_teacher/${id}/`);
        setTeachers(teachers.filter(teacher => teacher.id !== id));
      } catch (error) {
        console.error('Error deleting teacher:', error.message);
      }
    }
  };
  
  const editTeacher = async (id, updatedTeacher) => {
    try {
      await axios.put(`http://localhost:8000/api/edit_teacher/${id}/`, updatedTeacher);
      const updatedTeachers = teachers.map(teacher => (teacher.id === id ? updatedTeacher : teacher));
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error('Error editing teacher:', error.message);
    }
  };

  return (
    <div className="admin-hr-page">
      <div className="header">
        <div className="tab" onClick={() => handleTabChange('teacher')}>
          Teacher Management
        </div>
      </div>
      <div className="admin-hr-content">
        {activeTab === 'teacher' ? (
          <TeacherManagement teachers={teachers} deleteTeacher={deleteTeacher} editTeacher={editTeacher} />
        ) : null}
      </div>
      {showAddTeacherPopup && <AddTeacherPopup addTeacher={addTeacher} setShowAddTeacherPopup={setShowAddTeacherPopup} />}
      <button className="add-teacher-btn" onClick={() => setShowAddTeacherPopup(true)}>Add New Teacher</button>
    </div>
  );
};

const TeacherManagement = ({ teachers, deleteTeacher, editTeacher }) => {
  const [editingId, setEditingId] = useState(null);

  const handleEditTeacher = (id, teacherData) => {
    setEditingId(id);
    // Implement logic to populate form fields with teacherData
  };

  const handleSaveEdit = (id, updatedTeacher) => {
    editTeacher(id, updatedTeacher);
    setEditingId(null);
  };

  return (
    <div className="teacher-management">
      <h3>List of Teachers</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{editingId === teacher.id ? <input type="text" value={teacher.name} /> : teacher.name}</td>
              <td>{editingId === teacher.id ? <input type="email" value={teacher.email} /> : teacher.email}</td>
              <td>
                {editingId === teacher.id ? (
                  <button onClick={() => handleSaveEdit(teacher.id, {/* Pass updated teacher data */})}>Save</button>
                ) : (
                  <button className="edit-btn" onClick={() => handleEditTeacher(teacher.id, teacher)}>Edit</button>
                )}
                <button className="delete-btn" onClick={() => deleteTeacher(teacher.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AddTeacherPopup = ({ addTeacher, setShowAddTeacherPopup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTeacher({ name, email });
  };

  return (
    <div className="add-teacher-popup">
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit">Add Teacher</button>
        <button type="button" onClick={() => setShowAddTeacherPopup(false)}>Cancel</button>
      </form>
    </div>
  );
};

export default AdminHR;



// return (
//   <div className="admin-hr-page">
//     <div className="header">
//       <div className="tab" onClick={() => handleTabChange('teacher')}>
//         Teacher Management
//       </div>
//     </div>
//     <div className="admin-hr-content">
//       {/* Rendering of teacher management component */}
//     </div>
//     {showAddTeacherPopup && (
//       <div className="overlay">
//         <div className="add-teacher-popup">
//           <h3>Add Teacher</h3>
//           <input 
//             type="text" 
//             placeholder="Name" 
//             value={newTeacher.name} 
//             onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })} 
//             required 
//           />
//           <input 
//             type="email" 
//             placeholder="Email" 
//             value={newTeacher.email} 
//             onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })} 
//             required 
//           />
//           <button onClick={addTeacher}>Add Teacher</button>
//           <button onClick={() => setShowAddTeacherPopup(false)}>Cancel</button>
//         </div>
//       </div>
//     )}
//     <button className="add-teacher-btn" onClick={() => setShowAddTeacherPopup(true)}>Add New Teacher</button>
//   </div>
// );