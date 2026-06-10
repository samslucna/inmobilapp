import {
  Button,
  Card,
  Box,
  TextField,
  DialogActions,
  Alert,
  Typography,
  Grid,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from "@mui/material";
import { Add, Remove, Save, Cancel } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import RolStore from "../../store/RolStore";
import rolValidate from "../../validator/rolValidate";
import useValidatorForm from "../../hooks/useValidatorForm";
import TablePermission from "./TablePermission";

const Form = observer(() => {
  const { state, errors, handleChange, handleSubmit, handleBlur, setState } =
    useValidatorForm(RolStore.rol, rolValidate, RolStore.addRol);
  
  const [loading, setLoading] = useState(false);
  const [availableModules, setAvailableModules] = useState([]);
  const [showModuleSelector, setShowModuleSelector] = useState(false);

  const { id, name, description } = state;

  // Cargar módulos disponibles cuando se edita un rol
  useEffect(() => {
    const loadData = async () => {
      // Si estamos editando (hay ID), cargar permisos del rol
      if (id && id !== null) {
        setLoading(true);
        try {
          // Cargar permisos del rol seleccionado
          await RolStore.loadPermissionsByRole(id);
          
          // Cargar lista de módulos disponibles (desde configuración o backend)
          await loadAvailableModules();
        } catch (error) {
          console.error("Error cargando datos:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Nuevo rol: inicializar permisos vacíos
        RolStore.setPermissions([]);
        await loadAvailableModules();
      }
    };
    
    loadData();
  }, [id]);

  // Cargar módulos disponibles (puedes obtenerlos desde el backend o definirlos)
  const loadAvailableModules = async () => {
    // Opción 1: Definir módulos manualmente
    const modules = [
      { id: 1, name: "usuarios", description: "Gestión de usuarios del sistema" },
      { id: 2, name: "recibos", description: "Gestión de recibos y pagos" },
      { id: 3, name: "lotes", description: "Administración de lotes" },
      { id: 4, name: "limites", description: "Configuración de límites" },
      { id: 5, name: "reportes", description: "Generación de reportes" },
      { id: 6, name: "contratos", description: "Gestión de contratos" },
      { id: 7, name: "clientes", description: "Administración de clientes" },
      { id: 8, name: "agentes", description: "Gestión de agentes" },
      { id: 9, name: "etapas", description: "Configuración de etapas" },
      { id: 10, name: "manzanas", description: "Administración de manzanas" },
      { id: 11, name: "proyectos", description: "Gestión de proyectos" },
      { id: 12, name: "propietarios", description: "Gestión de propietarios" },
    ];
    
    // Opción 2: Si tienes un endpoint para obtener módulos
    // const response = await getModulesFromAPI();
    // setAvailableModules(response);
    
    setAvailableModules(modules);
  };

  // Agregar un nuevo módulo a los permisos
  const addModule = (moduleName) => {
    const currentPermissions = [...RolStore.permissions];
    
    // Verificar si el módulo ya existe
    if (currentPermissions.some(p => p.module === moduleName)) {
      alert("El módulo ya ha sido agregado");
      return;
    }
    
    // Crear nuevo módulo con todos los permisos en false
    const newModule = {
      id: Date.now(), // ID temporal
      module: moduleName,
      create: false,
      read: false,
      update: false,
      delete: false
    };
    
    const updatedPermissions = [...currentPermissions, newModule];
    RolStore.setPermissions(updatedPermissions);
    setShowModuleSelector(false);
  };

  // Eliminar un módulo completo
  const removeModule = (moduleName) => {
    const confirmed = window.confirm(`¿Eliminar el módulo "${moduleName}" y todos sus permisos?`);
    
    if (confirmed) {
      const updatedPermissions = RolStore.permissions.filter(p => p.module !== moduleName);
      RolStore.setPermissions(updatedPermissions);
    }
  };

  // Guardar rol con sus permisos
  const saveRol = async (e) => {
    e.preventDefault();
    
    // Validar que el rol tenga nombre
    if (!name || name.trim() === "") {
      alert("El nombre del rol es obligatorio");
      return;
    }
    
    setLoading(true);
    
    try {
      // Preparar datos del rol con permisos
      const roleData = {
        id: id || null,
        name: name,
        description: description || "",
        permissions: RolStore.permissions.map(p => ({
          module: p.module,
          create: p.create || false,
          read: p.read || false,
          update: p.update || false,
          delete: p.delete || false
        }))
      };
      
      console.log("Guardando rol:", roleData);
      
      // Llamar al store para guardar
      await RolStore.addRol(roleData);
      
      // Resetear formulario después de guardar
      RolStore.setHiddenForm(false);
      RolStore.setEditing(false);
      RolStore.setPermissions([]);
      
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  // Módulos que ya están agregados
  const addedModules = RolStore.permissions.map(p => p.module);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Card sx={{ p: 4 }}>
        <form onSubmit={saveRol}>
          <Grid container spacing={3}>
            {/* Columna izquierda - Datos del rol */}
            <Grid item xs={12} md={5}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                {id === null ? "📝 Registrar nuevo rol" : "✏️ Editar rol"}
              </Typography>
              
              <TextField
                fullWidth
                name="name"
                label="Nombre del rol *"
                value={name || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                required
                disabled={loading}
                helperText="Ej: Administrador, Editor, Usuario"
              />
              {errors.name && <Alert severity="error" sx={{ mt: 1 }}>{errors.name}</Alert>}

              <TextField
                fullWidth
                name="description"
                label="Descripción"
                value={description || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                multiline
                rows={3}
                disabled={loading}
                helperText="Descripción opcional del rol"
              />
              {errors.description && <Alert severity="error" sx={{ mt: 1 }}>{errors.description}</Alert>}

              {/* Módulos agregados - Versión compacta */}
              {addedModules.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                    Módulos configurados:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {addedModules.map(module => (
                      <Chip
                        key={module}
                        label={module}
                        onDelete={() => removeModule(module)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Botón para agregar módulos */}
              {!showModuleSelector ? (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setShowModuleSelector(true)}
                  sx={{ mt: 2 }}
                  fullWidth
                  disabled={loading}
                >
                  Agregar módulo
                </Button>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Selecciona un módulo:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, maxHeight: 200, overflow: "auto" }}>
                    {availableModules
                      .filter(m => !addedModules.includes(m.name))
                      .map(module => (
                        <Chip
                          key={module.id}
                          label={module.name}
                          onClick={() => addModule(module.name)}
                          color="success"
                          variant="outlined"
                          clickable
                          icon={<Add />}
                        />
                      ))}
                  </Box>
                  <Button
                    size="small"
                    onClick={() => setShowModuleSelector(false)}
                    sx={{ mt: 1 }}
                  >
                    Cancelar
                  </Button>
                </Box>
              )}
            </Grid>

            {/* Columna derecha - Permisos */}
            <Grid item xs={12} md={7}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Configuración de permisos
                {addedModules.length === 0 && (
                  <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                    (Agrega módulos para configurar permisos)
                  </Typography>
                )}
              </Typography>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TablePermission permission={RolStore.permissions} />
              )}
            </Grid>
          </Grid>

          {/* Botones de acción */}
          <Divider sx={{ my: 3 }} />
          
          <DialogActions sx={{ px: 0 }}>
            <Button
              onClick={() => {
                RolStore.setHiddenForm(false);
                RolStore.setEditing(false);
                RolStore.setPermissions([]);
              }}
              variant="outlined"
              startIcon={<Cancel />}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading}
            >
              {loading ? "Guardando..." : (id === null ? "Registrar Rol" : "Actualizar Rol")}
            </Button>
          </DialogActions>
        </form>
      </Card>
    </Box>
  );
});

export default Form;