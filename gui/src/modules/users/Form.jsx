import { useState,useEffect } from "react";
import {
  Button,
  Card,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Stack,
  DialogActions,
  Alert,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import userStore from "../../store/UserStore";
import RoleSelector from "./RoleSelector";
import userValidate from "../../validator/userValidate";
import useValidatorForm from "../../hooks/useValidatorForm";
import RolStore from "../../store/RolStore";

export default function Form() {
  const [showPassword, setShowPassword] = useState(true);
  const { state, errors, handleChange, handleSubmit, handleBlur } =
    useValidatorForm(userStore.user, userValidate, userStore.addUser);

  const { id,name, email, password, rol, active } = state;

  const saveUser = async (e) => {
    handleSubmit(e);
  };
 
  
  useEffect(() => {
    RolStore.loadRols();
  }, []);
  return (
    <>
      <Box display="flex" alignItems="center">
        <Card sx={{ p: 4, width: 450 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {id ===null? 'Registrar nuevo usuario' : 'Editar usuario'}
          </Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <TextField
              name="name"
              label="Nombre de Usuario"
              fullWidth
              required
              value={name}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.name && <Alert severity="error">{errors.name}</Alert>}

            <RoleSelector
              value={rol}
              onChange={handleChange}
              blur={handleBlur}
            />

            <FormControlLabel
              required
              control={
                <Switch
                  checked={active}
                  value={active}
                  onChange={handleChange}
                  name="active"
                  slotProps={{ input: { "aria-label": "controlled" } }}
                />
              }
              label="Activo"
            />

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

            <TextField
              name="password"
              label="Contraseña"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.password && (
              <Alert severity="error">{errors.password}</Alert>
            )}
          </Stack>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                userStore.setHiddenForm(false);
                userStore.setEditing(false);
              }}
              sx={{ background: "gray", color: "whitesmoke" }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={(e) => saveUser(e)}
            >
              Guardar Usuario
            </Button>
          </DialogActions>
        </Card>
      </Box>
    </>
  );
}
