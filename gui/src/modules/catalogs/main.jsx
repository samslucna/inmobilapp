import { Grid, Button, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home"; // Ejemplo de icono
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BorderAll from '@mui/icons-material/BorderAll';
import { Link } from "react-router-dom";

export default function CatalogsPage() {
  const cards = [
    {
      title: "Clientes",
      link: "/clientes",
      icon: () => <PeopleAltIcon variant="large" />,
    },
    {
      title: "Propietarios",
      link: "/propitarios",
      icon: () => <PermIdentityIcon fontSize="large" />,
    },
    {
      title: "Agentes",
      link: "/agentes",
      icon: () => <AccountBoxIcon fontSize="large" />,
    },
    {
      title: "Lotes",
      link: "/lotes",
      icon: () => <BorderAll fontSize="large" />,
    },
    {
      title: "Usuarios",
      link: "/usuarios",
      icon: () => <AccountCircleIcon fontSize="large" />,
    },
    {
      title: "Roles",
      link: "/roles",
      icon: () => <SupervisedUserCircleIcon fontSize="large" />,
    },
  ];

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Catalogos
      </Typography>

      <Grid container spacing={3}>
        {cards.map((c) => (
          <Button
            key={c.title}
            xs={12}
            sm={6}
            md={4}
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
    </>
  );
}
