import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, icon, color = "#0176d3" }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: 2,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography variant="h4" fontWeight="bold" mt={1}>
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: `${color}20`,
              p: 1.5,
              borderRadius: 2,
              color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
