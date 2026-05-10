import { Typography } from "@mui/material";
import DataList from "./DataList";
import { useEffect } from "react";
import ContractStore from "../../store/ContractStore";


export default function Page() {
  useEffect(() => {
    ContractStore.loadContracts();
    
  }, []);
  return (
  <>
  <Typography variant="h4">Contratos</Typography>
  <DataList />
  </>);
}