import React, { Fragment, useContext, useEffect } from "react";
import $ from "jquery";
import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/dist/sweetalert2.css";

import { AgentContext } from "../../../context/AgentContext";
const Manage = ({ setSelectedConten }) => {
  const { addData, agent,validInput, agentChangeInput, clearForm, inptUpd } =
    useContext(AgentContext);

  const actionBtns = async (e) => {
    e.preventDefault();
    const actiontype = e.target.id.substr(0, 3);
    //const actionid = (e.target.id).substr(-3, 3)

    switch (actiontype) {
      case "add":
        console.log("procedimiento para agregar");
    
        $("#loader").dimmer("show");
        await addData('agents');
        $("#loader").dimmer("hide");
       

        break;

      case "cln":
        clearForm();
        setSelectedConten("main");
        console.log("procedimiento para limpiar");
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
            <h3 className="ui dividing header">Registrar Vendedor</h3>
          </div>
        </div>

        <div className="row">
          <div className="sixteen wide column">
            <form className="ui celled form">
              <div className="two fields">
                <div className="two fields">
                  <div className="field">
                    <div className="field">
                      <label>Nombre:</label>
                      <div className="ui small icon input">
                        <input
                          onChange={agentChangeInput}
                          value={agent.name}
                          type="text"
                          name="name"
                          placeholder="Nombre"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label>Apellidos:</label>
                      <input
                        onChange={agentChangeInput}
                        value={agent.lastnames}
                        type="text"
                        name="lastnames"
                        placeholder="sugerido para ....."
                      />
                    </div>
                    <div className="field">
                      <label>Direccion:</label>
                      <div className="ui  icon input">
                        <input
                          type="text"
                          onChange={agentChangeInput}
                          value={agent.address}
                          name="address"
                          placeholder="Direccion"
                        />
                      </div>
                    </div>
             
                  </div>

                  <div className="field">
                           <div className="field">
                      <label>Telefono:</label>
                      <input
                        type="text"
                        onChange={agentChangeInput}
                        value={agent.phone}
                        name="phone"
                        placeholder="Telefono"
                      />
                    </div>
                    <div className="field">
                      <label>INE(DNI):</label>
                      <input
                        type="text"
                        onChange={agentChangeInput}
                        value={agent.dni}
                        name="dni"
                        placeholder="Credencial"
                      />
                    </div>
                    <div className="field">
                      <label>Correo eletronico:</label>
                      <input
                        name="email"
                        onChange={agentChangeInput}
                        value={agent.email}
                        placeholder="Correo electroinico"
                      />
                  
                    </div>
                    <br />
                    <br />
                    <div className="field">
                      <div className="ui right icon buttons">
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
