import { Typography } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import RolStore from "../../../store/RolStore";
import { useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import Swal from "sweetalert2";

const Checkets = observer(({ module, permission }) => {
  const [loading, setLoading] = useState(false);
  const [localState, setLocalState] = useState({
    create: permission?.create || false,
    read: permission?.read || false,
    update: permission?.update || false,
    delete: permission?.delete || false
  });

  // Sincronizar cuando cambia el permiso (al seleccionar otro rol)
  useEffect(() => {
    setLocalState({
      create: permission?.create || false,
      read: permission?.read || false,
      update: permission?.update || false,
      delete: permission?.delete || false
    });
  }, [permission]);

  const onChangeCheck = useCallback(async (e, accion, currentValue) => {
    e.preventDefault();
    e.stopPropagation();
    
    const nuevoEstado = !currentValue;
    const previousState = { ...localState };
    
    console.log(`🔵 Cambiando permiso: ${module}.${accion} de ${currentValue} a ${nuevoEstado}`);
    
    // Optimistic update inmediato en UI
    setLocalState(prev => ({ ...prev, [accion]: nuevoEstado }));
    setLoading(true);
    
    try {
        // 1. Obtener permisos actuales del store
        let currentPermissions = [...RolStore.permissions];
        
        // 2. Encontrar y actualizar el módulo
        const moduleIndex = currentPermissions.findIndex(p => p.module === module);
        
        if (moduleIndex === -1) {
            throw new Error("Módulo no encontrado");
        }
        
        // 3. Crear objeto actualizado
        const updatedModule = {
            ...currentPermissions[moduleIndex],
            [accion]: nuevoEstado
        };
        
        // 4. Crear nuevo array de permisos
        const updatedPermissions = [
            ...currentPermissions.slice(0, moduleIndex),
            updatedModule,
            ...currentPermissions.slice(moduleIndex + 1)
        ];
        
        // 5. Actualizar store localmente
        RolStore.setPermissions(updatedPermissions);
        
        // 6. Preparar datos para enviar al backend
        const roleData = {
            id: RolStore.rol?.id,
            name: RolStore.rol?.name,
            permissions: updatedPermissions.map(p => ({
                module: p.module,
                create: Boolean(p.create),
                read: Boolean(p.read),
                update: Boolean(p.update),
                delete: Boolean(p.delete)
            }))
        };
        
        console.log('📤 Enviando al backend:', JSON.stringify(roleData, null, 2));
        
        // 7. Enviar al servidor
        const response = await RolStore.updateRolePermissions(roleData);
        
        console.log('📥 Respuesta del backend:', response);
        
        // 8. Verificar que el backend guardó correctamente
        if (response && response.success) {
            console.log('✅ Permiso actualizado correctamente');
            
            // Actualizar el store con los permisos devueltos por el backend
            if (response.data && response.data.permissions_by_module) {
                // Sincronizar con la respuesta del servidor
                const serverPermissions = response.data.permissions_by_module;
                RolStore.setPermissions(serverPermissions);
                
                // Actualizar estado local
                const updatedFromServer = serverPermissions.find(p => p.module === module);
                if (updatedFromServer) {
                    setLocalState({
                        create: updatedFromServer.create || false,
                        read: updatedFromServer.read || false,
                        update: updatedFromServer.update || false,
                        delete: updatedFromServer.delete || false
                    });
                }
            }
        } else {
            throw new Error(response?.message || 'Error al guardar');
        }
        
    } catch (error) {
        console.error("❌ Error al guardar:", error);
        
        // Revertir cambios en UI
        setLocalState(previousState);
        
        // Revertir en store
        const currentPermissions = [...RolStore.permissions];
        const moduleIndex = currentPermissions.findIndex(p => p.module === module);
        
        if (moduleIndex !== -1) {
            const revertedModule = {
                ...currentPermissions[moduleIndex],
                [accion]: previousState[accion]
            };
            
            const revertedPermissions = [
                ...currentPermissions.slice(0, moduleIndex),
                revertedModule,
                ...currentPermissions.slice(moduleIndex + 1)
            ];
            
            RolStore.setPermissions(revertedPermissions);
        }
        
        // Mostrar error al usuario
        Swal.fire({
            title: "Error",
            text: "No se pudo guardar el cambio. Intenta de nuevo.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
        });
    } finally {
        setLoading(false);
    }
}, [module, localState]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
        <CircularProgress size={20} />
        <Typography variant="caption">Guardando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Tooltip title="Permiso para crear">
        <FormControlLabel
          control={
            <Checkbox
              checked={localState.create}
              onChange={(e) => onChangeCheck(e, "create", localState.create)}
              sx={{
                color: "green",
                "&.Mui-checked": { color: "green" },
              }}
              size="small"
            />
          }
          label="Crear"
        />
      </Tooltip>
      
      <Tooltip title="Permiso para leer/ver">
        <FormControlLabel
          control={
            <Checkbox
              checked={localState.read}
              onChange={(e) => onChangeCheck(e, "read", localState.read)}
              sx={{
                color: "blue",
                "&.Mui-checked": { color: "blue" },
              }}
              size="small"
            />
          }
          label="Leer"
        />
      </Tooltip>
      
      <Tooltip title="Permiso para editar/actualizar">
        <FormControlLabel
          control={
            <Checkbox
              checked={localState.update}
              onChange={(e) => onChangeCheck(e, "update", localState.update)}
              sx={{
                color: "orange",
                "&.Mui-checked": { color: "orange" },
              }}
              size="small"
            />
          }
          label="Editar"
        />
      </Tooltip>
      
      <Tooltip title="Permiso para eliminar">
        <FormControlLabel
          control={
            <Checkbox
              checked={localState.delete}
              onChange={(e) => onChangeCheck(e, "delete", localState.delete)}
              sx={{
                color: pink[800],
                "&.Mui-checked": { color: pink[600] },
              }}
              size="small"
            />
          }
          label="Eliminar"
        />
      </Tooltip>
    </Box>
  );
});

export default Checkets;