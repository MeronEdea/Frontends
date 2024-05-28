import React, { useState, useEffect } from "react";
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import "./CheckTable.css";

export default function CheckTable() {
  const [roleData, setRoleData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/roles/")
      .then((response) => response.json())
      .then((data) => setRoleData(data))
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);

  const handleAddRole = () => {
    const newRole = { name: newRoleName };

    fetch("http://localhost:8000/api/roles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRole),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add role");
        }
        return response.json();
      })
      .then((data) => {
        setRoleData([...roleData, data]);
        setIsOpen(false); // Close the modal after adding role
        setNewRoleName(""); // Reset new role name
      })
      .catch((error) => console.error("Error adding role:", error));
  };

  return (
    <Box
      bg="white"
      borderRadius="md"
      boxShadow="md"
      p="4"
      maxW="xxl"
      mx="auto"
      overflowX="auto"
    >
      <Flex justify="flex-end" mb="4" mt="14">
        <Button
          onClick={() => setIsOpen(true)}
          bg="blue.300"
          color="white"
          _hover={{ bg: "blue.500" }}
        >
          + New Role
        </Button>
      </Flex>
      <Table variant="simple" color="gray.500" mb="24px">
        <Thead>
          <Tr>
            <Th minW="50px" bg="blue.200">
              No
            </Th>
            <Th minW="100px" bg="blue.200">
              Name
            </Th>
            <Th minW="100px" bg="blue.200">
              Action
            </Th>
            <Th minW="100px" bg="blue.200">
              Permission
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {roleData.map((role, index) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{role.name}</Td>
              <Td>Action Placeholder</Td>
              {/* Display role permissions */}
              <Td>{role.permissions.map((perm) => perm.codename).join(", ")}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* Modal for adding new role */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Role</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>New Role Name</FormLabel>
              <Input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" marginTop={100} onClick={handleAddRole}>
              Add Role
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
