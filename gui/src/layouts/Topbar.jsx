import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import BarChart from "@mui/icons-material/BarChart";
import Logout from "@mui/icons-material/Logout";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import authStore from "../store/AuthStore";

export default function Topbar({ setOpenSidebar, openSidebar }) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openM, setOpenM] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: "#478d63",
        zIndex: 1300,
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            borderRadius: 2,
            px: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "monospace",
              fontWeight: 400,
              color: "black",
              mr: 2,
            }}
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <IconButton
              color="inherit"
              onClick={() => setOpenSidebar(!openSidebar)}
            >
              {openSidebar ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            Motsakki-Matju ERP
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          sx={{ width: 32, height: 32, background: "#b82424", color: "white" }}
          onClick={() => authStore.logout()}
        >
          Salir
        </Button>
      </Toolbar>
    </AppBar>
  );
}
