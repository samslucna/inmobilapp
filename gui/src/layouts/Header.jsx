import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Button,
} from "@mui/material";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import MenuIcon from "@mui/icons-material/Menu";
import Delete from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import authStore from "../store/AuthStore";
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; 
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

const sections = [
  { label: "Panel de Control", path: "/dashboard", fun: () => {} },
  { label: "Inventario", path: "/inventario", fun: () => {} },
  { label: "Finanzas", path: "/finanzas", fn: () => {} },
  { label: "Reportes", path: "/reportes", fn: () => {} },
  { label: "Usuarios", path: "/usuarios", fun: () => {} },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  return (
    <AppBar
      position="sticky"
      sx={{ backgroundColor: "#EEF4F7", color: "#333" }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <img
            src="./img/logosnm.png"
            alt="Logo"
            style={{ height: 50, marginRight: 10 }}
          />
        </Typography>

     

        <IconButton
          sx={{ display: { xs: "block", md: "none" } }}
          color="inherit"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: { xs: "none", md: "block" },backgroundColor: "#EEF4F7", color: "#333" }}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              component={Link}
              to="/dashboard"
              label="Panel de Control"
              icon={<AssessmentIcon />}
            />
              <BottomNavigationAction
              component={Link}
              to="/inventario"
              label="Contratos"
              icon={<HistoryEduIcon />}
            />
            <BottomNavigationAction
              component={Link}
              to="/inventario"
              label="Inventario de Lotes"
              icon={<AppRegistrationIcon />}
            />
            <BottomNavigationAction
              component={Link}
              to="/reportes"
              label="Reportes"
              icon={<SignalCellularAltIcon />}
            />
            <BottomNavigationAction
              component={Link}
              to="/finanzas"
              label="Finanzas"
              icon={<AttachMoneyIcon />}
            />
            <BottomNavigationAction
              component={Link}
              to="/usuarios"
              label="Usuarios"
              icon={<GroupIcon />}
            />
            <BottomNavigationAction
              onClick={() => authStore.logout()}
              label="Cerrar Sesión"
              icon={<Delete />}
            />
          </BottomNavigation>
        </Box>

        <Drawer open={open} onClose={() => setOpen(false)}>
          <List sx={{ width: 250 }}>
            {sections.map((s) => (
              <ListItem key={s.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={s.path}
                  onClick={() => setOpen(false)}
                >
                  <ListItemText primary={s.label} />
                </ListItemButton>
              </ListItem>
            ))}
                <ListItem key={'logout'} disablePadding>
                <ListItemButton
               
                  onClick={() => { authStore.logout(); setOpen(false); }}
                >
                  <ListItemText primary={'Cerrar Sesión'} />
                </ListItemButton>
              </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
