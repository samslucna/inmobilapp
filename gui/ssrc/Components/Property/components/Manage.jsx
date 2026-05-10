import React, { Fragment, useContext,useEffect} from "react";

import "sweetalert2/dist/sweetalert2.css";
import { PropertyContext } from "../../../context/PropertyContext ";
const Manage = ({setSelectedConten}) => {
 
 const { addData, property,validInput, propertyChangeInput, clearForm, inptUpd } =
    useContext(PropertyContext);

  const actionBtns = async (e) => {
    e.preventDefault();

    const actiontype = e.target.id.substr(0, 3);
    //const actionid = (e.target.id).substr(-3, 3)

    switch (actiontype) {
      case "add":
        console.log("procedimiento para agregar");
        addData();
        clearForm();
        setSelectedConten('search')
        break;
      

      case "cln":
        console.log("procedimiento para limpiar");
        clearForm();
        setSelectedConten('search')
        
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
            <h3 class="ui dividing header">Agregar Lote</h3>
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
                        onChange={propertyChangeInput}
                        value={property.name}
                        type="text"
                        name="name"
                        placeholder="Nombre"
                      />
                    </div>
                  </div>

                  <div class="field">
                    <label>Descripción:</label>
                    <textarea
                      onChange={propertyChangeInput}
                      value={property.description}
                      type="text"
                      name="description"
                      rows="2"
                      placeholder="sugerido para ....."
                    />
                  </div>
                  <div class="field">
                    <label>Direccion:</label>
                    <div class="ui  icon input">
                      <input
                        type="text"
                        onChange={propertyChangeInput}
                        value={property.address}
                        name="address"
                        placeholder="Direccion"
                      />
                    </div>
                  </div>
                  <h4 class="ui dividing header">Caracteristicas</h4>
                  <div class="field">
                    <div class="four fields">
                      <div class="field">
                        <label>Superficie #M2:</label>
                        <input
                          type="text"
                          onChange={propertyChangeInput}
                          value={property.m2}
                          name="m2"
                          placeholder="M2"
                        />
                      </div>
                      <div class="field">
                        <label>Etapa:</label>
                        <div class="ui small icon input">
                          <input
                            type="text"
                            onChange={propertyChangeInput}
                            value={property.stage}
                            name="stage"
                            placeholder="Etapa"
                          />
                        </div>
                      </div>
                      <div class="field">
                        <label>Manzana:</label>
                        <input
                          type="text"
                          onChange={propertyChangeInput}
                          value={property.mz}
                          name="mz"
                          placeholder="Manzana"
                        />
                      </div>
                      <div class="field">
                        <label>status:</label>
                        <select
                          name="status"
                          onChange={propertyChangeInput}
                          value={property.status}
                          class="ui fluid dropdown"
                        >
                          <option value={1}>Disponible</option>
                          <option value={0}>------</option>
                          <option value={2}>Vendido</option>
                          <option value={3}>Comprometido</option>
                        </select>
                      </div>
                      
                    </div>
                  </div>
                </div>

                <div className="field">
                  <div class="field">
                    <h4 class="ui dividing header">Ubicacion:</h4>
                  
                  </div>
                  <div class="field">
                    <h4 class="ui dividing header">Colindancias</h4>
                    <div class="three fields">
                      <div class="field">
                        <label>Colindancia 1:</label>
                        <input
                          type="text"
                          onChange={propertyChangeInput}
                          value={property.colin1}
                          name="colin1"
                          placeholder="colin1"
                        />
                      </div>
                      <div class="field">
                        <label>Colindancia 2:</label>
                        <input
                          onChange={propertyChangeInput}
                          value={property.colin2}
                          type="text"
                          name="colin2"
                          placeholder="colin2"
                        />
                      </div>
                      <div class="field">
                        <label>Colindancia 3:</label>
                        <input
                          onChange={propertyChangeInput}
                          value={property.colin3}
                          type="text"
                          name="colin3"
                          placeholder="colin3"
                        />
                      </div>
                      <div class="field">
                        <label>Colindancia 4:</label>
                        <input
                          onChange={propertyChangeInput}
                          value={property.colin4}
                          type="text"
                          name="colin4"
                          placeholder="colin4"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <br />

                    <label>Precio de compra($):</label>
                    <input
                      onChange={propertyChangeInput}
                      value={property.amount}
                      type="text"
                      name="amount"
                      placeholder="0.00"
                    />
                    <br />
                    <br />
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
