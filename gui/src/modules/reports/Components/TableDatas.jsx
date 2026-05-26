import Swal from "sweetalert2";
import InputBase from "@mui/material/InputBase";
import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { styled, alpha } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import { useState, Fragment } from "react";

//import Show from "./Show";

const TableDatas = observer(({ list }) => {
  
  return (
    <div className="right sixteen wide five wide computer field">
      <div className="ui buttons">
     
     
      </div>
      <table className="ui stackable small  table">
        <thead>
          <tr>
            <th>N°</th>
            <th>Fecha</th>

            <th>Concepto</th>
            <th>Pago</th>
            <th>Monto($)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list !== [] && list !== undefined
            ? list.map((data) => {
                return (
                  <tr key={"r" + data.id}>
                    <td>{data.id}</td>
                    <td>{data.date}</td>

                    <td> {data.concept}</td>
                    <td>{data.paytype}</td>
                    <td>{(data.amount)}</td>
                    <td>
                      <div
                        key={"edit" + data.id}
                        className="ui mini basic icon buttons"
                      >
                        <button id="delete" className="ui  button">
                          <i
                            id={"del" + data.id}
                            onClick={(e) => {
                              //handleDelete(data.id);
                            }}
                            className="trash red icon"
                          ></i>
                        </button>
                        <button className="ui  button">
                          <i
                            id={"del" + data.id}
                            onClick={() => {
                              //goEdit(data);
                            }}
                            id={"edit" + data.id}
                            className="edit blue icon"
                          ></i>
                        </button>
                        {/* <ModalDocIcon
                          data={data}
                          url={"/api/tickets/export/pdf/ticket?id="}
                          color={"eye blue icon"}
                          title={"Recibo #"+data.id}
                        /> */}
                      </div>
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
});

export default TableDatas;
