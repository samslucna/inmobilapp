// Form.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  CircularProgress,
  Grid,
  Divider,
  Chip,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Save,
  Cancel,
  PersonAdd,
  Edit,
  CheckCircle,
  ErrorOutline,
  Close,
  Lock,
  Email,
  Phone,
  Badge,
  AdminPanelSettings,
  ArrowBack,
} from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import userStore from "../../store/UserStore";
import rolStore from "../../store/RolStore";
import userValidate from "../../validator/userValidate";
import useValidatorForm from "../../hooks/useValidatorForm";

const MotionBox = motion(Box);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Form = observer(({ user: initialUser, onClose, onSuccess }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados locales
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  
  // Ref para prevenir envíos múltiples
  const hasSubmittedRef = useRef(false);

  // Determinar si es edición o creación
  const isEditing = initialUser && initialUser.id !== null;
  const userId = isEditing ? initialUser.id : null;

  // Estado inicial del formulario
  const initialFormState = {
    id: isEditing ? initialUser.id : null,
    name: initialUser?.name || "",
    email: initialUser?.email || "",
    phone: initialUser?.phone || "",
    password: "",
    password_confirmation: "",
    role_id: initialUser?.role_id || initialUser?.rol_id || "",
    active: initialUser?.active === true || initialUser?.status === 1,
  };

  // Función de envío protegida contra múltiples llamadas
  const handleFormSubmit = useCallback(async (data) => {
    if (hasSubmittedRef.current) {
      console.log("Envío ya en progreso, ignorando...");
      return;
    }
    
    hasSubmittedRef.current = true;
    
    try {
      const result = await userStore.addUser(data);
      
      if (result?.success !== false) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 1500);
      }
      
      return result;
    } catch (error) {
      console.error("Error en submit:", error);
      throw error;
    } finally {
      setTimeout(() => {
        hasSubmittedRef.current = false;
      }, 1000);
    }
  }, [userStore, onSuccess, onClose]);

  // Hook de validación
  const {
    state,
    errors,
    touched,
    isSubmitting,
    isValidating,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useValidatorForm(
    initialFormState,
    userValidate,
    handleFormSubmit,
    {
      resetOnSubmit: false,
      validateOnChange: true,
      validateOnBlur: true,
      clearErrorsOnChange: true,
    }
  );

  // Extraer valores del estado
  const { id, name, email, phone, password, role_id, active } = state;

  // Evaluar fortaleza de la contraseña
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "error",
    checks: {}
  });

  const evaluatePasswordStrength = useCallback((pass) => {
    if (!pass) {
      setPasswordStrength({ score: 0, message: "", color: "error", checks: {} });
      return;
    }

    const checks = {
      length: pass.length >= 8,
      length12: pass.length >= 12,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass),
      noSpaces: !/\s/.test(pass)
    };

    let score = 0;
    if (checks.length) score++;
    if (checks.length12) score++;
    if (checks.uppercase) score++;
    if (checks.lowercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;
    if (checks.noSpaces) score++;

    let message = "";
    let color = "error";
    
    if (score <= 3) {
      message = "Muy débil";
      color = "error";
    } else if (score <= 5) {
      message = "Débil";
      color = "error";
    } else if (score <= 7) {
      message = "Media";
      color = "warning";
    } else if (score <= 9) {
      message = "Fuerte";
      color = "success";
    } else {
      message = "Muy fuerte";
      color = "success";
    }

    setPasswordStrength({ score, message, color, checks });
  }, []);

  // Validar confirmación de contraseña
  useEffect(() => {
    if (!isEditing) {
      if (confirmPassword || password) {
        if (password !== confirmPassword) {
          setConfirmPasswordError("Las contraseñas no coinciden");
        } else {
          setConfirmPasswordError("");
        }
      }
    } else if (password && password !== "") {
      if (password !== confirmPassword) {
        setConfirmPasswordError("Las contraseñas no coinciden");
      } else {
        setConfirmPasswordError("");
      }
    } else {
      setConfirmPasswordError("");
    }
    
    evaluatePasswordStrength(password);
  }, [password, confirmPassword, isEditing, evaluatePasswordStrength]);

  // Cargar roles
  useEffect(() => {
    const loadRoles = async () => {
      if (rolStore.rols.length === 0) {
        setLoadingRoles(true);
        try {
          await rolStore.loadRols();
        } catch (error) {
          console.error("Error loading roles:", error);
        } finally {
          setLoadingRoles(false);
        }
      }
    };
    loadRoles();
  }, []);

  // Manejar confirmación de contraseña
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Manejar cambio de rol
  const handleRoleChange = (e) => {
    setFieldValue("role_id", e.target.value);
  };

  // Manejar cambio de estado activo
  const handleActiveChange = (e) => {
    setFieldValue("active", e.target.checked);
  };

  // Cancelar formulario
  const handleCancel = () => {
    if (isDirty) {
      const confirm = window.confirm(
        "¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán."
      );
      if (!confirm) return;
    }
    
    resetForm();
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (onClose) onClose();
  };

  // Verificar si el formulario puede ser enviado
  const canSubmit = () => {
    if (isSubmitting || isValidating || hasSubmittedRef.current) return false;
    
    if (!isEditing) {
      return isValid && isDirty && !confirmPasswordError && password;
    }
    
    return isValid && isDirty;
  };

  // Obtener lista de roles
  const rolesList = rolStore.rols || [];

  return (
    <Dialog
      open={true}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 4,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!isEditing ? (
                  <PersonAdd sx={{ fontSize: 28 }} />
                ) : (
                  <Edit sx={{ fontSize: 28 }} />
                )}
              </Paper>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {!isEditing ? "Registrar nuevo usuario" : "Editar usuario"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {!isEditing
                    ? "Complete los datos para crear un nuevo usuario"
                    : "Modifique los datos del usuario"}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCancel} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>
        </MotionBox>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <form onSubmit={handleSubmit} id="user-form">
          {/* Alertas de éxito/error */}
          <Collapse in={showSuccess}>
            <Alert
              severity="success"
              sx={{ m: 2 }}
              icon={<CheckCircle />}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setShowSuccess(false)}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
            >
              Usuario {!isEditing ? "registrado" : "actualizado"} correctamente
            </Alert>
          </Collapse>

          <Collapse in={!!userStore.error}>
            <Alert
              severity="error"
              sx={{ m: 2 }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => userStore.setError(null)}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
            >
              {userStore.error}
            </Alert>
          </Collapse>

          <Collapse in={isSubmitting || isValidating}>
            <Alert severity="info" sx={{ m: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} />
                <span>
                  {isValidating ? "Validando datos..." : "Guardando cambios..."}
                </span>
              </Box>
            </Alert>
          </Collapse>

          {/* Formulario */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Columna izquierda - Datos personales */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2.5}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    Datos personales
                  </Typography>

                  {isEditing && (
                    <TextField
                      label="ID de usuario"
                      value={`#${id}`}
                      fullWidth
                      disabled
                      size="small"
                      helperText="El ID no se puede modificar"
                    />
                  )}

                  <TextField
                    name="name"
                    label="Nombre completo"
                    placeholder="Ej: Juan Pérez"
                    fullWidth
                    required
                    value={name || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting || isValidating}
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    autoFocus={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    name="email"
                    label="Correo electrónico"
                    type="email"
                    placeholder="ejemplo@dominio.com"
                    fullWidth
                    required
                    value={email || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting || isValidating}
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    name="phone"
                    label="Teléfono"
                    type="tel"
                    placeholder="Ej: +51 123 456 789"
                    fullWidth
                    value={phone || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting || isValidating}
                    helperText="Opcional - Formato internacional"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControl
                    fullWidth
                    required
                    error={touched.role_id && !!errors.role_id}
                    disabled={loadingRoles}
                  >
                    <InputLabel id="role-label">Rol</InputLabel>
                    <Select
                      labelId="role-label"
                      name="role_id"
                      value={role_id || ""}
                      onChange={handleRoleChange}
                      onBlur={handleBlur}
                      label="Rol"
                      disabled={isSubmitting || isValidating || loadingRoles}
                      startAdornment={
                        <InputAdornment position="start">
                          <AdminPanelSettings color="primary" fontSize="small" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Seleccione un rol</em>
                      </MenuItem>
                      {rolesList.map((rol) => (
                        <MenuItem key={rol.id} value={rol.id}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AdminPanelSettings fontSize="small" />
                            {rol.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {loadingRoles && (
                      <FormHelperText>
                        <CircularProgress size={12} sx={{ mr: 0.5 }} />
                        Cargando roles...
                      </FormHelperText>
                    )}
                    {touched.role_id && errors.role_id && (
                      <FormHelperText error>{errors.role_id}</FormHelperText>
                    )}
                  </FormControl>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "background.default",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={active === true || active === 1 || active === "1"}
                          onChange={handleActiveChange}
                          name="active"
                          color="success"
                          disabled={isSubmitting || isValidating}
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <span>Usuario activo</span>
                          {(active === true || active === 1) && (
                            <Chip
                              label="Activo"
                              size="small"
                              color="success"
                              icon={<CheckCircle sx={{ fontSize: 14 }} />}
                            />
                          )}
                        </Box>
                      }
                    />
                    <Typography variant="caption" color="textSecondary">
                      Los usuarios inactivos no podrán acceder al sistema
                    </Typography>
                  </Paper>
                </Stack>
              </Grid>

              {/* Columna derecha - Seguridad */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2.5}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    Seguridad
                  </Typography>

                  <TextField
                    name="password"
                    label={!isEditing ? "Contraseña" : "Nueva contraseña"}
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    value={password || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting || isValidating}
                    error={touched.password && !!errors.password}
                    helperText={
                      touched.password && errors.password
                        ? errors.password
                        : isEditing && "Dejar en blanco para mantener la contraseña actual"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={isSubmitting || isValidating}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {password && !isEditing && (
                    <Collapse in={!!password}>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Typography variant="caption" color="textSecondary">
                            Fortaleza:
                          </Typography>
                          <Box sx={{ display: "flex", gap: 0.5, flex: 1 }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                              <Box
                                key={level}
                                sx={{
                                  flex: 1,
                                  height: 4,
                                  bgcolor:
                                    level <= passwordStrength.score
                                      ? `${passwordStrength.color}.main`
                                      : "grey.300",
                                  borderRadius: 2,
                                  transition: "all 0.3s ease",
                                }}
                              />
                            ))}
                          </Box>
                          <Typography
                            variant="caption"
                            color={`${passwordStrength.color}.main`}
                            sx={{ fontWeight: "bold", minWidth: 70 }}
                          >
                            {passwordStrength.message}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          <Chip
                            label="8+ caracteres"
                            size="small"
                            color={passwordStrength.checks.length ? "success" : "default"}
                            variant={passwordStrength.checks.length ? "filled" : "outlined"}
                          />
                          <Chip
                            label="Mayúsculas"
                            size="small"
                            color={passwordStrength.checks.uppercase ? "success" : "default"}
                            variant={passwordStrength.checks.uppercase ? "filled" : "outlined"}
                          />
                          <Chip
                            label="Minúsculas"
                            size="small"
                            color={passwordStrength.checks.lowercase ? "success" : "default"}
                            variant={passwordStrength.checks.lowercase ? "filled" : "outlined"}
                          />
                          <Chip
                            label="Números"
                            size="small"
                            color={passwordStrength.checks.number ? "success" : "default"}
                            variant={passwordStrength.checks.number ? "filled" : "outlined"}
                          />
                          <Chip
                            label="Caracteres especiales"
                            size="small"
                            color={passwordStrength.checks.special ? "success" : "default"}
                            variant={passwordStrength.checks.special ? "filled" : "outlined"}
                          />
                          <Chip
                            label="Sin espacios"
                            size="small"
                            color={passwordStrength.checks.noSpaces ? "success" : "default"}
                            variant={passwordStrength.checks.noSpaces ? "filled" : "outlined"}
                          />
                        </Box>
                      </Box>
                    </Collapse>
                  )}

                  {(!isEditing || (password && password !== "")) && (
                    <TextField
                      label={!isEditing ? "Confirmar contraseña" : "Confirmar nueva contraseña"}
                      fullWidth
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      disabled={isSubmitting || isValidating}
                      error={!!confirmPasswordError}
                      helperText={confirmPasswordError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              disabled={isSubmitting || isValidating}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}

                  {isEditing && (
                    <Alert severity="info" icon={<ErrorOutline />}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Información importante:</strong>
                      </Typography>
                      <Typography variant="body2">
                        • Para cambiar la contraseña, ingresa una nueva en el campo de contraseña.
                        <br />
                        • Si dejas la contraseña en blanco, se mantendrá la actual.
                        <br />
                        • Los cambios de rol afectarán los permisos inmediatamente.
                      </Typography>
                    </Alert>
                  )}

                  {!isEditing && (
                    <Alert severity="warning" icon={<ErrorOutline />}>
                      <Typography variant="body2">
                        Se enviará un correo de bienvenida al usuario con sus credenciales de acceso.
                      </Typography>
                    </Alert>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2, borderTop: 1, borderColor: "divider" }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          startIcon={<ArrowBack />}
          disabled={isSubmitting || isValidating}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="user-form"
          variant="contained"
          color="primary"
          startIcon={
            isSubmitting || isValidating ? (
              <CircularProgress size={20} />
            ) : (
              <Save />
            )
          }
          disabled={canSubmit()}
          sx={{ minWidth: 120 }}
        >
          {isSubmitting || isValidating
            ? "Procesando..."
            : !isEditing
            ? "Registrar Usuario"
            : "Actualizar Usuario"}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default Form;