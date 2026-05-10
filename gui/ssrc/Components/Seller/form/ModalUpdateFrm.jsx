import React, { Fragment, useState, useContext, useEffect } from "react";
import $ from "jquery";
const ModalUpdateFrm = ({ seller }) => {

  return (
    <Fragment>
      <div className="ui modal" id="SellerEdit">
        <i className="close icon"></i>
        <div className="header">Informacion del Propietario:</div>
        <div className="image content">
          <div className="ui fluid card">
            <div className="content">
              <div className="header">{seller.name}</div>
              <div className="description">
                <form className="ui celled form">
                  <div className="two fields">
                    <div className="field">
                      <div className="field">
                        <label>Apellidos:</label>
                        <p>{seller.lastnames}</p>
                      </div>
                      <div className="field">
                        <label>Direccion:</label>
                        <p>{seller.address}</p>
                      </div>
                      <div className="field">
                            <label>Telefono:</label>
                            <p>{seller.phone}</p>
                          </div>

                      <div className="field">
                        <label>Email:</label>
                        <p>
                          {" "}
                          {seller.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
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
