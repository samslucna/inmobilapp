import React, { Fragment, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/dist/sweetalert2.css";
import { BuyerContext } from "../../../context/BuyerContext";

const Manage = ({setSelectedConten}) => {
  const { addData, buyer, buyerChangeInput,validInput } = useContext(BuyerContext);

  const actionBtns = async (e) => {
    e.preventDefault();

    const actiontype = e.target.id.substr(0, 3);
    //const actionid = (e.target.id).substr(-3, 3)

    switch (actiontype) {
      case "add":
        console.log("procedimiento para agregar");
        addData('buyers');
        break;
  

      default:
        break;
    }
  };



  useEffect(()=>{
    validInput()
  },[addData])



  return (
    <Fragment>
      <div className="ui grid container">
        <div className="row">
          <div className="sixteen wide column">
            <h3 class="ui dividing header">Agregar Cliente</h3>
          </div>
        </div>

        <div className="row">
          <div className="sixteen wide column">
            <form class="ui celled form">
              <div class="two fields">
                <div className="field">
                  <div class="field">
                    <label>Nombre:</label>
                    <div class="ui small icon input">
                      <input
                        onChange={buyerChangeInput}
                        value={buyer.name}
                        type="text"
                        name="name"
                        placeholder="Nombre"
                      />
                    </div>
                  </div>

                  <div class="field">
                    <label>Apellidos:</label>
                    <input
                      onChange={buyerChangeInput}
                      value={buyer.lastnames}
                      type="text"
                      name="lastnames"
                      placeholder="sugerido para ....."
                    />
                  </div>
                  <div class="field">
                    <label>Direccion:</label>
                    <div class="ui  icon input">
                      <input
                        type="text"
                        onChange={buyerChangeInput}
                        value={buyer.address}
                        name="address"
                        placeholder="Direccion"
                      />
                    </div>
                  </div>

                  <div className="two fields">
                    <div class="field">
                      <label>Telefono:</label>
                      <input
                        type="text"
                        onChange={buyerChangeInput}
                        value={buyer.phone}
                        name="phone"
                        placeholder="Telefono"
                      />
                    </div>

                    <div class="field">
                      <label>INE(DNI):</label>
                      <input
                        type="text"
                        onChange={buyerChangeInput}
                        value={buyer.dni}
                        name="dni"
                        placeholder="numero de credencial"
                      />
                    </div>
                    <div class="field">
                      <label>Email:</label>
                      <input
                        name="email"
                        onChange={buyerChangeInput}
                        value={buyer.email}
                        placeholder="Correo electronico"
                      />
                    </div>
                  </div>

                  <br />
                  <div class="ui right icon buttons">
              
                    <div
                      onClick={(e) => {
                        actionBtns(e);
                      }}
                      id="add"
                      className="ui green button"
                    >
                      <i className="save icon"></i>
                      Guardar
                    </div>

                    <div
                      onClick={(e) => {
                        setSelectedConten('search')
                      }}
                      id="cln"
                      className="ui gray button"
                    >
                      <i className="window close icon"></i>
                      Cancelar
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="eight wide column"></div>
        </div>
      </div>
    </Fragment>
  );
};

export default Manage;
