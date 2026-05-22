import React, { Fragment, useState, useContext, useEffect } from "react";
import { ToolsContext } from "../../../context/ToolsContext";

const ModalUpdateFrm = ({ ticket }) => {
  const { numberToString } = useContext(ToolsContext);
  return (
    <Fragment>
      <div className="ui modal" id="ticketEdit">
        <i className="close icon"></i>
        <div className="header">Recibo Numero:{ticket.id}</div>
        <div className="image content">
          <div className="ui fluid card">
            <div className="content">
              <div className="header">Cliente:{ticket.buyer}</div>
              <div className="description">
                <div className="row">
                  <div className="two fields">
                    <div className="field">
                      <label>Tipo Pago:</label>
                      <p>
                        {" "}
                        {ticket.paytype_id === 1
                          ? "Efectibo"
                          : ticket.paytype_id === 2
                          ? "Deposito"
                          : null}
                      </p>
                    </div>
                    <div className="field">
                      <label>Monto:</label>
                      <p>{numberToString(ticket.amount)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="actions">
          <div className="ui black deny button">
            <i className="power off icon"></i>Salir
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ModalUpdateFrm;
