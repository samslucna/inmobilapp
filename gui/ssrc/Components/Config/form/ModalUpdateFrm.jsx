import React, { Fragment, useState, useContext, useEffect } from "react";
import $ from "jquery";
import { ToolsContext } from "../../../context/ToolsContext";
const ModalUpdateFrm = ({ buyer }) => {
  const { numberToString } = useContext(ToolsContext);

  return (
    <Fragment>
      <div class="ui modal" id="BuyerEdit">
        <i class="close icon"></i>
        <div class="header">Informacion del Lote</div>
        <div class="image content">
          <div class="ui fluid card">
            <div class="content">
              <div class="header">{buyer.name}</div>
              <div class="description">
                <form class="ui celled form">
                  <div class="two fields">
                    <div className="field">
                      <div class="field">
                        <label>Apellidos:</label>
                        <p>{buyer.lastnames}</p>
                      </div>
                      <div class="field">
                        <label>Direccion:</label>
                        <p>{buyer.address}</p>
                      </div>

                      <div class="field">
                        <label>status:</label>
                        <p>
                          {" "}
                          {buyer.status === "1"
                            ? "Habilitado"
                            : buyer.status === "2"
                            ? "Desabilitado"
                            : null}
                        </p>
                      </div>
                    </div>

                    <div className="field">
                      <div class="field">
                        <h4 class="ui dividing header">Ubicacion:</h4>
                        <div class="two fields">
                          <div class="field">
                            <label>Direccion:</label>
                            <p>{buyer.address}</p>
                          </div>
                          <div class="field">
                            <label>Etapa:</label>
                            <p>{buyer.stage}</p>
                          </div>
                        </div>
                      </div>
                      <div class="field">
                        <h4 class="ui dividing header">Colindancias</h4>
                        <div class="three fields">
                          <div class="field">
                            <label>Norte.:</label>
                            <p>{buyer.north}</p>
                          </div>
                          <div class="field">
                            <label>Sur:</label>
                            <p>{buyer.south}</p>
                          </div>
                          <div class="field">
                            <label>Este.:</label>
                            <p>{buyer.east}</p>
                          </div>
                          <div class="field">
                            <label>Oeste.:</label>
                            <p>{buyer.west}</p>
                          </div>
                        </div>
                      </div>

                      <div className="field">
                        <br />

                        <label>Precio de compra($):</label>
                        <p>{numberToString(buyer.amount)}</p>

                        <br />
                        <br />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="ui black deny button">
            <i class="power off icon"></i>Salir
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ModalUpdateFrm;
