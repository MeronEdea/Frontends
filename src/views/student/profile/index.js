import React, { useState, useEffect } from "react";
import avatars7 from "./avatar7.png";
import './ProfilePage.css'; // Import the CSS file for styling

function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [studentID, setStudentID] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEdit = (setter) => (event) => setter(event.target.value);

  const handleSaveClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/updateprofile/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: fullName,
          student_id: studentID,
          department: department,
          section: section,
          college: college,
          phonenumber: phoneNumber,
          email: email,
          gender: gender,
          profile_picture: profilePicture,
          password: password,
        }),
      });
      if (response.ok) {
        console.log('Profile updated successfully');
        setIsEditMode(false);
      } else {
        console.error('Failed to update user profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const profileData = await response.json();
        setFullName(profileData.fullname);
        setRole(profileData.role);
        setStudentID(profileData.student_id || "");
        setDepartment(profileData.department || ""); 
        setSection(profileData.section || "");
        setCollege(profileData.college || ""); 
        setPhoneNumber(profileData.phonenumber || "");
        setEmail(profileData.email || "");
        setGender(profileData.gender || "");
        if (profileData.profile_picture) {
          setProfilePicture(profileData.profile_picture);
        }
      } else {
        console.error("Failed to fetch user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={profilePicture ? profilePicture : avatars7} alt="Profile" className="profile-picture" />
          <h2>{fullName}</h2>
          <p>{role}</p>
        </div>
        <div className="profile-body">
          {role === "student" && (
            <>
              <div className="profile-field">
                <label>Student ID:</label>
                {isEditMode ? (
                  <input type="text" value={studentID} onChange={handleEdit(setStudentID)} />
                ) : (
                  <div>{studentID}</div>
                )}
              </div>
              <div className="profile-field">
                <label>Section:</label>
                {isEditMode ? (
                  <input type="text" value={section} onChange={handleEdit(setSection)} />
                ) : (
                  <div>{section}</div>
                )}
              </div>
            </>
          )}
          <div className="profile-field">
            <label>Gender:</label>
            {isEditMode ? (
              <select value={gender} onChange={handleEdit(setGender)}>
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              <div>{gender}</div>
            )}
          </div>
          <div className="profile-field">
            <label>Contact Information:</label>
            {isEditMode ? (
              <input type="text" value={phoneNumber} onChange={handleEdit(setPhoneNumber)} />
            ) : (
              <div>{phoneNumber}</div>
            )}
          </div>
          <div className="profile-field">
            <label>Email:</label>
            {isEditMode ? (
              <input type="text" value={email} onChange={handleEdit(setEmail)} />
            ) : (
              <div>{email}</div>
            )}
          </div>
          <div className="profile-field">
            <label>College:</label>
            {isEditMode ? (
              <input type="text" value={college} onChange={handleEdit(setCollege)} />
            ) : (
              <div>{college}</div>
            )}
          </div>
          <div className="profile-field">
            <label>Department:</label>
            {isEditMode ? (
              <input type="text" value={department} onChange={handleEdit(setDepartment)} />
            ) : (
              <div>{department}</div>
            )}
          </div>
          <div className="profile-field">
            <label>Password:</label>
            {isEditMode ? (
              <input type="password" value={password} onChange={handleEdit(setPassword)} />
            ) : (
              <div>******</div>
            )}
          </div>
        </div>
        <div className="profile-footer">
          {isEditMode ? (
            <button onClick={handleSaveClick} className="save-button">Save</button>
          ) : (
            <button onClick={() => setIsEditMode(true)} className="edit-button">Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
