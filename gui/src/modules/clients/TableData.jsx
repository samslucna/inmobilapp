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
} from "@mui/material";
import Swal from "sweetalert2";
import InputBase from "@mui/material/InputBase";
import { Edit, Delete } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import ClientStore from "../../store/ClientStore";
import { styled, alpha } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";

import Stack from "@mui/material/Stack";

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

const TableData = observer(({ datas }) => {
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
      await ClientStore.removeClient(id);
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
    ClientStore.handlePaginationChange(value);
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      {/* Box con overflowX asegura la responsividad en móviles */}

      <Table aria-label="tabla de usuarios">
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Direccion</TableCell>
            <TableCell>Telefono</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {datas.map((client) => (
            <TableRow key={client.id} hover>
              <TableCell>{client.id}</TableCell>

              {/* Columna de Usuario con Avatar */}
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {client.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {client.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {client.lastnames}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{client.address}</TableCell>

              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.email}</TableCell>

              {/* Acciones del CRUD */}
              <TableCell align="right">
                <Tooltip title="Editar">
                  <IconButton
                    sx={{ color: "blue" }}
                    onClick={() => ClientStore.goEdit(client)}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(client.id)}
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
          count={ClientStore.pagination.last_page}
          page={ClientStore.pagination.currentPage}
          onChange={handleChange}
        />
      </Stack>
    </TableContainer>
  );
});

export default TableData;
