import {
  Button,
  Card,
  Box,
  TextField,
  DialogActions,
  Alert,
  Typography,
 
  Grid,
} from "@mui/material";

import AgentStore from "../../store/AgentStore";
import clientValidate from "../../validator/clientValidate";
import useValidatorForm from "../../hooks/useValidatorForm";

export default function Form() {
  const { state, errors, handleChange, handleSubmit, handleBlur } =
    useValidatorForm(AgentStore.agent, clientValidate, AgentStore.addAgent);

  const { id,name, email, lastnames, phone, address, dni } = state;

  const saveAgent = async (e) => {
    handleSubmit(e);
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {id ===null? 'Registrar Nuevo Agente' : 'Editar Agente'}
             
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{sm:12,md:6} } >
              <TextField
              mb={2}
                name="name"
                label="Nombre"
                fullWidth
                required
                value={name}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.name && <Alert severity="error">{errors.name}</Alert>}

              <TextField
                name="lastnames"
                label="Apellidos"
                fullWidth
                required
                value={lastnames}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.lastnames && (
                <Alert severity="error">{errors.lastnames}</Alert>
              )}

              <TextField
                name="address"
                label="Dirección"
                fullWidth
                required
                value={address}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.address && (
                <Alert severity="error">{errors.address}</Alert>
              )}
            </Grid>
            <Grid size={{sm:12,md:6} }>
              <TextField
                name="phone"
                label="Telefono"
                type="text"
                fullWidth
                required
                value={phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.phone && <Alert severity="error">{errors.phone}</Alert>}

              <TextField
                name="dni"
                label="INE"
                type="text"
                fullWidth
                required
                value={dni}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.dni && <Alert severity="error">{errors.dni}</Alert>}

              <TextField
                name="email"
                label="Correo Electrónico"
                type="email"
                fullWidth
                required
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && <Alert severity="error">{errors.email}</Alert>}
            </Grid>
          </Grid>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                AgentStore.setHiddenForm(false);
                AgentStore.setEditing(false);
              }}
              sx={{ background: "gray", color: "whitesmoke" }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={(e) => saveAgent(e)}
            >
              Guardar
            </Button>
          </DialogActions>
        </Card>
      </Box>
    </>
  );
}
