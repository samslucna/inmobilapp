import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Box,
  Typography,
  Tooltip,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import InputBase from "@mui/material/InputBase";
import { Edit, Delete } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import { styled, alpha } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";

import Stack from "@mui/material/Stack";
import RolStore from "../../store/RolStore";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,

  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const TablePermission = observer(({ datas }) => {
  const handleDelete = async (id) => {
    const resp = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (resp.isConfirmed) {
      await RolStore.removeRol(id);

      Swal.fire({
        title: "Eliminado",
        text: "El usuario ha sido eliminado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleChange = (e, value) => {
    RolStore.handlePaginationChange(value);
  };

  return (
    <>
    <Typography variant="h6" sx={{ mb: 2 }}>
Configurar permisos
  </Typography>
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      {/* Box con overflowX asegura la responsividad en móviles */}
  
      <Grid container spacing={2}>

          <Table aria-label="tabla de roles">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Modulo</TableCell>
                <TableCell>Leer</TableCell>
                <TableCell>Crear</TableCell>
                <TableCell>Actualizar</TableCell>
                <TableCell>Eliminar</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datas.map((rol) => (
                <TableRow key={rol.id} hover>
                  <TableCell>{rol.id}</TableCell>

                  {/* Columna de Usuario con Avatar */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {rol.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold" }}
                        >
                          {rol.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {rol.description}
                    </Typography>
                  </TableCell>
                   <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {rol.description}
                    </Typography>
                  </TableCell>
                   <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {rol.description}
                    </Typography>
                  </TableCell>
                   <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {rol.description}
                    </Typography>
                  </TableCell>

                  {/* Acciones del CRUD */}
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        sx={{ color: "blue" }}
                        onClick={() => RolStore.goEdit(rol)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(rol.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* Componente de Paginación */}
          </Table>
          <Stack spacing={2} sx={{ padding: 2, alignItems: "center" }}>
            <Pagination
              count={RolStore.pagination.last_page}
              page={RolStore.pagination.currentPage}
              onChange={handleChange}
            />
          </Stack>
 
      </Grid>
    </TableContainer>
    </>
  );
});

export default TablePermission;
