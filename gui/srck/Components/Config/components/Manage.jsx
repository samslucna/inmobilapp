import React, { Fragment, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/dist/sweetalert2.css";
import { ToolsContext } from "../../../context/ToolsContext";
const Manage = () => {
  const { saveDatas, inputNumber } = useContext(ToolsContext);

  const [buyer, setBuyer] = useState([]);
  const [inptUpd, setInptUpd] = useState(false);

  const BuyerChangeInput = (e, result) => {
    //e.preventDefault();

    const { name, value } = e.target || result;

    if (name === "amount") {
      setBuyer({
        ...buyer,
        [name]: inputNumber(e),
      });
    } else {
      setBuyer({
        ...buyer,
        [name]: value,
      });
    }
  };

  const clearForm = () => {
    setBuyer({
      name: "",
      lastnames: "",
      address: "",
      phone: "",
      status: "",
    });
  };

  const addData = () => {
    console.log(buyer)
    let dataInsert = {
      name: buyer.name,
      lastnames: buyer.lastnames,
      address: buyer.address,
      phone: buyer.phone,
      status: buyer.status,
    };

    Swal.fire({
      title: "Desea guardar los Cambios?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#d33",
      confirmButtonText: "Guardar",
      denyButtonText: `Cancelar`,
      showCancelButton: false,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //console.log(dataInsert)
       
        await saveDatas("/api/buyers", dataInsert).then((res) => {
          if (res.status == 200) {
            Swal.fire("Guardado!", "", "success");

            //clearForm();
          } else {
            Swal.fire("Error al guardar la informacion..", "", "error");
          }
        });
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
      }
    });
  };

  const actionBtns = async (e) => {
    e.preventDefault();

    const actiontype = e.target.id.substr(0, 3);
    //const actionid = (e.target.id).substr(-3, 3)

    switch (actiontype) {
      case "add":
        console.log("procedimiento para agregar");
        addData();
        break;
      case "upd":
        console.log("procedimiento para Actualizar");

        break;

      case "del":
        console.log("procedimiento para Eliminar");
        clearForm();
        break;

      case "cln":
        console.log("procedimiento para limpiar");
        //setSelectedConten('main')
        clearForm();
        break;

      default:
        break;
    }
  };

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
                        onChange={BuyerChangeInput}
                        value={buyer.name}
                        type="text"
                        name="name"
                        placeholder="Nombre"
                      />
                    </div>
                  </div>

                  <div class="field">
                    <label>Apellidos:</label>
                    <textarea
                      onChange={BuyerChangeInput}
                      value={buyer.lastnames}
                      type="text"
                      name="lastnames"
                      rows="2"
                      placeholder="sugerido para ....."
                    />
                  </div>
                  <div class="field">
                    <label>Direccion:</label>
                    <div class="ui  icon input">
                      <input
                        type="text"
                        onChange={BuyerChangeInput}
                        value={buyer.address}
                        name="address"
                        placeholder="Direccion"
                      />
                    </div>
                  </div>
                  <div class="field">
                    <label>Telefono:</label>
                    <input
                      type="text"
                      onChange={BuyerChangeInput}
                      value={buyer.phone}
                      name="phone"
                      placeholder="Telefono"
                    />
                  </div>
                  <div class="field">
                    <label>status:</label>
                    <select
                      name="status"
                      onChange={BuyerChangeInput}
                      value={buyer.status}
                      class="ui fluid dropdown"
                    >
                      <option value={0}>------</option>
                      <option value={1}>Habilitado</option>
                      
                      <option value={2}>Desabilitado</option>
                    </select>
                  </div>
                 
                </div>

                <div className="field">
               

                  <div className="field">
                   
                    
                    <div class="ui right icon buttons">
                      {inptUpd !== false ? (
                        <div
                          onClick={(e) => {
                            actionBtns(e);
                          }}
                          id="upd"
                          className="ui teal button"
                        >
                          <i className="save icon"></i>
                          Actualizar
                        </div>
                      ) : (
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
                      )}
                      <div
                        onClick={(e) => {
                          actionBtns(e);
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
