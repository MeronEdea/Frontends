import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PermissionPage.css"; // Import the CSS file
import {jwtDecode} from 'jwt-decode';

function PermissionPage() {
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState("");
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState(null); // Change to null initially
  const [sickLeave, setSickLeave] = useState(false);
  const [teacherError, setTeacherError] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [fileSizeError, setFileSizeError] = useState("");

  // Fetch the list of teachers from the server
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/teachers/");
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform form validation
    if (!teacher) {
      setTeacherError("Please select a teacher.");
      return;
    } else {
      setTeacherError("");
    }
    if (!reason) {
      setReasonError("Please provide a reason.");
      return;
    } else {
      setReasonError("");
    }
    if (!evidence) {
      setFileSizeError("Please select an evidence file.");
      return;
    } else if (evidence.size > 5242880) {
      // 5MB size limit
      setFileSizeError("File size exceeds the limit (5MB).");
      return;
    } else {
      setFileSizeError("");
    }

    try {
      // Fetch the user details to retrieve the associated student ID
      const response = await fetch("http://localhost:8000/api/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      
        const profileData = await response.json();
        const studentId = profileData.student_id;
       
      // const userData = response.data;
      // const studentId = userData.student_id;
      // console.log("studentId:", studentId);

      const formData = new FormData();
      formData.append("teacher", teacher);
      formData.append("reason", reason);
      formData.append("evidence", evidence);
      formData.append("sickLeave", sickLeave);
      formData.append("studentId", studentId); // Include student ID in the formData

      const submitResponse = await axios.post("http://localhost:8000/api/create_permission/", formData);
      console.log(submitResponse.data);
      // Reset form fields after successful submission
      setTeacher("");
      setReason("");
      setEvidence(null);
      setSickLeave(false);
    } catch (error) {
      console.error("Error submitting permission request:", error);
    }
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setEvidence(file);
    console.log("Selected File:", file); // Add this line
  };

  return (
    <div>
      <h2 className="title">Permission Form</h2>
      <div className="permission-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="teacher">Select Teacher:</label>
            <select
              id="teacher"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacherData) => (
                <option key={teacherData.id} value={teacherData.name}>
                  {teacherData.name}
                </option>
              ))}
            </select>
            {teacherError && <p className="error-message">{teacherError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="reason">Reason:</label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            {reasonError && <p className="error-message">{reasonError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="evidence">Evidence:</label>
            <input
              type="file"
              id="evidence"
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png, .pdf" // Limit accepted file types
            />
            {fileSizeError && <p className="error-message">{fileSizeError}</p>}
          </div>
          <div className="form-group">
            <input
              type="checkbox"
              id="sickLeave"
              checked={sickLeave}
              onChange={(e) => setSickLeave(e.target.checked)}
            />
            <label htmlFor="sickLeave">Request Sick Leave</label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default PermissionPage;
