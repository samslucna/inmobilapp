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

import RolStore from "../../../store/RolStore";
import rolValidate from "../../../validator/rolValidate";
import useValidatorForm from "../../../hooks/useValidatorForm";

export default function Form() {
  
  const { state, errors, handleChange, handleSubmit, handleBlur } =
    useValidatorForm(RolStore.rol, rolValidate, RolStore.addRol);

  const { id,name,description } = state;

  const saveRol = async (e) => {

    handleSubmit(e);
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {id ===null? 'Registrar nuevo rol' : 'Editar rol'}
             
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
                name="description"
                label="Descripción"
                fullWidth
                required
                value={description}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.description && (
                <Alert severity="error">{errors.description}</Alert>
              )}

            </Grid>
            <Grid size={{sm:12,md:6} }>
              

         
            </Grid>
          </Grid>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                RolStore.setHiddenForm(false);
                RolStore.setEditing(false);
              }}
              sx={{ background: "gray", color: "whitesmoke" }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={(e) => saveRol(e)}
            >
              Guardar
            </Button>
          </DialogActions>
        </Card>
      </Box>
    </>
  );
}
