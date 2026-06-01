import Swal from "sweetalert2";
import InputBase from "@mui/material/InputBase";
import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { styled, alpha } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import { useState, Fragment } from "react";
import changeFormat from "../../../helper/changeFormat";
import ReportStore from "../../../store/ReportStore";
import ModalDoc from "./ModalDoc";

//import Show from "./Show";

const TableDatas = observer(({ list }) => {
  return (
    <div className="right sixteen wide five wide computer field">
        <Typography mt={2} variant="h5" gutterBottom component="div">
          Resultados
        </Typography>
      <div className="ui buttons">
        <ModalDoc
          data={ReportStore.filter}
          url={"/api/properties/reportPropertiesPdf"}
          color={"error"}
          title={"Exportar PDF"}
        />
      </div>

      <table className="ui stackable small  table">
        <thead>
          <tr>
            <th>N°</th>
            <th>Lote</th>
            <th>Manzana</th>
            <th>Etapa</th>
            <th>Costo($)</th>
            <th>Pagado($)</th>
            <th>Saldo($)</th>
            <th>Fecha C.</th>
            <th>status</th>
          </tr>
        </thead>
        <tbody>
          {list !== [] && list !== undefined
            ? list.map((data) => {
                return (
                  <tr key={"r" + data.id}>
                    <td>{data.id}</td>
                    <td>{data.name}</td>

                    <td> {data.manzana}</td>
                    <td>{data.stage_id}</td>
                    <td>{changeFormat.numberToString(data.amount_init)}</td>
                    <td>{changeFormat.numberToString(data.total_pagado)}</td>
                    <td>
                      {data.total_pagado !== 0
                        ? changeFormat.numberToString(data.saldo)
                        : "$ 0.00"}
                    </td>
                    <td>
                      {changeFormat.toDate(data.fecha_contrato) === "1969-12-31"
                        ? "Sin contrato"
                        : changeFormat.toDate(data.fecha_contrato)}
                    </td>
                    <td>{data.status}</td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
      <div className="ui icon buttons">
        <Pagination
          count={ReportStore.pagination.last_page}
          page={ReportStore.pagination.currentPage}
          onChange={ReportStore.handlePaginationChange}
        />
      </div>
    </div>
  );
});

export default TableDatas;
