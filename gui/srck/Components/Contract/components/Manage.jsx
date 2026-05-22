import React, { Fragment, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import $ from "jquery";
import "sweetalert2/dist/sweetalert2.css";
import { ToolsContext } from "../../../context/ToolsContext";
import { ContractContext } from "../../../context/ContractContext";
const Manage = ({ setSelectedConten }) => {
  const { numberToString } = useContext(ToolsContext);

  const {
    addData,
    agent,
    validInput,
    contractChangeInput,
    editDataInput,
    searchBy,
    setData,
    buyer,
    seller,
    property,
    contract,
    searchInput,
    searchEdit,
    queryTable,
  } = useContext(ContractContext);

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

        break;

      case "cln":
        console.log("procedimiento para limpiar");
        setSelectedConten("main");
        break;

      default:
        break;
    }
  };

  useEffect(() => {

    switch (searchEdit) {
      case "srchbuyer":
        if (queryTable !== [] && queryTable !== undefined) {
          $(".ui.dropdown.downbuyer").dropdown("show");
        } else {
          $(".ui.dropdown.downbuyer").dropdown("hiden");
        }
        break;
      case "srchseller":
        if (queryTable !== [] && queryTable !== undefined) {
          $(".ui.dropdown.downseller").dropdown("show");
        } else {
          $(".ui.dropdown.downseller").dropdown("hiden");
        }
        break;

      case "srchagent":
        if (queryTable !== [] && queryTable !== undefined) {
          $(".ui.dropdown.downagent").dropdown("show");
        } else {
          $(".ui.dropdown.downagent").dropdown("hiden");
        }
        break;
      case "srchprop":
        if (queryTable !== [] && queryTable !== undefined) {
          $(".ui.dropdown.downproperties").dropdown("show");
        } else {
          $(".ui.dropdown.downproperties").dropdown("hiden");
        }
        break;
      default:
        break;
    }
  }, [queryTable]);

 

  return (
    <Fragment>
      <div className="ui grid container">
        <div className="row">
          <div class="ui modal">
            <i class="close icon"></i>
            <div class="header">Modal Title</div>
            <div class="image content">
              <div class="image">An image can appear on left or an icon</div>
              <div class="description">
                A description can appear on the right
              </div>
            </div>
            <div class="actions">
              <div class="ui button">Cancel</div>
              <div class="ui button">OK</div>
            </div>
          </div>
          <div className="sixteen wide column">
            <h3 class="ui dividing header">Alta de Contrato</h3>
          </div>
        </div>

        <div className="row">
          <div className="sixteen wide column">
            <h4 class="ui dividing header">Datos del Contratos:</h4>
            <form class="ui celled form">
              <div class="two fields">
                <div className="field">
                  <div class="field">
                    <label>Cliente:</label>
                    <div className="field">
                      <div key={"buyer"} class="ui right action input">
                        <input
                          name={"srchbuyer"}
                          type={searchInput.buyer}
                          className="ui small input"
                          onChange={searchBy}
                          placeholder="inmueble  ....."
                        />
                      </div>

                      <br />
                      <br />
                      {buyer.id !== undefined || buyer.id !== null ? (
                        <div key={"b" + buyer.id} className="field">
                          <div class="ui relaxed divided list">
                            <div class="item">
                              <i class="large users middle aligned icon"></i>
                              <div class="content">
                                <a
                                  id={"buyer_idss" + buyer.id}
                                  class="header button "
                                  onClick={(e) => {
                                    editDataInput(e);
                                  }}
                                >
                                  {buyer.id + " " + buyer.name + " "}{" "}
                                  <i className="ui edit icon"></i>
                                </a>
                                <div class="description">
                                  Apellidos:
                                  {" " + buyer.lastnames + " "}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div class="ui right dropdown  downbuyer item">
                      <div class="menu " key={"buyer"}>
                        {queryTable !== []
                          ? queryTable.map((data) => {
                              return (
                                <div
                                  key={"br" + data.id}
                                  id={"br" + data.id}
                                  class="item"
                                  onClick={(e) => {
                                    setData(e, data);
                                  }}
                                >
                                  id:{data.id + " " + data.name + "  "}
                                  {data.lastnames + " "}
                                </div>
                              );
                            })
                          : null}
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <br />

                    <label>Vendedor:</label>
                    <div className="field">
                      <div key={"seller"} class="ui right action input">
                        <input
                          name={"srchseller"}
                          type={searchInput.seller}
                          className="ui small input"
                          onChange={searchBy}
                          placeholder="inmueble  ....."
                        />
                      </div>

                      <br />
                      {seller.id !== undefined || seller.id !== null ? (
                        <div key={"b" + seller.id} className="field">
                          <div class="ui relaxed divided list">
                            <div class="item">
                              <i class="large user middle aligned icon"></i>
                              <div class="content">
                                <a
                                  id={"seller_ids" + seller.id}
                                  class="header button "
                                  onClick={(e) => {
                                    editDataInput(e);
                                  }}
                                >
                                  {seller.id + " " + seller.name + " "}{" "}
                                  <i className="ui edit icon"></i>
                                </a>
                                <div class="description">
                                  {" " + seller.lastnames + " "}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div class="ui right dropdown  downseller item">
                    <div class="menu " key={"seller"}>
                      {queryTable !== []
                        ? queryTable.map((data) => {
                            return (
                              <div
                                key={"sr" + data.id}
                                id={"sr" + data.id}
                                class="item"
                                onClick={(e) => {
                                  setData(e, data);
                                }}
                              >
                                id:{data.id + " " + data.name + "  "}
                                {data.lastnames + " "}
                              </div>
                            );
                          })
                        : null}
                    </div>
                  </div>
                  <div class="field">
                    <label>Agente de Ventas:</label>
                    <div className="field">
                      <div key={"agent"} class="ui right action input">
                        <input
                          name={"srchagent"}
                          type={searchInput.agent}
                          className="ui small input"
                          onChange={searchBy}
                          placeholder="Agente de ventas  ....."
                        />
                      </div>

                      <br />
                      {agent.id !== undefined || agent.id !== null ? (
                        <div key={"a" + agent.id} className="field">
                          <div class="ui relaxed divided list">
                            <div class="item">
                              <i class="large user secret middle aligned icon"></i>
                              <div class="content">
                                <a
                                  id={"agent_idss" + agent.id}
                                  class="header button "
                                  onClick={(e) => {
                                    editDataInput(e);
                                  }}
                                >
                                  {agent.id + " " + agent.name + " "}{" "}
                                  <i className="ui edit icon"></i>
                                </a>
                                <div class="description">
                                  {" " + agent.lastnames + " "}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div class="ui right dropdown  downagent item">
                    <div class="menu " key={"agent"}>
                      {queryTable !== []
                        ? queryTable.map((data) => {
                            return (
                              <div
                                key={"ar" + data.id}
                                id={"ar" + data.id}
                                class="item"
                                onClick={(e) => {
                                  setData(e, data);
                                }}
                              >
                                id:{data.id + " " + data.name + "  "}
                                {data.lastnames + " "}
                              </div>
                            );
                          })
                        : null}
                    </div>
                  </div>
                  <div class="field">
                    <label>Fecha del Contrato:</label>
                    <input
                      onChange={contractChangeInput}
                      value={contract.datecontract}
                      type="date"
                      name="datecontract"
                      placeholder="nombre Agente ....."
                    />
                  </div>
                </div>

                <div class="field">
                  <div className="field"></div>
                  <div className="field">
                    <label>Propiedad/Inmueble/Lote:</label>
                    <div class="ui right action input">
                      <input
                        name={"srchprop"}
                        type={searchInput.property}
                        className="ui small input"
                        onChange={searchBy}
                        placeholder="inmueble ....."
                      />
                    </div>
                  </div>

                  <div class="ui right dropdown  downproperties item">
                    <div class="menu " key={"prop"}>
                      {queryTable !== []
                        ? queryTable.map((data) => {
                            return (
                              <div
                                class="item"
                                key={"pr" + data.id}
                                id={"pr" + data.id}
                                onClick={(e) => {
                                  setData(e, data);
                                }}
                              >
                                id:{data.id + " " + data.name + "  "} $:
                                {data.amount + " "}
                              </div>
                            );
                          })
                        : null}
                    </div>
                  </div>

                  <div className="field">
                    {property.id !== undefined || property.id !== null ? (
                      <div key={"p" + property.id} className="field">
                        <div class="ui relaxed divided list">
                          <div class="item">
                            <i class="large building middle aligned icon"></i>
                            <div class="content">
                              <a
                                id={"property_i" + property.id}
                                class="header button "
                                onClick={(e) => {
                                  editDataInput(e);
                                }}
                              >
                                {property.id + " " + property.name + ""}{" "}
                                <i className="ui edit icon"></i>
                              </a>
                              <div class="description">
                                Precio venta($):
                                {" " + numberToString(property.amount)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <br />
                  <br />

                  <div class="field">
                    <label>Plazo(meses):</label>
                    <select
                      name="plazo"
                      onChange={contractChangeInput}
                      value={contract.plazo}
                      class="ui fluid dropdown"
                    >
                      <option value={0}>------</option>
                      <option value={12}>12</option>

                      <option value={18}>18</option>
                      <option value={24}>24</option>
                      <option value={36}>36</option>
                    </select>
                  </div>
                  <label>Enganche($):</label>
                  <input
                    onChange={contractChangeInput}
                    value={contract.partamount}
                    type="text"
                    name="partamount"
                    placeholder="0.00"
                  />
                  <br />
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
            </form>
          </div>

          <div className="eight wide column"></div>
        </div>
      </div>
    </Fragment>
  );
};

export default Manage;
