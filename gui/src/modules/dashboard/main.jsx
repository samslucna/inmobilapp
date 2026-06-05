import { Avatar, Grid, Typography, Button } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HomeIcon from "@mui/icons-material/Home"; // Ejemplo de icono
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { Link } from "react-router-dom";
import ToastStore from "../../store/ToastStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Dashboard from './Dashboard'

export default function main() {
 



  return (
    <>
   
      <Toaster />
      <Dashboard />
    </>
  );
}
