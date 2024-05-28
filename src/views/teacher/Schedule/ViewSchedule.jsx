import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // Import useHistory hook for redirection
import {
  Box,
  Button,
  Container,
  Divider,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {  dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import { enUS } from "date-fns/locale";
import { DeleteIcon } from "@chakra-ui/icons"; // Import the DeleteIcon component

const ViewSchedule = () => {
  const locales = {
    "en-US": enUS,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const [sampleSchedule, setSampleSchedule] = useState([]);
  const history = useHistory(); // Initialize useHistory

  useEffect(() => {
    fetch('http://localhost:8000/api/display_schedule/')
      .then(response => response.json())
      .then(data => setSampleSchedule(data))
      .catch(error => console.error('Error fetching schedule:', error));
  }, []);

  // Generate random color with lighter opacity
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return `${color}20`; // Adding 20% opacity (lighter)
  };

  // Function to handle add event button click
  const handleAddEventClick = () => {
    console.log("Add Event button clicked");
    history.push("/add-schedule"); // Assuming "/add-schedule" is the route path for the AddSchedule page
  };

  // Calculate dates
  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));
  const formattedDates = dates.map((date) => format(date, "EEE, MMM dd"));

  // Function to handle schedule item click
  const handleScheduleItemClick = (event) => {
    // Redirect to edit page with the event ID or other identifier
    history.push(`/edit-schedule/${event.id}`); // Assuming "/edit-schedule" is the route path for editing schedule and each schedule item has a unique ID
  };

  return (
    <Box mt={2} mb={2} component="main" className="flex-grow py-8">
      <Container maxWidth={false}>
        <Divider style={{ marginBottom: 20 }} />
        <Box className="flex justify-between mb-4 mt-20">
          <div className="flex items-center mb-4">
            <p className="text-sm font-bold text-gray-400 mr-4">
              Today {format(today, "EEE, MMM dd")}
            </p>
            <hr className="flex-grow border-gray-300" />
          </div>
          <Button
            onClick={handleAddEventClick}
            size="l"
            className="bg-blue-500 text-blue-900 hover:bg-blue-300 hover:text-blue-500 py-2 px-4 shadow-md font-semibold"
          >
            Add Event
          </Button>
        </Box>
        <Divider style={{ marginBottom: 20 }} />

        <Table variant="simple" color="black" borderColor="black">
          <Thead>
            <Tr>
              <Th borderColor="white">Time</Th>
              {formattedDates.map((date, index) => (
                <Th key={index} borderColor="black">
                  {date}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {sampleSchedule.map((row, index) => (
              <Tr
                key={index}
                className="mb-2"
                style={{
                  margin: "8px 0",
                  cursor: "pointer", // Set cursor to pointer
                  transition: "background-color 0.3s ease", // Smooth transition for background color change
                  height: "80px", // Increase height
                  borderRadius: "8px", // Add rounded borders
                  overflow: "hidden", // Hide overflowing content
                }}
                onClick={() => handleScheduleItemClick(row)} // Pass the row data to the click handler
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F0F0F0"; // Change background color on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = ""; // Reset background color on mouse leave
                }}
              >
                <Td>{row.time}</Td>
                {Object.keys(row)
                  .slice(1)
                  .map((day, index) => (
                    <Td
                      key={index}
                      style={{
                        backgroundColor: row[day]
                          ? getRandomColor()
                          : "#FFFFFF",
                        position: "relative", // Add relative position for absolute positioning of DeleteIcon
                      }}
                    >
                      {row[day]}
                      {row[day] && ( // Render DeleteIcon only if there is content
                        <DeleteIcon
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            color: "rgba(255, 0, 0, 0.5)", // Red color with 50% opacity
                            cursor: "pointer",
                            fontSize: "13px", // Decrease the size to make the icon smaller
                          }}
                        />
                      )}
                    </Td>
                  ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>
    </Box>
  );
};

export default ViewSchedule;
