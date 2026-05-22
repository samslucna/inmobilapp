import React, { Fragment, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import $ from "jquery";
import "sweetalert2/dist/sweetalert2.css";
import { ToolsContext } from "../../../context/ToolsContext";

import FrmModalOne from "./Forms/FrmModalOne";

const ManageContract = ({ setSelectedConten }) => {
  const {
    inputNumber,
    queryTable,
    setQueryTable,
    getDataModal,
    searchDatas,
    numberToString,
  } = useContext(ToolsContext);

  const [contract, setContract] = useState([]);

  const [titlesearch, setTitleSearch] = useState("");
  const [inptUpd, setInptUpd] = useState({ id: "", upd: false });

  const contractChangeInput = (e, result) => {
    e.preventDefault();

    const { name, value } = e.target || result;

    console.log(contract)
    if (name === "amount" || name === "partamount") {
      setContract({
        ...contract,
        [name]: inputNumber(e),
      });
    } else {
      setContract({
        ...contract,
        [name]: value,
      });
    }
  };

  const clearForm = () => {
    setContract({
      id: "",
      idbuyer: "",
      idseller: "",
      idagent: "",
      idproperty: "",
      amount: "",
      partamount: "",
      datecontract: "",
    });
  };

  const addData = async () => {
    // let mount = toInt(property.amount)

    // console.log(mount)
    //   let dataInsert = {
    //       name: property.name,
    //       description: property.description,
    //       feature: JSON.stringify(features),
    //       amount: mount,
    //       ubication: JSON.stringify(ubication),
    //       status: 1,
    //       buyerid: 1
    //     };

    //     await saveDatas("properties", dataInsert);

    Swal.fire({
      title: "Desea guardar los Cambios?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#d33",
      confirmButtonText: "Guardar",
      denyButtonText: `Cancelar`,
      showCancelButton: false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        clearForm();
        Swal.fire("Guardado!", "", "success");
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

        break;

      case "cln":
        console.log("procedimiento para limpiar");
        setSelectedConten("main");
        break;

      default:
        break;
    }
  };

  const searchBy = async (e) => {
    e.preventDefault();
    const { value } = e.target;
    console.log(value);

    if (value !== "") {
      let seachRender = await searchDatas(
        "/api/properties/search?name=",
        value
      );

      console.log(seachRender);
      setQueryTable(seachRender);
    }
  };

  const renderFormData = () => {
    switch (titlesearch) {
      case "srchproperty":
        return <FrmModalOne titlesearch={titlesearch} table={"properties"} />;

      default:
        return null;
    }
  };

  const showData = (e) => {
    e.preventDefault();
    const { id } = e.target;
    if (id != null || id != undefined) {
      setTitleSearch(id);

      switch (id) {
        case "srchproperty":
          break;

        default:
          break;
      }
    }
  };

  useEffect(() => {
    $(".ui.dropdown").dropdown();

    console.log("ManageContract");
  }, []);

  return (
    <Fragment>
      <div className="ui grid container">
        <div className="row">
          <div className="sixteen wide column">
            <h3 class="ui dividing header">Alta de Contrato</h3>
          </div>
        </div>

        <div className="row">
          <div className="sixteen wide column">
            <h4 class="ui dividing header">Datos del Cliente:</h4>
            <form class="ui celled form">
              <div class="two fields">
                <div className="field">
                  <div class="field">
                    <label>Cliente:</label>
                    <div class="ui right action input">
                      <input
                        onChange={contractChangeInput}
                        value={contract.idbuyer}
                        type="text"
                        name="idbuyer"
                        placeholder="Buscar Cliente"
                      />
                      <button
                        onClick={(e) => {
                          showData(e);
                        }}
                        id="srchbuyer"
                        class="ui teal labeled icon button"
                      >
                        <i class="user icon"></i>
                        Buscar
                      </button>
                    </div>
                  </div>
                  <label>Vendedor:</label>
                  <div class="ui right action input">
                    <input
                      onChange={contractChangeInput}
                      value={contract.idseller}
                      type="text"
                      name="idseller"
                      placeholder="nombre vendedor o dueño de inmueble ....."
                    />
                    <button
                      onClick={(e) => {
                        //showData(e);
                      }}
                      id="srchseller"
                      class="ui teal labeled icon button"
                    >
                      <i class="address book icon"></i>
                      Buscar
                    </button>
                  </div>
                  <div class="field">
                    <label>Agente de Ventas:</label>
                    <div class="ui right action input">
                      <input
                        onChange={contractChangeInput}
                        value={contract.idagent}
                        type="text"
                        name="idagent"
                        placeholder="nombre Agente ....."
                      />
                      <button
                        onClick={(e) => {
                          //showData(e);
                        }}
                        id="srchagent"
                        class="ui teal labeled icon button"
                      >
                        <i class="users icon"></i>
                        Buscar
                      </button>
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
                

                <div className="field">
                  <label>Propiedad/Inmueble/Lote:</label>
                  <div class="field">
                      <div class="ui fluid multiple search selection dropdown">
                      <input
                      onChange={contractChangeInput}
                      value={contract.idproperty}
                      type="text"
                      name="idproperty"
                      placeholder="inmueble ....."
                    />
                        <i class="dropdown icon"></i>
                        <div class="default text">Saved Contacts</div>
                        <div class="menu">
                          <div
                            class="item"
                            data-value="jenny"
                            data-text="Jenny"
                          >
                            <img
                              class="ui mini avatar image"
                              src="/images/avatar/small/jenny.jpg"
                            />
                            Jenny Hess
                          </div>
                          <div
                            class="item"
                            data-value="alex"
                            data-text="alex data"
                          >
                            <img
                              class="ui mini avatar image"
                              src="/images/avatar/small/jenny.jpg"
                            />
                            alex Hess
                          </div>
                        </div>
                      </div>
                    </div>
                  <br />
                  <br />
                  <label>Precio venta($):</label>
                  <input
                    onChange={contractChangeInput}
                    value={contract.amount}
                    type="text"
                    name="amount"
                    placeholder="0.00"
                  />
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
                    {inptUpd.upd !== false ? (
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
            </form>
          </div>

          <div className="eight wide column"></div>
        </div>
      </div>
    </Fragment>
  );
};

export default ManageContract;
