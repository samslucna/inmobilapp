import React, { Fragment, useContext, useEffect, useState } from "react";
import { ToolsContext } from "../../../context/ToolsContext";


import Show from "./Show";

import { ContractContext } from "../../../context/ContractContext";


const Search = () => {
  const {
    pagination,
    datasTable,
    renderPagination,
    searchBy,
    numberToString,
    renderDate,
  } = useContext(ToolsContext);



  const {
    contract,
    inptUpd,
    rndertable,
    removeData,btnExport,onChangeImport,btnImport,btnEdit,btnView
  } = useContext(ContractContext);


  useEffect(() => {
    rndertable();
  }, []);

  return (
    <Fragment>
      <div className="row">
        <div class="ui page dimmer" id="loader">
          <div class="content">
            <h2 class="ui inverted icon header">
              <div class="ui large text loader">Loading..</div>
            </h2>
          </div>
        </div>
        <h3>Contratos</h3>
        <div style={{ display: inptUpd !== true ? "none" : "block" }}>
          {contract !== undefined && contract.buyer !== undefined ? (
            <Show
           
             
            />
          ) : null}
        </div>

        <div
          id="searchdatas"
          style={{ display: inptUpd != true ? "block" : "none" }}
        >
          <div className="ui top attached menu">
            <div className="ui dropdown tableseach icon item">
              <i className="wrench icon"> Reportes</i>
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
                          "/api/contracts/export/xls",
                          "xls",
                          "all",
                          "Todos los Contratos"
                        );
                      }}
                    >
                      Gral. Contratos
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
                      Gral. Contratos
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
                    onChange={(e) => searchBy(e, "contracts")}
                  />
                  <i className="search link icon"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <input type="file" onChange={onChangeImport} name="file" />

            <button className="ui compact icon button">
              <i
                id={"uploader"}
                onClick={(e) => {
                  btnImport(e, "/api/contracts/import");
                }}
                className="cloud upload blue icon"
              ></i>
            </button>
          </div>

          <div className="ui bottom attached segment">
            <table className="ui stackable small table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Fecha</th>
                  <th>Comprador/Cliente</th>
                  <th>Lote</th>

                  <th>Costo($)</th>
                  <th>Saldo($)</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {datasTable !== [] && datasTable !== undefined
                  ? datasTable.map((data) => {
                      if (data.buyer !== undefined) {
                        return (
                          <tr key={"r" + data.id}>
                            <td>{data.id}</td>

                            <td>{renderDate(data.datecontract)}</td>
                            <td>
                              {data.buyer.name + " " + data.buyer.lastnames}
                            </td>
                            <td>{data.property.name}</td>

                            <td>{numberToString(data.amount)}</td>
                            <td>{numberToString(data.partamount)}</td>
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
                                      btnView(e, data);
                                    }}
                                    className="eye blue icon"
                                  ></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    })
                  : null}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6}>
                    <div className="ui divider"></div>
                    <div className="ui icon buttons">
                      {renderPagination(pagination.total, "contracts")}
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        {}
      </div>
    </Fragment>
  );
};

export default Search;
