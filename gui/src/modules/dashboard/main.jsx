import { Avatar, Grid, Typography, Button } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HomeIcon from "@mui/icons-material/Home"; // Ejemplo de icono
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { Link } from "react-router-dom";

export default function Dashboard() {
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
    <Grid container spacing={3}>
      {cards.map((c) => (
     
          <Button
          key={c.title}
          xs={12} sm={6} md={4}
            variant="outlined"
            startIcon={c.icon ? c.icon() : <HomeIcon fontSize="large" />}
            component={Link}
            to={c.link}
            sx={{
              textDecoration: "none",
              backgroundColor: "#f5f5f5",
              color: "#333",
            }}
          >
            {c.title}
          </Button>
      
      ))}
    </Grid>
  );
}
