import React, { Fragment, useState, useContext, useEffect } from "react";

import { ContractContext } from "../../../../context/ContractContext";
import { ToolsContext } from "../../../../context/ToolsContext";
import { TicketContext } from "../../../../context/TicketContext";

const TableTickets = () => {
  const { numberToString } = useContext(ToolsContext);
  const { removeTicket } = useContext(TicketContext);
  const { btnExport, exporTicketsContract, btnMn, contract, list, btnView } =
    useContext(ContractContext);
  return (
    <Fragment>
      <div>
        <div class="ui buttons">
          <button
            class="ui green button"
            onClick={(e) => {
              exporTicketsContract(e);
            }}
          >
            Exportar
          </button>
          <button
            class="ui red button"
            id="ticketspdf"
            onClick={(e) => {
              btnExport(
                e,
                "/api/contracts/export/pdf/contractExportTicketsPDF?id=" +
                  contract.id,
                "pdf",
                "contract",
                "Contrato"
              );

              btnMn(e);
            }}
          >
            PDF
          </button>
        </div>
        <table class="ui stackable small table">
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
            <tr key={"c" + contract.id}>
              <td>{contract.id}</td>
              <td>{contract.datecontract}</td>
              <td>Enganche</td>
              <td>Efectivo</td>
              <td>{numberToString(contract.partamount)}</td>
              <td>
                <div key={"edit0"} className="ui mini basic icon buttons">
                  <button className="ui  button">
                    <i
                      id={"view0"}
                      onClick={(e) => {
                        //btnView(e, data);
                      }}
                      className="eye blue icon"
                    ></i>
                  </button>
                </div>
              </td>
            </tr>

            {list !== [] && list !== undefined
              ? list.map((data) => {
                  return (
                    <tr key={"r" + data.id}>
                      <td>{data.id}</td>
                      <td>{data.datepay}</td>

                      <td> {data.concept}</td>
                      <td>
                        {data.paytype_id === 1 ? (
                          <p>Efectivo</p>
                        ) : data.paytype_id === 2 ? (
                          <p>Deposito</p>
                        ) : data.paytype_id === 3 ? (
                          <p>Transferencia</p>
                        ) : null}
                      </td>
                      <td>{numberToString(data.amount)}</td>
                      <td>
                        <div
                          key={"edit" + data.id}
                          className="ui mini basic icon buttons"
                        >
                          <button id="delete" className="ui  button">
                            <i
                              id={"del" + data.id}
                              onClick={(e) => {
                                removeTicket(e, data.id);
                                btnMn(e);
                              }}
                              className="trash red icon"
                            ></i>
                          </button>
                          <button className="ui  button">
                            <i
                              id={"edit" + data.id}
                              onClick={(e) => {
                                //btnEdit(e, data);
                              }}
                              className="edit blue icon"
                            ></i>
                          </button>
                          <button className="ui  button">
                            <i
                              id="ticketpdf"
                              onClick={(e) => {
                                btnExport(
                                  e,
                                  "/api/tickets/export/pdf/exportticket?id=" +
                                    data.id,
                                  "pdf",
                                  "ticket",
                                  "InApp-Recibo: "+data.id
                                );

                                btnMn(e);
                              }}
                              className="eye blue icon"
                            ></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default TableTickets;
