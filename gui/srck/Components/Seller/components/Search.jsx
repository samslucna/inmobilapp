import React, { Fragment, useContext, useEffect, useState } from "react";
import { ToolsContext } from "../../../context/ToolsContext";
import $ from "jquery";

import ModalUpdateFrm from "../form/ModalUpdateFrm";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import { SellerContext } from "../../../context/SellerContext";

const Search = ({ setSelectedConten }) => {
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
    seller,
    setSeller,
    inptUpd,
    setInptUpd,
    xlsImport,
    setXlsImport,
    removeData,
    sellerChangeInput,
    EditData,validInput

  } = useContext(SellerContext);

  const showModal = async (e, data) => {
    e.preventDefault();

    setSeller([]);
    setSeller(data);

    $("#SellerEdit")
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
      setSeller(data);
      setInptUpd(true);
    } else if (inptUpd === true) {
      setSeller({});
      setInptUpd(false);
    }
  };

  const onChangeImport = (e) => {
    e.preventDefault();

    setXlsImport(e.target.files[0]);
  };

  const btnImport = async (e) => {
    e.preventDefault();

    let url = "/api/sellers/import";
    if (xlsImport !== null) {
      //let urlxls = URL.createObjectURL(xlsImport);
      $("#loader").dimmer("show");
      await setUrImport(url, xlsImport);
      await loadTable("/api/sellers?page=1");
      $("#loader").dimmer("hide");
    }
  };
  const btnExport = async (e, url, typedoc, cod, namedoc) => {
    e.preventDefault();
    $("#loader").dimmer("show");
    await toExport(url, typedoc, cod, namedoc);
    $("#loader").dimmer("hide");
  };

  useEffect(() => {
    setDatasTable([]);
    $(".ui.dropdown.tableseach").dropdown();
    loadTable("/api/sellers?page=1");
  }, []);

    useEffect(()=>{
        validInput()
      },[EditData])
  return (
    <Fragment>
      <div className="row">
        <ModalUpdateFrm seller={seller} />
        <div class="ui page dimmer" id="loader">
          <div class="content">
            <h2 class="ui inverted icon header">
              <div class="ui large text loader">Loading..</div>
            </h2>
          </div>
        </div>
        <h3>Catalogo de propietarios</h3>
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
                        onChange={sellerChangeInput}
                        value={seller.name}
                        type="text"
                        name="name"
                        placeholder="Nombre"
                      />
                    </div>
                  </div>

                  <div class="field">
                    <label>Apellidos:</label>
                    <input
                      onChange={sellerChangeInput}
                      value={seller.lastnames}
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
                        onChange={sellerChangeInput}
                        value={seller.address}
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
                        onChange={sellerChangeInput}
                        value={seller.phone}
                        name="phone"
                        placeholder="Telefono"
                      />
                    </div>

                    <div class="field">
                      <label>INE(DNI):</label>
                      <input
                        type="text"
                        onChange={sellerChangeInput}
                        value={seller.dni}
                        name="dni"
                        placeholder="numero de credencial"
                      />
                    </div>
                    <div class="field">
                      <label>Email:</label>
                      <input
                        name="email"
                        onChange={sellerChangeInput}
                        value={seller.email}
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
                      className="ui teal button"
                    >
                      <i className="save icon"></i>
                      Actualizar
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
                          "/api/sellers/export/xls",
                          "xls",
                          "all",
                          "Todos los Propietarios"
                        );
                      }}
                    >
                      Gral. Propietarios
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
                          "/api/sellers/export/xls",
                          "xls",
                          "all",
                          "Todos los clientes"
                        );
                      }}
                    >
                      Gral. Propietarios
                    </div>
                  </div>
                </div>

                <div className="divider"></div>
                <div className="header">Otro..</div>
              </div>
            </div>
           
            <div className="right menu">
              <div className="ui right aligned category search item">
                <div className="ui transparent icon input">
                  <input
                    className="prompt"
                    type="text"
                    placeholder="Buscar..."
                    onChange={(e) => searchBy(e, "sellers")}
                  />
                  <i className="search link icon"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="ui bottom attached segment">
             <div class="field">
              <input type="file" onChange={onChangeImport} name="file" />

              <button className="ui compact icon button">
                <i
                  id={"uploader"}
                  onClick={(e) => {
                    btnImport(e, "/api/sellers/import");
                  }}
                  className="cloud upload blue icon"
                ></i>
              </button>
            </div>
            <table key={"Seller"} className="ui stackable small table">
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
                      {renderPagination(pagination.total, "sellers")}
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
