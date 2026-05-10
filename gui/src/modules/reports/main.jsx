import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const cards = [
    { title: "Inventario", link: "/inventario" },
    { title: "Finanzas", link: "/finanzas" },
    { title: "Reportes", link: "/reportes" },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((c) => (
        <Grid key={c.title} item xs={12} sm={6} md={4}>
          <Card component={Link} to={c.link} sx={{ textDecoration: "none" }}>
            <CardContent>
              <Typography variant="h5">{c.title}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}