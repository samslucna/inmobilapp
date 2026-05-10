import React, { Fragment, useContext } from "react";

import { ToolsContext } from "../../../context/ToolsContext";
import { ContractContext } from "../../../context/ContractContext";
const Show = () => {
  const { numberToString } = useContext(ToolsContext);
  const { btnView, btnExport, btnMn, contract, handlerPage,detailsContract } =
    useContext(ContractContext);

  return (
    <Fragment>
      <div className="image content">
        <div className="ui fluid card">
          <div className="content">
            <div class="ui internally celled grid">
              <div class="row">
                <div class="sixteen wide computer column">
                  <div class="ui mini statistics">
                    <div class="statistic">
                      <div class="value"> {contract.id}</div>
                      <div class="label">Contrato:</div>
                    </div>
                    <div class="statistic">
                      <div class="value">
                        {" "}
                        {contract.buyer.name + " " + contract.buyer.lastnames}
                      </div>
                      <div class="label">Cliente</div>
                    </div>
                    <div class="statistic">
                      <div class="value">{contract.property.name}</div>
                      <div class="label">Lote</div>
                    </div>
                    <div class="statistic">
                      <div class="value">{numberToString(contract.amount)}</div>
                      <div class="label">Costo Lote($)</div>
                    </div>
                    <div class="statistic">
                      <div class="value">{numberToString(detailsContract.totalTickets)}</div>
                      <div class="label">Abonado($)</div>
                    </div>
                    <div class="statistic">
                      <div class="value">{contract.amount === detailsContract.totalTickets ? <p>Finiquitado</p> : <p>Pagando..</p> }</div>
                      <div class="label">Status</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="sixteen wide mobile three wide computer column">
                  <div
                    class="ui green attached button"
                    id="nwticket"
                    onClick={(e) => {
                      btnMn(e);
                    }}
                  >
                    + Recibo
                  </div>
                  <div
                    class="ui primary attached button"
                    id="ticketspdf"
                    onClick={(e) => {
                      btnExport(
                        e,
                        "/api/contracts/export/pdf/contractExportPDF?id=" +
                          contract.id,
                        "pdf",
                        "contract",
                        "Contrato"
                      );
                      btnMn(e);
                    }}
                  >
                    Contrato
                  </div>
                  <div
                    class="ui primary attached button"
                    id="tickets"
                    onClick={(e) => {
                      btnMn(e);
                    }}
                  >
                    Recibos
                  </div>
                  <div
                    class="ui black attached button"
                    id="exit"
                    onClick={(e) => {
                      btnView(e);
                    }}
                  >
                    Regresar
                  </div>
                </div>

                <div class="sixteen wide mobile thirteen wide computer column">
                  {handlerPage()}
                </div>
              </div>
            </div>

            <div className="description"></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Show;
