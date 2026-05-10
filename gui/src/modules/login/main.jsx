import { useState } from "react";
import { Box, Button, TextField, Card, Typography } from "@mui/material";
import { loginRequest } from "../../api/auth";
import authStore from "../../store/AuthStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ⬅ Hook de navegación

  const handleLogin = async () => {
    try {
      const res = await loginRequest(email, password);
      authStore.login(res.token, res.user);
      navigate("/dashboard");
    } catch (e) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Card sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2}>
          Iniciar Sesión
        </Typography>

        <TextField
          fullWidth
          label="Correo"
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Entrar
        </Button>
        
      </Card>
    </Box>
  );
}
