import { Grid, Paper, Typography } from "@mui/material";
import StatCard from "./StatCard";
import { useEffect } from "react";
import ToastStore from "../../store/ToastStore";
import { Toaster } from "react-hot-toast";
import PaymentsDailyChart from "./components/charts/PaymentsDailyChart";

import PaymentsMonthlyChart from "./components/charts/PaymentsMonthlyChart";

import StageInventoryChart from "./components/charts/StageInventoryChart";

import BlockInventoryChart from "./components/charts/BlockInventoryChart";
import PieChartInGrid from "./components/charts/PieChartInGrid";

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
  const dataPayment = {
    cards: {
      vendidas: 320,
      disponibles: 87,
      corriente: 290,
      atrasados: 30,
    },

    pagosPorDia: [],

    pagosPorMes: [],

    ventasPorEtapa: [],

    ventasPorManzana: [],
  };
    useEffect(()=>{
      const welcomeUser = ()=>{
        const user = JSON.parse(localStorage.getItem('user'))
      
      ToastStore.showSuccess("Bienvenido " + user.name);
      }
   
      welcomeUser()
    },[])
  return (
    <>
   
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard title="Lotes Vendidos" value="125" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard title="Lotes Pendientes" value="78" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard title="Lotes Disponibles" value="350" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard title="Pagos Atrasados" value="15" />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }} sx={{mt:3}}>
           {/*  <PaymentsDailyChart
              data={[
                { dia: "1", cantidad: 4 },
                { dia: "2", cantidad: 8 },
                { dia: "3", cantidad: 5 },
              ]}
            /> */}
             <PieChartInGrid />
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }} sx={{mt:3}}>
            <PaymentsMonthlyChart
              data={[
                { mes: "Ene", cantidad: 120 },
                { mes: "Feb", cantidad: 130 },
                { mes: "Mar", cantidad: 115 },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 12 }} >
        
          </Grid>

        </Grid>
      
    </>
  );
}
