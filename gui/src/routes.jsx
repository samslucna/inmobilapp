import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./modules/login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./modules/dashboard";

import CatClientes from './modules/clients'
import CatProperties from './modules/Propertaries'
import CatAgents from './modules/Agents'
import CatLots from './modules/Lots'
import CatRols from './modules/Rols'
import CatProjec from './modules/Projects'
import CatStage from './modules/stage'
import CatBlock from './modules/blocks'
import ContractsPage from "./modules/Contracts";
import TicketsPage from './modules/Tickets';
import FinanzasPage from "./modules/finances";
import ReportesPage from "./modules/reports";
import UsersPage from "./modules/users";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element:(<ProtectedRoute> <Dashboard /></ProtectedRoute>) },
      { path: "proyectos", element:(<ProtectedRoute> <CatProjec /> </ProtectedRoute>)},
      { path: "etapas", element:(<ProtectedRoute> <CatStage /> </ProtectedRoute>)},
      { path: "manzanas", element:(<ProtectedRoute> <CatBlock /> </ProtectedRoute>)},
      { path: "clientes", element:(<ProtectedRoute> <CatClientes /> </ProtectedRoute>)},
      { path: "propietarios", element:(<ProtectedRoute> <CatProperties /></ProtectedRoute>) },
      { path: "agentes", element: (<ProtectedRoute> <CatAgents /> </ProtectedRoute>)},
      { path: "lotes", element: (<ProtectedRoute><CatLots /></ProtectedRoute>) },
      { path: "roles", element: (<ProtectedRoute><CatRols /></ProtectedRoute>) },
   
      { path: "usuarios", element: <UsersPage /> },

      { path: "contratos", element: <ContractsPage /> },
      { path: "recibos", element: <TicketsPage /> },
      { path: "reportes", element: <ReportesPage /> },
    ],
  },
], {basename: "/",});
