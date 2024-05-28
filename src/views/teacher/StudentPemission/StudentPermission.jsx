import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";

const StudentPermission = () => {
  const history = useHistory();
  const [permissionData, setPermissionData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await fetchUserData();
      const students = await fetchStudentData();
      const permissions = await fetchPermissionData();
      if (users.length && students.length && permissions.length) {
        const studentsWithPermissions = filterStudentsWithPermissions(users, students, permissions);
        setFilteredUserData(studentsWithPermissions);
        setPermissionData(permissions);
      }
    };

    fetchData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users/");
      console.log("user data: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return [];
    }
  };

  const fetchStudentData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/students/");
      console.log("student data: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching student data:", error);
      return [];
    }
  };

  const fetchPermissionData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/students_permission/");
      return response.data;
    } catch (error) {
      console.error("Error fetching permission data:", error);
      return [];
    }
  };

  const filterStudentsWithPermissions = (users, students, permissions) => {
    const studentIdToUserMap = students.reduce((acc, student) => {
      const user = users.find(user => user.id === student.user);
      if (user) {
        acc[student.id] = { ...student, user };
      }
      return acc;
    }, {});
  
    return permissions.map(permission => {
      const student = studentIdToUserMap[permission.student_id];
      return student ? { ...student, permission } : null;
    }).filter(user => user !== null);
  };

  const handleEditClick = (permissionId) => {
    console.log("Edit button clicked for permission ID:", permissionId);
    history.push(`/view-permission/${permissionId}`);
  };

  return (
    <div className="container mx-auto">
      <div className="mt-20 mb-4 flex items-center">
        <p className="text-sm font-bold text-gray-400 mr-4">Current Month and Year</p>
        <hr className="flex-grow border-gray-300" />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Student List</h2>
        <div className="p-6 px-0 overflow-scroll">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">No</th>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Student Name</th>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Student ID</th>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Section</th>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Reason</th>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Submitted Date</th>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Status</th>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserData.map((user, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="p-4 border-b border-blue-gray-50">{user.permission.id}</td>
                  <td className="p-4 border-b border-blue-gray-50">{user.name}</td>
                  <td className="p-4 border-b border-blue-gray-50">{user.student_id}</td>
                  <td className="p-4 border-b border-blue-gray-50">{user.section}</td>
                  <td className="p-4 border-b border-blue-gray-50">{user.permission.reason}</td>
                  <td className="p-4 border-b border-blue-gray-50">{user.permission.submitted_date}</td>
                  <td className="p-4 border-b border-blue-gray-50">
                    {user.permission.status === "pending" ? (
                      <div className="text-yellow-600 font-bold">Pending Approval</div>
                    ) : (
                      <div className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${user.permission.status === "approved" ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>
                        <span>{user.permission.status === "approved" ? "Approved" : "Rejected"}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <button className="p-2 hover:bg-blue-300 text-white font-bold py-1 px-2 rounded-full focus:outline-none focus:shadow-outline" onClick={() => handleEditClick(user.permission.id)}>
                      <MdOutlineEdit size={20} color="blue" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPermission;
