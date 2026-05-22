import React, { Fragment, useContext, useEffect } from "react";
import { ToolsContext } from "../../../context/ToolsContext";
import $ from "jquery";
import { PropertyContext } from "../../../context/PropertyContext ";
import ModalUpdateFrm from "../form/ModalUpdateFrm";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";

const Search = () => {
  const {
   
    numberToString,
    pagination, 

    datasTable,setDatasTable,
    renderPagination,
   
    searchBy,
    toExport,
    setUrImport,loadTable
  } = useContext(ToolsContext);

  const {
    property,
    setProperty,
    xlsImport,
    setXlsImport,
    inptUpd,
    setInptUpd,propertyChangeInput,EditData,removeData,clearForm,validInput
   
  } = useContext(PropertyContext);

 

  const showModal = async (e, data) => {
    e.preventDefault();

    setProperty([]);
    setProperty(data);

    $("#propertyEdit")
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
      setProperty(data);
      setInptUpd(true);
    } else if (inptUpd === true) {
   clearForm()
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
      $("#loader").dimmer("hide");
      await loadTable("/api/properties?page=1");
    }
  };
  const btnExport = async (e, url, typedoc, cod, namedoc) => {
    e.preventDefault();
    $("#loader").dimmer("show");
    await toExport(url, typedoc, cod, namedoc);
    $("#loader").dimmer("hide");
  };



  const rndertable = async () => {
      setDatasTable([])
    $(".ui.dropdown.tableseach").dropdown();
    await loadTable("/api/properties?page=1");
  };
  
  useEffect(() => {

    rndertable();
  }, []);

     useEffect(()=>{
        validInput()
      },[EditData])

  return (
    <Fragment>
      <div className="row">
        <ModalUpdateFrm property={property} />
        <div class="ui page dimmer" id="loader">
          <div class="content">
            <h2 class="ui inverted icon header">
              <div class="ui large text loader">Loading..</div>
            </h2>
          </div>
        </div>
        <h3>Catalogo de lotes</h3>
        <form
          class="ui celled form"
          style={{ display: inptUpd !== true ? "none" : "block" }}
        >
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
                <div class="ui small icon input">
                  <input
                    type="text"
                    onChange={propertyChangeInput}
                    value={property.address}
                    name="address"
                    placeholder="Etapa"
                  />
                </div>
              </div>
              <h4 class="ui dividing header">Caracteristicas</h4>
              <div class="field">
                <div class="three fields">
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
                      placeholder=""
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
                        EditData(e);
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
                        //actionBtns(e);
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
                      btnEdit(e);
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

        <div
          id="searchdatas"
          style={{ display: inptUpd !== true ? "block" : "none" }}
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
                          "/api/properties/export/xls",
                          "xls",
                          "all",
                          "Todos los lotes"
                        );
                      }}
                    >
                      Gral. Propiedades
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
                <div className="item">Open...</div>
                <div className="item">Save...</div>
                <div className="item">Edit Permissions</div>
                <div className="divider"></div>
                <div className="header">Export</div>
                <div className="item">Share...</div>
              </div>
            </div>
          
            <div className="right menu">
              <div className="ui right aligned category search item">
                <div className="ui transparent icon input">
                  <input
                    className="prompt"
                    type="text"
                    placeholder="Buscar..."
                    onChange={(e) => searchBy(e, "properties")}
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
                    btnImport(e, "/api/properties/import");
                  }}
                  className="cloud upload blue icon"
                ></i>
              </button>
            </div>
            <table key={"property"} className="ui stackable small table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Manzana</th>
                  <th>$</th>
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
                          <td>{data.description}</td>
                          <td>{data.mz}</td>
                          <td>{numberToString(data.amount)}</td>
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
                      {renderPagination(pagination.total, "properties")}
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
