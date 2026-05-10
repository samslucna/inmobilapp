import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import axios from 'axios';

export default function UserFormModal({ color,component,title,onUserCreated }) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', email: '', password: '' }); // Limpiar al cerrar
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Reemplaza con tu endpoint de Laravel
      await axios.post('https://tu-api-laravel.com/api/users', formData);
      
      handleClose();
      if (onUserCreated) onUserCreated(); // Para recargar la tabla después de crear
    } catch (error) {
      console.error("Error al crear usuario", error.response?.data);
      alert("Hubo un error al registrar");
    }
  };

  return (
    <>
      <Button 
        variant="contained" 
        color={color || "secondary"}
        onClick={handleClickOpen}
        sx={{ mb: 2 }}
      >
        {title}
      </Button>
      

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                name="name"
                label="Nombre Completo"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
              />
              
              <TextField
                name="email"
                label="Correo Electrónico"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                name="password"
                label="Contraseña"
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
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
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} color="inherit">Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Guardar Usuario
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}