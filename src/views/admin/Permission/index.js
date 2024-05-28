import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Checkbox,
} from "@chakra-ui/react";
import "./PermissionPage.css";

function PermissionPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [newPermissionCodeName, setNewPermissionCodeName] = useState("");
  const [newPermissionName, setNewPermissionName] = useState("");
  const [newPermissionDescription, setNewPermissionDescription] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentRole, setCurrentRole] = useState(null);
  const [currentPermission, setCurrentPermission] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/roles/")
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
        const initialPermissions = {};
        data.forEach((role) => {
          initialPermissions[role.id] = role.permissions.map((p) => p.id);
        });
        setRolePermissions(initialPermissions);
      })
      .catch((error) => console.error("Error fetching roles:", error));

    fetch("http://localhost:8000/api/permissions/")
      .then((response) => response.json())
      .then((data) => setPermissions(data))
      .catch((error) => console.error("Error fetching permissions:", error));
  }, []);

  const handleCheckboxChange = (roleId, permissionId) => {
    setRolePermissions((prev) => {
      const newPermissions = prev[roleId].includes(permissionId)
        ? prev[roleId].filter((id) => id !== permissionId)
        : [...prev[roleId], permissionId];
      return {
        ...prev,
        [roleId]: newPermissions,
      };
    });
  };

  const handleUpdatePermissions = (roleId) => {
    const updatedPermissions = rolePermissions[roleId];
    fetch(`http://localhost:8000/api/roles/${roleId}/permissions/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ permissions: updatedPermissions }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update permissions");
        }
        return response.json();
      })
      .then((data) => {
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.id === roleId ? { ...role, permissions: data.permissions } : role
          )
        );
      })
      .catch((error) => console.error("Error updating permissions:", error));
  };

  const handleAddPermission = () => {
    fetch("http://localhost:8000/api/permissions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codename: newPermissionCodeName,
        name: newPermissionName,
        description: newPermissionDescription,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add permission");
        }
        return response.json();
      })
      .then((data) => {
        setPermissions([...permissions, data]);
        onClose();
      })
      .catch((error) => console.error("Error adding permission:", error));
  };

  const openEditPermissionModal = (roleId, permission) => {
    setCurrentRole(roleId);
    setCurrentPermission(permission);
    setNewPermissionCodeName(permission.codeName);
    setNewPermissionName(permission.name);
    setNewPermissionDescription(permission.description);
    onOpen();
  };

  return (
    <div className="permission-page">
      <Flex justify="flex-end" mb="24px">
        <Button onClick={onOpen} size="sm" colorScheme="blue">
          + Add Permission
        </Button>
      </Flex>
      <div className="role-list">
        <Table variant="simple" color="gray.500" mb="24px">
          <Thead>
            <Tr>
              <Th minW="50px" bg="blue.200">Role</Th>
              <Th minW="200px" bg="blue.200">Permissions</Th>
              <Th minW="100px" bg="blue.200">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {roles.map((role) => (
              <Tr key={role.id}>
                <Td>{role.name}</Td>
                <Td>
                  <ul>
                    {permissions.map((permission) => {
                      const permissionId = permission.id;
                      return (
                        <li key={permission.id}>
                          <label>
                            <Checkbox
                              isChecked={rolePermissions[role.id]?.includes(permissionId)}
                              onChange={() =>
                                handleCheckboxChange(role.id, permissionId)
                              }
                            />
                            {permission.name} - {permission.description}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </Td>
                <Td>
                  <Button
                    size="xs"
                    onClick={() => handleUpdatePermissions(role.id)}
                  >
                    Update
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentPermission ? "Edit Permission" : "Add New Permission"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Code Name</FormLabel>
              <Input
                type="text"
                value={newPermissionCodeName}
                onChange={(e) => setNewPermissionCodeName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Permission Name</FormLabel>
              <Input
                type="text"
                value={newPermissionName}
                onChange={(e) => setNewPermissionName(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Permission Description</FormLabel>
              <Input
                type="text"
                value={newPermissionDescription}
                onChange={(e) => setNewPermissionDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddPermission}>
              {currentPermission ? "Save Changes" : "Add Permission"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default PermissionPage;