import React, { Fragment, useState, useContext, useEffect } from "react";
import { TicketContext } from "../../../context/TicketContext";
import $ from "jquery";

import { ToolsContext } from "../../../context/ToolsContext";
//import "sweetalert2/dist/sweetalert2.css";

const Main = () => {
  const {
    searchInput,
    setSearchInput,
    contract,
    setContract,
    seachQueryData,
    queryTable,
    setQueryTable,
    addData,
    inputNumber,
    setTicket,
    ticket,
    getTotal,
    offTotal,
  } = useContext(TicketContext);
  const {
    numberToString,
    loadTable,
    renderDate,

    toExport,
  } = useContext(ToolsContext);
  const [searchEdit, setSearchEdit] = useState(null);
  const [tktdDatas, setTktDatas] = useState([]);

  const ticketChangeInput = (e, result) => {
    e.preventDefault();

    const { name, value } = e.target || result;
    if (name === "amount" || name === "partamount") {
      setTicket({
        ...ticket,
        [name]: inputNumber(e),
      });
    } else {
      setTicket({
        ...ticket,
        [name]: value,
      });
    }
  };

  const showModal = (e, data) => {
    e.preventDefault();
    console.log(contract);

    if (contract.buyer !== undefined) {
      data.buyer = contract.buyer.name + " " + contract.buyer.lastnames;
      data.property = contract.property.name;
      setTicket([]);
      setTicket(data);

      $("#ticketEdit")
        .modal({
          allowMultiple: false,
          onDeny: function () {
            console.log("salir");
          },
        })
        .modal("show");
    }
  };

  const searchBy = async (e, result) => {
    e.preventDefault();
    const { name, value } = e.target || result;

    setSearchEdit(name);
    if (value !== "" && value !== undefined) {
      switch (name) {
        case "srchcontract":
          seachQueryData("contracts", value);
          break;

        case "srchticket":
          if (contract.tickets !== undefined)
            if (value !== "") {
              const { value } = result || e.target;
              let expresion = new RegExp(`${value}.*`, "i");

              let seachRender = contract.tickets.filter((element) =>
                expresion.test(element.id),
              );

              if (value !== "") {
                setTktDatas(seachRender);
              } else {
                setTktDatas(contract.tickets);
              }
            } else {
              console.log("saludos");
            }
          break;
        default:
          break;
      }
    }
  };

  const search = (e, result) => {
    e.preventDefault();
    const { value } = result || e.target;
    let expresion = new RegExp(`${value}.*`, "i");

    let seachRender = contract.tickets.filter((element) =>
      expresion.test(element.id),
    );

    if (value !== "") {
      setTktDatas(seachRender);
    } else {
      setTktDatas(contract.tickets);
    }
  };

  const setData = (e, data) => {
    e.preventDefault();
    const { id } = e.target;
    let named = id.replace(data.id, "");

    let total = getTotal(data.tickets);
    data.totalpay = parseFloat(total);

    let dataaux = offTotal(data.amount, data.totalpay);

    data.partial = dataaux;

    switch (named) {
      case "cr":
        setContract(data);
        setQueryTable([]);
        setSearchInput({ ...searchInput, contract: "hidden" });
        break;
      default:
        break;
    }
  };
  const exporAcountClient = async (e) => {
    e.preventDefault();

    if (contract.buyer !== undefined) {
      $("#loader").dimmer("show");
      await toExport(
        "/api/tickets/export/xls/acountclient",
        "xls",
        "acountclient",
        "EstadoCuentaContrato" + contract.id,
        contract,
      );
      $("#loader").dimmer("hide");
    }
  };

  const editDataInput = (e) => {
    e.preventDefault();
    const { id } = e.target;

    if (id != "") {
      const idname = e.target.id.substr(0, 10);

      switch (idname) {
        case "contractid":
          setContract({
            id: null,
            buyer_id: "",
            seller_id: "",
            agent_id: "",
            property_id: "",
            plazo: "",
            amount: "",
            datecontract: Date.now(),
            partamount: 0.0,
          });
          setSearchInput({ ...searchInput, contract: "text" });
          break;

        default:
          break;
      }
    }
  };

  useEffect(() => {
    loadTable("/api/tickets?page=1");
  }, []);

  useEffect(() => {
    switch (searchEdit) {
      case "srchcontract":
        if (queryTable !== [] && queryTable !== undefined) {
          $(".ui.dropdown.srchticket").dropdown("show");
        } else {
          $(".ui.dropdown.srchcontract").dropdown("hiden");
        }
        break;

      default:
        break;
    }
  }, [queryTable]);

  return (
    <Fragment>
      <div className="row">
        <h3>Generar recibo</h3>
        <div class="ui page dimmer" id="loader">
          <div class="content">
            <h2 class="ui inverted icon header">
              <div class="ui large text loader">Loading..</div>
            </h2>
          </div>
        </div>
        <div class="ui centered grid">
          <div class=" row">
            <div class="column">
              <div class="ui category search">
                <div class="ui icon input">
                  <input
                    class="prompt"
                    name={"srchcontract"}
                    type={searchInput.contract}
                    placeholder="Numero de contrato..."
                    onChange={searchBy}
                  />
                  <i class="search icon"></i>
                </div>
              </div>
              <div class="ui right dropdown  srchticket item">
                <div class="menu ">
                  {queryTable !== []
                    ? queryTable.map((data) => {
                        return (
                          <div
                            key={"cr" + data.id}
                            id={"cr" + data.id}
                            class="item"
                            onClick={(e) => {
                              setData(e, data);
                            }}
                          >
                            {data.id +
                              " - " +
                              data.buyer.name +
                              "  " +
                              " " +
                              data.buyer.lastnames}
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          </div>

          <div class=" row">
            <div class="sixteen wide column">
              <div class="ui centered fluid card">
                <div class="content">
                  <form class="ui form">
                    <h3 class="ui dividing header">Capturar Recibo</h3>
                    <div class="field">
                      <div class="two fields">
                        <div class="field">
                          <div class="two fields">
                            <div className="field">
                              <h4 class="ui dividing header">
                                Datos del cliente:
                              </h4>
                              {contract.buyer != undefined ? (
                                <div>
                                  <label>#:</label> <p>{contract.buyer.id}</p>
                                  <label>Nombre: </label>
                                  <p>
                                    {contract.buyer.name +
                                      " " +
                                      contract.buyer.lastnames}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                            <div className="field">
                              <h4 class="ui dividing header">
                                Datos del Lote:
                              </h4>
                              {contract.buyer != undefined ? (
                                <div>
                                  <label># Lote:</label>
                                  <p>{contract.property.id}</p>
                                  <label>Nombre:</label>
                                  <p>{contract.property.name}</p>
                                  <label>Manzana:</label>
                                  <p>{contract.property.mz}</p>
                                </div>
                              ) : null}
                            </div>
                            <div className="field">
                              <h4 class="ui dividing header">
                                Resumen de Cuenta:
                              </h4>
                              {contract.buyer != undefined ? (
                                <div>
                                  <div class="two fields">
                                    <div className="field">
                                      <label>Costo: </label>
                                      <p>{numberToString(contract.amount)}</p>
                                      <label>Enganche: </label>
                                      <p>
                                        {numberToString(contract.partamount)}
                                      </p>
                                      <label>Status: </label>
                                      <p>
                                        {contract.partial === 0
                                          ? "Finiquitado"
                                          : "Pagando."}
                                      </p>
                                    </div>
                                    <div className="field">
                                      <label>Plazo: </label>
                                      <p>{contract.plazo}</p>
                                      <label>Abonado: </label>
                                      <p>{numberToString(contract.totalpay)}</p>
                                      <label>Saldo: </label>
                                      <p>{numberToString(contract.partial)}</p>
                                    </div>
                                  </div>
                                  <div className="field">
                                    <div className="left menu">
                                      <div className="ui  aligned category search item">
                                        <button
                                          className="ui green button"
                                          type="text"
                                          name="srchticket"
                                          placeholder="Buscar..."
                                          onClick={(e) => {
                                            exporAcountClient(e);
                                          }}
                                        >
                                          Excel
                                        </button>
                                        <div
                                          class="ui black button"
                                          id={"contractid"}
                                          onClick={(e) => {
                                            editDataInput(e);
                                          }}
                                        >
                                          Cancelar
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="two wide field"></div>
                        <div class="field">
                          <h4 class="ui dividing header">Recibos:</h4>
                          <div className="field">
                            <div className="left menu">
                              <div className="ui  aligned category search item">
                                <div className="ui prompt icon input">
                                  <input
                                    className="prompt"
                                    type="text"
                                    name="srchticket"
                                    placeholder="Buscar..."
                                    onChange={search}
                                  />
                                  <i className="search link icon"></i>
                                </div>
                              </div>
                            </div>
                          </div>

                          <table class="ui stackable small table">
                            <thead>
                              <tr>
                                <th>N°</th>
                                <th>Fecha</th>

                                <th>Concepto</th>
                                <th>Pago</th>
                                <th>Monto($)</th>
                                <th>Accion</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tktdDatas !== [] && tktdDatas !== undefined
                                ? tktdDatas.map((data) => {
                                    return (
                                      <tr key={"r" + data.id}>
                                        <td>{data.id}</td>
                                        <td>{data.datepay}</td>

                                        <td> {data.concept}</td>
                                        <td>
                                          {data.paytype_id === 1 ? (
                                            <p>Efectivo</p>
                                          ) : data.paytype_id === 2 ? (
                                            <p>Deposito</p>
                                          ) : data.paytype_id === 3 ? (
                                            <p>Transferencia</p>
                                          ) : null}
                                        </td>
                                        <td>{numberToString(data.amount)}</td>

                                        <td>
                                          <div
                                            key={"edit" + data.id}
                                            className="ui mini basic icon buttons"
                                          >
                                            <button className="ui  button">
                                              <i
                                                id={"edit" + data.id}
                                                onClick={(e) => {
                                                  //btnEdit(e, data);
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
                          </table>
                        </div>
                      </div>
                    </div>
                  </form>
                  {/*Aqui ver ticket */}
                </div>

                <div class="extra content">
                  <span class="right floated">Joined in 2013</span>
                  <span>
                    <i class="user icon"></i>
                    75 Friends
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Main;
