import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./modules/login";
import DashboardLayout from "./layouts/Layout";
import Dashboard from "./modules/dashboard";
import { Navigate } from "react-router-dom";
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
import ReporteLotes from "./modules/reports/Lots";
import ReporteAgentes from "./modules/reports/Agents";


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
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },

      { path: "dashboard", element: <Dashboard /> },

      { path: "proyectos", element: <CatProjec /> },

      { path: "etapas", element: <CatStage /> },

      { path: "manzanas", element: <CatBlock /> },

      { path: "clientes", element: <CatClientes /> },

      { path: "propietarios", element: <CatProperties /> },

      { path: "agentes", element: <CatAgents /> },

      { path: "lotes", element: <CatLots /> },

      { path: "roles", element: <CatRols /> },

      { path: "usuarios", element: <UsersPage /> },

      { path: "contratos", element: <ContractsPage /> },

      { path: "recibos", element: <TicketsPage /> },

      { path: "reportelotes", element: <ReporteLotes /> },
      { path: "reporteagentes", element: <ReporteAgentes /> },
    ]
  }
]);
