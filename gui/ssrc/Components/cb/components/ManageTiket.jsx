import React, { Fragment, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/dist/sweetalert2.css";
import { ToolsContext } from "../../../context/ToolsContext";

const ManageTiket = ({ setSelectedConten }) => {
  const { saveDatas, inputNumber, toInt } = useContext(ToolsContext);

  const [client, setClient] = useState([]);
  
  const [property, setProperty] = useState([]);
  const [seller, setSeller] = useState([]);
  const [buyer, setBuyer] = useState([]);
  const [inptUpd, setInptUpd] = useState({ id: "", upd: false });

  const clientChangeInput = (e, result) => {
    e.preventDefault();

    const { name, value } = e.target || result;

    if (name === "amount") {
      setClient({
        ...client,
        [name]: inputNumber(e),
      });
    } else {
      setClient({
        ...client,
        [name]: value,
      });
    }
  };

  const featChangeInpt = (e, result) => {
    e.preventDefault();

    const { name, value } = e.target || result;

    setProperty({
      ...property,
      [name]: value,
    });
  };

  const sellerChangeInpt = (e, result) => {
    e.preventDefault();

    const { name, value } = e.target || result;
    console.log(name);
    setSeller({
      ...seller,
      [name]: value,
    });
  };

  const clearForm = () => {
    setProperty({
      szm2: "",
      roms: "",
      terrain: "",
      ws: "",
      services: "",
      type: "",
    });
    setSeller({ street: "", num: "", suburb: "", cp: "", city: "" });
    setClient({
      name: "",
      description: "",
      feature: "",
      amount: "",
      seller: "",
      status: "",
      buyerid: "",
    });
  };

  const addData = async () => {
    // let mount = toInt(client.amount)

    // console.log(mount)
    //   let dataInsert = {
    //       name: client.name,
    //       description: client.description,
    //       feature: JSON.stringify(property),
    //       amount: mount,
    //       seller: JSON.stringify(seller),
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

  useEffect(() => {
    console.log("hi");
  }, []);

  return (
    <Fragment>
      <div className="ui grid container">
        <div className="row">
          <div className="sixteen wide column">
            <h3 class="ui dividing header">Agregar Inmueble</h3>
          </div>
        </div>

        <div className="row">
          <div className="sixteen wide column">
            <form class="ui celled form">
              <div class="two fields">
                <div className="field">
                  <div class="field">
                    <label>Cliente:</label>
                    <input
                      onChange={clientChangeInput}
                      value={client.name}
                      type="text"
                      name="name"
                      placeholder="Nombre"
                    />
                  </div>

                  <div class="field">
                    <label>Descripción:</label>
                    <textarea
                      onChange={clientChangeInput}
                      value={client.description}
                      type="text"
                      name="description"
                      rows="3"
                      placeholder="sugerido para ....."
                    />
                  </div>
                </div>

                <div className="field">
                  <h4 class="ui dividing header">Caracteristicas</h4>
                  <div class="field">
                    <div class="three fields">
                      <div class="field">
                        <label>Tipo:</label>
                        <select
                          name="type"
                          onChange={featChangeInpt}
                          value={property.type}
                          class="ui fluid dropdown"
                        >
                          <option value="">------</option>
                          <option value="1">Terreno</option>
                          <option value="2">Lote</option>
                          <option value="3">Casa Habitación</option>
                          <option value="4">Departamente</option>
                          <option value="5">Otro</option>
                        </select>
                      </div>
                      <div class="field">
                        <label>Superficie #M2:</label>
                        <input
                          type="text"
                          onChange={featChangeInpt}
                          value={property.szm2}
                          name="szm2"
                          placeholder="M2"
                        />
                      </div>
                      <div class="field">
                        <label>Habitaciones:</label>
                        <input
                          onChange={featChangeInpt}
                          value={property.roms}
                          type="text"
                          name="roms"
                          placeholder="Habitaciones"
                        />
                      </div>
                    </div>
                    <div class="three fields">
                      <div class="field">
                        <label>Terreno:</label>
                        <input
                          onChange={featChangeInpt}
                          value={property.terrain}
                          type="text"
                          name="terrain"
                          placeholder="M2"
                        />
                      </div>
                      <div class="field">
                        <label>Baños:</label>
                        <input
                          type="text"
                          onChange={featChangeInpt}
                          value={property.ws}
                          name="ws"
                          placeholder="Baños"
                        />
                      </div>
                      <div class="field">
                        <label>Servicios:</label>
                        <input
                          type="text"
                          name="services"
                          onChange={featChangeInpt}
                          value={property.services}
                          placeholder="servicios"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="two fields">
                <div class="field">
                  <h4 class="ui dividing header">Direccón</h4>
                  <div class="three fields">
                    <div class="field">
                      <label>Calle:</label>
                      <input
                        type="text"
                        onChange={sellerChangeInpt}
                        value={seller.street}
                        name="street"
                        placeholder="Calles"
                      />
                    </div>
                    <div class="field">
                      <label>#:</label>
                      <input
                        type="text"
                        name="num"
                        placeholder="Numero"
                        onChange={sellerChangeInpt}
                        value={seller.num}
                      />
                    </div>
                    <div class="field">
                      <label>Colonia:</label>
                      <input
                        type="text"
                        name="suburb"
                        placeholder="colonia"
                        onChange={sellerChangeInpt}
                        value={seller.suburb}
                      />
                    </div>
                  </div>
                  <div class="three fields">
                    <div class="field">
                      <label>C.P.:</label>
                      <input
                        type="text"
                        onChange={sellerChangeInpt}
                        value={seller.cp}
                        name="cp"
                        placeholder="Codigo Postal"
                      />
                    </div>
                    <div class="field">
                      <label>Ciudad.:</label>
                      <input
                        onChange={sellerChangeInpt}
                        value={seller.city}
                        type="text"
                        name="city"
                        placeholder="Ciudad"
                      />
                    </div>
                  </div>
                </div>

                <div className="field">
                  <br />
                  <br />
                  <label>Precio de compra($):</label>
                  <input
                    onChange={clientChangeInput}
                    value={client.amount}
                    type="text"
                    name="amount"
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

export default ManageTiket;
