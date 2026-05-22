import React, { Fragment, useContext, useEffect, useState } from "react";
import { ToolsContext } from "../../../context/ToolsContext";
import $ from "jquery";

import ModalUpdateFrm from "../form/ModalUpdateFrm";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import { BuyerContext } from "../../../context/BuyerContext";

const Search = ({setSelectedConten}) => {
  const {
    pagination,
    datasTable,
    renderPagination,
    searchBy,
    toExport,
    setUrImport,
    loadTable,
    setDatasTable,
  } = useContext(ToolsContext);

  const {
    buyer,
    setBuyer,
    inptUpd,
    setInptUpd,
    xlsImport,
    setXlsImport,
    removeData,
    buyerChangeInput,
    EditData,
  } = useContext(BuyerContext);

  const showModal = async (e, data) => {
    e.preventDefault();

    setBuyer([]);
    setBuyer(data);

    $("#BuyerEdit")
      .modal({
        allowMultiple: false,
        onDeny: function () {
          console.log("salir");
        },
      })
      .modal("show");
  };

  const btnEdit = (e, data) => {
    e.preventDefault();
    if (inptUpd === false) {
      setBuyer(data);
      setInptUpd(true);
    } else if (inptUpd === true) {
      setBuyer({});
      setInptUpd(false);
    }
  };

  const onChangeImport = (e) => {
    e.preventDefault();

    setXlsImport(e.target.files[0]);
  };

  const btnImport = async (e, url) => {
    e.preventDefault();

    if (xlsImport != null) {
      //let urlxls = URL.createObjectURL(xlsImport);
      $("#loader").dimmer("show");
      await setUrImport(url, xlsImport);
      await loadTable("/api/buyers?page=1");
      $("#loader").dimmer("hide");
    }
  };
  const btnExport = async (e, url, typedoc, cod, namedoc) => {
    e.preventDefault();
    $("#loader").dimmer("show");
    await toExport(url, typedoc, cod, namedoc);
    $("#loader").dimmer("hide");
  };

  const rndertable = async () => {
    setDatasTable([]);
    $(".ui.dropdown.tableseach").dropdown();
    await loadTable("/api/buyers?page=1");
  };
  useEffect(() => {
    setInptUpd(false);
    rndertable();
  }, []);

  return (
    <Fragment>
      <div className="row">
        <ModalUpdateFrm buyer={buyer} />
        <div className="ui page dimmer" id="loader">
          <div className="content">
            <h2 className="ui inverted icon header">
              <div className="ui large text loader">Loading..</div>
            </h2>
          </div>
        </div>
        <h3>Catalogo de clientes</h3>
        <form
          className="ui celled form"
          style={{ display: inptUpd != true ? "none" : "block" }}
        >
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
                        EditData(e);
                      }}
                      id="add"
                      className="ui green button"
                    >
                      <i className="save icon"></i>
                      Guardar
                    </div>

                    <div
                      onClick={(e) => {
                        setSelectedConten('main')
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

        <div
          id="searchdatas"
          style={{ display: inptUpd != true ? "block" : "none" }}
        >
          <div className="ui top attached menu">
            <div className="ui dropdown tableseach icon item">
              <i className="wrench icon"></i>
              <div className="menu">
                <div className="item">
                  <i className="dropdown icon"></i>
                  <span className="text">Reportes Excel</span>
                  <div className="menu">
                    <div
                      className="item"
                      onClick={(e) => {
                        btnExport(
                          e,
                          "/api/buyers/export/xls",
                          "xls",
                          "all",
                          "Todos los clientes"
                        );
                      }}
                    >
                      Gral. Clientes
                    </div>
                    <div className="item" onClick={(e) => {}}>
                      Por Etapa
                    </div>
                  </div>
                </div>
                <div className="item">
                  <i className="dropdown icon"></i>
                  <span className="text">Reportes PDF</span>
                  <div className="menu">
                    <div
                      className="item"
                      onClick={(e) => {
                        btnExport(
                          e,
                          "/api/buyers/export/xls",
                          "xls",
                          "all",
                          "Todos los clientes"
                        );
                      }}
                    >
                      Gral. Clientes
                    </div>
                    <div
                      className="item"
                      onClick={(e) => {
                        //toExport(e, exportToExcel.bystage);
                      }}
                    >
                      Por Etapa
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="right menu">
              <div className="ui right aligned category search item">
                <div className="ui transparent icon input">
                  <input
                    className="prompt"
                    type="text"
                    placeholder="Buscar..."
                    onChange={(e) => searchBy(e, "buyers")}
                  />
                  <i className="search link icon"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="ui bottom attached segment">
            <div className="field">
              <input type="file" onChange={onChangeImport} name="file" />

              <button className="ui compact icon button">
                <i
                  id={"uploader"}
                  onClick={(e) => {
                    btnImport(e, "/api/buyers/import");
                  }}
                  className="cloud upload blue icon"
                ></i>
              </button>
            </div>
            <table className="ui stackable small table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>Telefono</th>
                  <th>Email</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {datasTable !== [] && datasTable !== undefined
                  ? datasTable.map((data) => {
                      return (
                        <tr key={"r" + data.id}>
                          <td>{data.id}</td>
                          <td>{data.name}</td>
                          <td>{data.lastnames}</td>

                          <td>{data.phone}</td>
                          <td>
                            {data.email }
                          </td>
                          <td>
                            <div
                              key={"edit" + data.id}
                              className="ui mini basic icon buttons"
                            >
                              <button id="delete" className="ui  button">
                                <i
                                  id={"del" + data.id}
                                  onClick={(e) => {
                                    removeData(e, data.id);
                                  }}
                                  className="trash red icon"
                                ></i>
                              </button>
                              <button className="ui  button">
                                <i
                                  id={"edit" + data.id}
                                  onClick={(e) => {
                                    btnEdit(e, data);
                                  }}
                                  className="edit blue icon"
                                ></i>
                              </button>
                              <button className="ui  button">
                                <i
                                  id={"view" + data.id}
                                  onClick={(e) => {
                                    showModal(e, data);
                                  }}
                                  className="eye blue icon"
                                ></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6}>
                    <div className="ui divider"></div>
                    <div className="ui icon buttons">
                      {renderPagination(pagination.total, "buyers")}
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Search;
