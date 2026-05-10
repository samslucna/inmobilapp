import React, { Fragment, useState, useContext, useEffect } from "react";
import $ from "jquery";
import { ToolsContext } from "../../../context/ToolsContext";
const ModalUpdateFrm = ({ property}) => {
  
const {numberToString}=useContext(ToolsContext)

  return (
    <Fragment>
             <div class="ui modal" id="propertyEdit">
          <i class="close icon"></i>
          <div class="header">Informacion del Lote</div>
          <div class="image content">
            <div class="ui fluid card">
              <div class="content">
                <div class="header">{property.name}</div>
                <div class="description">
                  <form class="ui celled form">
                    <div class="two fields">
                      <div className="field">
                        <div class="field">
                          <label>Descripción:</label>
                          <p>{property.description}</p>
                        </div>
                        <h4 class="ui dividing header">Caracteristicas</h4>
                        <div class="field">
                          <div class="three fields">
                            <div class="field">
                              <label>Superficie #M2:</label>
                              <p>{property.m2}</p>
                            </div>
                            <div class="field">
                              <label>status:</label>
                              <p>
                                {" "}
                                {property.status === "1"
                                  ? "Disponible"
                                  : property.status === "2"
                                  ? "Comprometido"
                                  : property.status === "3"
                                  ? "Vendido"
                                  : null}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="field">
                        <div class="field">
                          <h4 class="ui dividing header">Ubicacion:</h4>
                          <div class="two fields">
                            <div class="field">
                              <label>Direccion:</label>
                              <p>{property.address}</p>
                            </div>
                            <div class="field">
                              <label>Etapa:</label>
                              <p>{property.stage}</p>
                            </div>
                          </div>
                        </div>
                        <div class="field">
                          <h4 class="ui dividing header">Colindancias</h4>
                          <div class="three fields">
                            <div class="field">
                              <label>Colindancia 1.:</label>
                              <p>{property.colin1}</p>
                            </div>
                            <div class="field">
                              <label>Colindancia 2:</label>
                              <p>{property.colin2}</p>
                            </div>
                            <div class="field">
                              <label>Colindancia 3:</label>
                              <p>{property.colin3}</p>
                            </div>
                            <div class="field">
                              <label>Colindancia 4:</label>
                              <p>{property.colin4}</p>
                            </div>
                          </div>
                        </div>

                        <div className="field">
                          <br />

                          <label>Precio de compra($):</label>
                          <p>{numberToString(property.amount)}</p>

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
            <div class="ui black deny button"><i class="power off icon"></i>Salir</div>
            
          </div>
        </div>

    </Fragment>
  );
};

export default ModalUpdateFrm;
