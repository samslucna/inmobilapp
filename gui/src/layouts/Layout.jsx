import { Box } from "@mui/material";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 70;

export default function DashboardLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(true);


  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#e5f5ec",
      }}
    >
      <Sidebar openSidebar={openSidebar}  />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Topbar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

        <Box
          component="main"
          sx={{
            p: 3,
            mt: "64px",
          }}
        >
          {<Outlet />}
        </Box>
      </Box>
    </Box>
  );
}