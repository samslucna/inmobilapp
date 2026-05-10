import React, { Fragment, useContext, useEffect } from "react";
import { ToolsContext } from "../../../context/ToolsContext";
import $ from "jquery";

import ModalUpdateFrm from "../form/ModalUpdateFrm";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import { AgentContext } from "../../../context/AgentContext";

const Search = ({setSelectedConten}) => {
  const {
    pagination,   
      datasTable,
      renderPagination,
      searchBy,
      toExport,
      setUrImport,loadTable,setDatasTable
  } = useContext(ToolsContext);

  const {

    agent,
    setAgent,inptUpd, setInptUpd,xlsImport, 
    setXlsImport,removeData,agentChangeInput,EditData,clearForm
  } = useContext(AgentContext);


  const showModal = async (e, data) => {
    e.preventDefault();

    setAgent([]);
    setAgent(data);

    $("#AgentEdit")
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
      setAgent(data);
      setInptUpd(true);
    } else if (inptUpd === true) {
      setAgent({});
      setInptUpd(false);
    }
  };

  const onChangeImport = (e) => {
    e.preventDefault();
    setXlsImport(e.target.files[0]);
  };

  const btnImport = async (e, url) => {
    e.preventDefault();

    if (xlsImport !== null) {
      //let urlxls = URL.createObjectURL(xlsImport);
      $("#loader").dimmer("show");
      await setUrImport(url, xlsImport);

      $("#loader").dimmer("hide");
      await loadTable("/api/agents?page=1");
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
    await loadTable("/api/agents?page=1");
  };
  useEffect(() => {
    rndertable();
  }, []);

  return (
    <Fragment>
      <div className="row">
        <ModalUpdateFrm agent={agent} />
        <div className="ui page dimmer" id="loader">
          <div className="content">
            <h2 className="ui inverted icon header">
              <div className="ui large text loader">Loading..</div>
            </h2>
          </div>
        </div>
        <h3>Agentes/Vendedores</h3>
         <form className="ui celled form" style={{ display: inptUpd !== true ? "none" : "block" }}>
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
                            setInptUpd(false)
                            setSelectedConten('search');
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
                          "/api/agents/export/xls",
                          "xls",
                          "all",
                          "Todos los agentesdeventas"
                        );
                      }}
                    >
                      Gral. Agentes
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
                        btnExport(e, "xls", "all");
                      }}
                    >
                      Gral. Agentes
                    </div>
                  </div>
                </div>

                <div className="divider"></div>
                <div className="header">Otro..</div>
              </div>
            </div>
            <div className="field">
              <input type="file" onChange={onChangeImport} name="file" />

              <button className="ui compact icon button">
                <i
                  id={"uploader"}
                  onClick={(e) => {
                    btnImport(e, "/api/agents/import");
                  }}
                  className="cloud upload blue icon"
                ></i>
              </button>
            </div>
            <div className="right menu">
              <div className="ui right aligned category search item">
                <div className="ui transparent icon input">
                  <input
                    className="prompt"
                    type="text"
                    placeholder="Buscar..."
                    onChange={(e) => searchBy(e, "agents")}
                  />
                  <i className="search link icon"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="ui bottom attached segment">
            <table key={"Agent"} className="ui stackable small table">
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
                            {data.email}
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
                      {renderPagination(pagination.total, "agents")}
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
