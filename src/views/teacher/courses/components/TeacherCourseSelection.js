// src/views/teacher/TeacherCourseSelection.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Heading,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import './TeacherCourseSelection.css';

const TeacherCourseSelection = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const toast = useToast();

  useEffect(() => {
    // Fetch the list of courses from the backend
    const accessToken = localStorage.getItem('accessToken');
      
  axios.get('http://localhost:8000/api/unassigned-courses/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const handleCourseChange = (courseId) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.includes(courseId)
        ? prevSelectedCourses.filter(id => id !== courseId)
        : [...prevSelectedCourses, courseId]
    );
  };

  const handleSubmit = () => {
    // Retrieve the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      toast({
        title: "Error",
        description: "Access token is missing.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Make the API request with the correct data structure
    axios.post('http://localhost:8000/api/choose-course/', { course_id: selectedCourses }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        toast({
          title: "Courses submitted",
          description: "Your course selections have been submitted for approval.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(error => {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "There was an error submitting your course selections.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error('Error submitting courses:', error);
      });
    console.log("course id: ", selectedCourses);
  };

  return (
    <Box className="course-selection-container">
      <Heading as="h2" className="course-selection-heading">Select Courses to Teach</Heading>
      <VStack spacing="4" align="start">
        {courses.map(course => (
          <Checkbox
            key={course.id}
            isChecked={selectedCourses.includes(course.id)}
            onChange={() => handleCourseChange(course.id)}
            className="course-checkbox"
          >
            {course.name} ({course.code})
          </Checkbox>
        ))}
      </VStack>
      <Button mt="4" className="submit-button" onClick={handleSubmit}>Submit</Button>
    </Box>
  );
};

export default TeacherCourseSelection;
