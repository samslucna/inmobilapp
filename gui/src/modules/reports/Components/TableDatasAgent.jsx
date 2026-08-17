import Swal from "sweetalert2";
import InputBase from "@mui/material/InputBase";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { styled, alpha } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import { useState, Fragment } from "react";
import changeFormat from "../../../helper/changeFormat";
import ModalDoc from "./ModalDoc";
import usePagination from "../../../hooks/usePagination";
import ContractStore from "../../../store/ContractStore";
import ReportStore from "../../../store/ReportStore";
import DataTablePagination from "./DataTablePagination";

const TableDatasAgent = observer(({ list, loading }) => {


  const handleChange = (e, value) => {
    e.preventDefault();
    ReportStore.handlePaginationChangeContract(value);
  };

  const isLoading = loading;

  if (isLoading && (!list || list.length === 0)) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2 }}>Cargando contratos...</Typography>
      </Paper>
    );
  }

  return (
    <div className="right sixteen wide five wide computer field">
      <Typography mt={2} variant="h5" gutterBottom component="div">
        Resultados
      </Typography>
      <div className="ui buttons">
        <ModalDoc
          data={ReportStore.filter}
          url={"/api/contracts/reportAgentsContractsPdf"}
          color={"error"}
          title={"Exportar PDF"}
        />
        <Button
          variant="contained"
          color="success"
          onClick={() =>
            ReportStore.toExportExcel(
              "/api/properties/reportAgentsXls",
              "Reporte de agentes",
              ReportStore.filter,
            )
          }
          sx={{ mb: 2 }}
        >
          Excel
        </Button>
      </div>

      <table className="ui stackable small  table">
        <thead>
          <tr>
            <th>N°</th>
            <th>Vendedor</th>
            <th>Lote</th>
            <th>Manzana</th>
            <th>Etapa</th>
            <th>Costo($)</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {list !== [] && list !== undefined
            ? list.map((data, i) => {
                return (
                  <tr key={i}>
                    <td>{data.id}</td>
                    <td>{data?.agent?.name + " " + data?.agent?.lastnames}</td>
                    <td> {data?.property?.name}</td>
                    <td>{data?.property?.block_id}</td>
                    <td>{data.etapa}</td>
                    <td>
                      {changeFormat.numberToString(data?.property?.amount_init)}
                    </td>
                    <td>
                      {changeFormat.toDate(data.date) === "1969-12-31"
                        ? "Sin contrato"
                        : changeFormat.toDate(data.date)}
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
      <div className="ui icon buttons">
    <div className="ui icon buttons">
         <Pagination
           count={ReportStore.pagination.last_page || 1}
           page={ReportStore.pagination.currentPage || 1}
           onChange={ReportStore.handlePaginationChangeContract}
         />
       </div>
      </div>
    </div>
  );
});

export default TableDatasAgent;
