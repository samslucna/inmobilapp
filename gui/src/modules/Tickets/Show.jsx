import React, { Fragment, useContext } from "react";

import changeFormat from "../../helper/changeFormat";
const Show = ({ contract, btnMn, handlerPage, btnView}) => {
  

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
                      <div class="value">{changeFormat.numberToString(contract.amount)}</div>
                      <div class="label">Costo Lote($)</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="five wide mobile three wide computer column">
                  <div
                    class="ui green attached button"
                    id="nwticket"
                    onClick={(e) => {
                      //btnMn(e);
                    }}
                  >
                    +Recibo
                  </div>
                  <div
                    class="ui primary attached button"
                    id="contract"
                    onClick={(e) => {
               /*        btnExport(
                        e,
                        "/api/contracts/export/pdf/contractExportPDF?id=" +
                          contract.id,
                        "pdf",
                        "contract",
                        "Contrato",
                      ); */
                      //btnMn(e);
                    }}
                  >
                    Contrato
                  </div>
                  <div
                    class="ui primary attached button"
                    id="tickets"
                    onClick={(e) => {
                      //btnMn(e);
                    }}
                  >
                    Recibos
                  </div>
                  <div
                    class="ui black attached button"
                    id="exit"
                    onClick={(e) => {
                      //btnView(e);
                    }}
                  >
                    Regresar
                  </div>
                </div>

                <div class="eleven wide mobile thirteen wide computer column">
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
