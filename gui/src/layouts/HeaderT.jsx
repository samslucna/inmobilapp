import { use, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Link, Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Avatar,
  Menu as MenuIcon,
} from "@mui/material";

import Dashboard from "@mui/icons-material/Dashboard";
import MenuItem from "@mui/material/MenuItem";
import BarChart from "@mui/icons-material/BarChart";
import Logout from "@mui/icons-material/Logout";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";


import authStore from "../store/AuthStore";
import App from "./MenuDash";

const drawerWidth = 240;
// Estilos dinámicos para el Drawer
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
});

const DDrawer = styled(Drawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && { ...openedMixin(theme), "& .Drawer-paper": openedMixin(theme) }),
  ...(!open && {
    ...closedMixin(theme),
    "& .Drawer-paper": closedMixin(theme),
  }),
}));

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
   const [anchorEl, setAnchorEl] = useState(null);
  const openM = Boolean(anchorEl);
  
  const menuItems = [
    { text: "Dashboard", link: "/dashboard", submenu: [], icon: <Dashboard /> },
    {
      text: "Ventas",
      link: "/ventas",
      submenu: [
        { text: "Contratos", link: "/contratos" }, // Crud Contratos
        { text: "Registro de pago", link: "/pagos" }, // Captura los recibos
        { text: "Estado de Cuenta", link: "/usuarios" }, //Para los estados de cuenta de los clientes?
      ],
      icon: <MonetizationOnIcon variant="outlined" />,
    },
 
    {
      text: "Catalogos",
      link: "#!",
      submenu: [
        { text: "Clientes", link: "/catalogo/clientes" },
        { text: "Propietarios", link: "/propiedades" },
        { text: "Agentes", link: "/agentes" },
        { text: "Lotes", link: "/usuarios" },
        { text: "Usuarios", link: "/usuarios" },
        { text: "Roles", link: "/roles" },
      ],
      icon: <ListAltIcon />,
    },
    {
      text: "Reportes",
      link: "/reportes",
      submenu: [
        { text: "Lotes", link: "/lotes" },
        { text: "Recibos", link: "/recibos" },
        { text: "Ingresos", link: "/recibos" },
        { text: "Ventas", link: "/recibos" },
   
      ],
      icon: <BarChart />,
    },
  ];

 
;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };



  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Barra Superior */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#FFFF",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setOpen(!open)}
            edge="start"
            sx={{
              marginRight: 5,
              backgroundColor: "#333",
              "&:hover": { backgroundColor: "#555" },
            }}
          >
            <MenuIcon /> Menu
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: "#333" }}
          >
            ERP Motsakki
          </Typography>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={openM ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openM ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
          <MenuIcon
            anchorEl={anchorEl}
            id="account-menu"
            open={openM}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* <MenuItem onClick={handleClose}>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Avatar /> My account
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem> */}
            <MenuItem onClick={() => authStore.logout()}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </MenuIcon>
        </Toolbar>
      </AppBar>

      {/* Menú Lateral */}
      <DDrawer variant={open ? "permanent" : "temporary"} open={open}>
        <Toolbar />{" "}
        {/* Espaciador para que el contenido no quede bajo el AppBar */}
        <Box sx={{ overflow: "auto" }}>
          <App />
        </Box>
      </DDrawer>

      {/* Contenido Principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
