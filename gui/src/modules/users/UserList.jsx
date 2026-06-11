// UserList.jsx
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Box, Container, Fab, Zoom, Tooltip } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import TableData from "./TableData";
import Form from "./Form";

const UserList = observer(() => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    // Recargar la tabla después de guardar
    // El store ya se actualiza automáticamente con MobX
    setOpenForm(false);
    setSelectedUser(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: "relative", minHeight: "100vh" }}>
      {/* Tabla de usuarios */}
      <TableData onEdit={handleEdit} onRefresh={handleSuccess} />

      {/* Botón flotante para nuevo usuario */}
      <Zoom in={true}>
        <Tooltip title="Nuevo usuario" placement="left">
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => handleEdit({ id: null, name: "", email: "", role_id: "", active: true })}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
            }}
          >
            <PersonAdd />
          </Fab>
        </Tooltip>
      </Zoom>

      {/* Formulario modal */}
      {openForm && (
        <Form
          user={selectedUser}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </Container>
  );
});

export default UserList;