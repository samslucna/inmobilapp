import React, { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Collapse,
} from "@mui/material";
import { BorderAll, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Dashboard } from "@mui/icons-material";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BarChart from "@mui/icons-material/BarChart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Link } from "react-router-dom";
import authStore from "../store/AuthStore";


// Supongamos que este es tu arreglo de entrada
const menuData = [
   {
      text: "Finanzas",
      link: "#!",
      permission: "reportes.read",
      submenu: [
        { text: "Contratos",permission: "reportes.read", link: "/contratos" ,icon: <HistoryEduIcon fontSize="small" /> }, // Crud Contratos
        { text: "Recibos de Ingresos", link: "/recibos", permission: "reportes.read", icon: <PaymentsIcon variant="small"  /> }, // Captura los recibos
        //{ text: "Estado de Cuenta", link: "/usuarios",icon: <RequestQuoteIcon variant="small" /> }, //Para los estados de cuenta de los clientes?
      ],
      icon: <MonetizationOnIcon variant="outline" />,
    },
 
    {
      text: "Catalogos",
      link: "#!",
      permission: "reportes.read",
      submenu: [
        { text: "Clientes", link: "clientes" ,permission: "reportes.read", icon: <PeopleAltIcon variant="small" /> },
        { text: "Propietarios", permission: "reportes.read", link: "propietarios",icon: <PermIdentityIcon variant="small" /> },
        { text: "Agentes", link: "agentes",permission: "reportes.read", icon: <AccountBoxIcon variant="small" /> },
        { text: "Proyectos", link: "proyectos", permission: "reportes.read",icon: <AccountTreeTwoToneIcon variant="small" /> },
        { text: "Lotes", link: "lotes",permission: "reportes.read", icon: <BorderAll variant="small" /> },
        { text: "Usuarios", link: "usuarios", permission: "reportes.create", icon: <AccountCircleIcon variant="small" /> },
        { text: "Roles", link: "roles", permission: "reportes.create",icon: <SupervisedUserCircleIcon variant="small" /> },
      ],
      icon: <ListAltIcon />,
    },
     {
       text: "Reportes",
       link: "#!",
       permission: "reportes.read",
       submenu: [
         { text: "Lotes", link: "/reportelotes",permission: "reportes.read",icon: <BorderAll variant="small" /> },
         //{ text: "Recibos", link: "/recibos",icon: <MonetizationOnIcon variant="small" /> },
         //{ text: "Ingresos", link: "/recibos",icon: <MonetizationOnIcon variant="small" /> },
         //{ text: "Ventas", link: "/recibos",icon: <MonetizationOnIcon variant="small" /> },

       ],
       icon: <BarChart />,
     },
  ];
export default function Sidebar({ openSidebar }) {

  const {Can} = authStore;

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

     const [open, setOpen] = useState({});
   
     const handleToggle = (text) => {
       setOpen((prev) => ({
         ...prev,
         [text]: !prev[text],
       }));
     };
   
  

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: openSidebar ? 240 : 0,

        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: openSidebar ? 240 : 0,

          overflowX: "hidden",
          transition: "0.3s",
          mt: "64px",
        },
      }}
    >
      <List sx={{ width: "100%", maxWidth: 300 }}>
        <ListItemButton component={Link} key={0} to="/dashboard">
          <Dashboard />
          <ListItemText primary={"Panel de Control"} />
        </ListItemButton>
        {menuData.map((item, index) => (
          <React.Fragment key={index+1}>
           
            {/* Elemento Principal */}
            <Can permission={item.permission}>
            <ListItemButton
              onClick={() => (item.submenu ? handleToggle(item.text) : null)}

            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText primary={item.text} />
              {item.submenu ? (
                open[item.text] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              ) : null}
            </ListItemButton>
            </Can>

            {/* Submenú desplegable (si existe) */}
            {item.submenu && (
              <Collapse in={open[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.map((sub, subIndex) => (
                    <Can permission={sub.permission} key={subIndex}>
                    <ListItemButton
                      key={subIndex}
                      sx={{ pl: 4 }}
                      variant={Link}
                      to={sub.link}
                    >
                      {sub.icon}
                      <ListItemText primary={sub.text} />
                    </ListItemButton>
                    </Can>
                  ))}
                </List>
              </Collapse>
            )}

          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}
