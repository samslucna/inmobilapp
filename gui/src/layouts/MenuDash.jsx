import React, { useState } from 'react';
import { 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Collapse 
} from '@mui/material';
import { BorderAll, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Dashboard } from '@mui/icons-material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BarChart from "@mui/icons-material/BarChart";
import ListAltIcon from '@mui/icons-material/ListAlt';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Link } from 'react-router-dom';

// Supongamos que este es tu arreglo de entrada
const menuData = [
   {
      text: "Ventas",
      link: "/ventas",
      submenu: [
        { text: "Contratos", link: "/contratos" ,icon: <HistoryEduIcon fontSize="small" /> }, // Crud Contratos
        { text: "Recibos de Ingresos", link: "/recibos", icon: <PaymentsIcon variant="small"  /> }, // Captura los recibos
        { text: "Estado de Cuenta", link: "/usuarios",icon: <RequestQuoteIcon variant="small" /> }, //Para los estados de cuenta de los clientes?
      ],
      icon: <MonetizationOnIcon variant="outline" />,
    },
 
    {
      text: "Catalogos",
      link: "#!",
      submenu: [
        { text: "Clientes", link: "clientes" , icon: <PeopleAltIcon variant="small" /> },
        { text: "Propietarios", link: "propietarios",icon: <PermIdentityIcon variant="small" /> },
        { text: "Agentes", link: "agentes",icon: <AccountBoxIcon variant="small" /> },
        { text: "Proyectos", link: "proyectos",icon: <AccountTreeTwoToneIcon variant="small" /> },
        { text: "Lotes", link: "lotes",icon: <BorderAll variant="small" /> },
        { text: "Usuarios", link: "usuarios", icon: <AccountCircleIcon variant="small" /> },
        { text: "Roles", link: "roles",icon: <SupervisedUserCircleIcon variant="small" /> },
      ],
      icon: <ListAltIcon />,
    },
    // {
    //   text: "Reportes",
    //   link: "/reportes",
    //   submenu: [
    //     { text: "Lotes", link: "/lotes",icon: <MonetizationOnIcon variant="small" /> },
    //     { text: "Recibos", link: "/recibos",icon: <MonetizationOnIcon variant="small" /> },
    //     { text: "Ingresos", link: "/recibos",icon: <MonetizationOnIcon variant="small" /> },
    //     { text: "Ventas", link: "/recibos",icon: <MonetizationOnIcon variant="small" /> },
   
    //   ],
    //   icon: <BarChart />,
    // },
  ];

const MenuDash = ({ items }) => {
  // Estado para controlar qué menús están abiertos (usando el texto como llave)
  const [open, setOpen] = useState({});

  const handleToggle = (text) => {
    setOpen((prev) => ({
      ...prev,
      [text]: !prev[text],
    }));
  };

  return (
    <List sx={{ width: '100%', maxWidth: 300 }}>
         <ListItemButton  component={Link} to='/dashboard' >
            <Dashboard />
            <ListItemText primary={'Panel de Control'} />
            
          </ListItemButton>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {/* Elemento Principal */}
          <ListItemButton onClick={() => item.submenu ? handleToggle(item.text) : null}>
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.text} />
            {item.submenu ? (open[item.text] ? <ExpandLess /> : <ExpandMore />) : null}
          </ListItemButton>

          {/* Submenú desplegable (si existe) */}
          {item.submenu && (
            <Collapse in={open[item.text]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.submenu.map((sub, subIndex) => (
                  <ListItemButton key={subIndex} sx={{ pl: 4 }} variant={Link} to={sub.link}>
                    {sub.icon}
                    <ListItemText primary={sub.text} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default function App() {
  return <MenuDash items={menuData} />;
}