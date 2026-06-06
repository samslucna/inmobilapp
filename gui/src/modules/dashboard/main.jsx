import { Avatar, Grid, Typography, Button } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HomeIcon from "@mui/icons-material/Home"; // Ejemplo de icono
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { Link } from "react-router-dom";

import { useEffect } from "react";

import Dashboard from './Dashboard'
export default function main() {
  const cards = [
        {
      title: "Contratos",
      link: "/contratos",
      icon: () => <HistoryEduIcon fontSize="large" />,
    },
    {
      title: "Inventario de lotes",
      link: "/inventario",
      icon: () => <AppRegistrationIcon fontSize="large" />,
    },
    {
      title: "Finanzas",
      link: "/finanzas",
      icon: () => <AccountBalanceIcon fontSize="large" />,
    },
    {
      title: "Reportes",
      link: "/reportes",
      icon: () => <SignalCellularAltIcon fontSize="large" />,
    },
    {
      title: "Usuarios",
      link: "/reportes",
      icon: () => <GroupIcon fontSize="large" />,
    },
  ];

  

  return (
    
   <>
   
   
      <Dashboard />
    </>
  );
}
