import { Grid, Paper, Typography } from "@mui/material";
import StatCard from "./StatCard";
import { useEffect, useState } from "react";
import ToastStore from "../../store/ToastStore";
import DashboardStore from "../../store/DashboardStore";
import { Toaster } from "react-hot-toast";
import PaymentsDailyChart from "./components/charts/PaymentsDailyChart";

import PaymentsMonthlyChart from "./components/charts/PaymentsMonthlyChart";

import StageInventoryChart from "./components/charts/StageInventoryChart";

import BlockInventoryChart from "./components/charts/BlockInventoryChart";
import PieChartInGrid from "./components/charts/PieChartInGrid";
import AuditLogsPage from "./AuditLogPage";
import authStore from "../../store/AuthStore";

const data = [
  {
    title: "Propiedades Vendidas",
    value: 120,
  },
  {
    title: "Disponibles",
    value: 85,
  },
  {
    title: "Pagos al Corriente",
    value: 320,
  },
  {
    title: "Pagos Atrasados",
    value: 23,
  },
  {
    title: "Etapas",
    value: 7,
  },
  {
    title: "Manzanas",
    value: 45,
  },
];

export default function Dashboard() {
  const { Can } = authStore;
  const [stats, setStats] = useState({
    Totales: 0,
    TotalDisponibles: 0,
    TotalApartados: 0,
    TotalVendidos: 0,
  });

  const dataPayment = {
    cards: {
      Finiquitados: 320,
      disponibles: 87,
      corriente: 290,
      atrasados: 30,
    },

    pagosPorDia: [],

    pagosPorMes: [],

    ventasPorEtapa: [],

    ventasPorManzana: [],
  };
  useEffect(() => {
    const welcomeUser = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const datas = await DashboardStore.loadDashboard();
      setStats(datas[0]);
      ToastStore.showSuccess("Bienvenido " + user.name);
    };

    welcomeUser();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 2 }}>
          <StatCard value={stats.Totales} title="Total lotes" />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <StatCard title="Apartados" value={stats.TotalApartados} />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <StatCard title="Finiquitados" value={stats.TotalVendidos} />
        </Grid>
         <Grid size={{ xs: 12, md: 2 }}>
          <StatCard title="Pagados" value={stats.TotalPagados} />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <StatCard title="Disponibles" value={stats.TotalDisponibles} />
        </Grid>
       
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }} sx={{ mt: 3 }}>
          {/*  <PaymentsDailyChart
              data={[
                { dia: "1", cantidad: 4 },
                { dia: "2", cantidad: 8 },
                { dia: "3", cantidad: 5 },
              ]}
            /> */}
          <PieChartInGrid data={stats['stagesproperties']} />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }} sx={{ mt: 3 }}>
          <PaymentsMonthlyChart data={stats.paymonth !== undefined ? stats.paymonth: []} />
        </Grid>

        <Grid size={{ xs: 12, lg: 12 }}>
          <Can permission={"audit.read"}>
            <AuditLogsPage />
          </Can>
        </Grid>
      </Grid>
    </>
  );
}
