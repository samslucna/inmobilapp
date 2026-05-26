import { Typography } from "@mui/material";
import DataList from "./DataList";
import { useEffect } from "react";
import PropertyStore from "../../store/PropertyStore";
import ProjectStore from "../../store/ProjectStore";

export default function Page() {
  useEffect(() => {
    PropertyStore.loadProperties();
  }, []);
  return (
  <>
  <Typography variant="h4">Lotes</Typography>
  <DataList />
  </>);
}