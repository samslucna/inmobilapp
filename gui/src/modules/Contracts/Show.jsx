import React, { Fragment, useContext } from "react";
import changeFormat from "../../helper/changeFormat";
import ContractStore from "../../store/ContractStore";
import Form from "../Tickets/Form";
import ModalDoc from "./ModalDoc";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSaveSub from "../../hooks/useSaveSub";
import TicketStore from "../../store/TicketStore";
import ticketValidate from "../../validator/ticketValidate";
import Swal from "sweetalert2";

const Show = ({ btnView,list }) => {
  const { contract, loadContracts } = ContractStore;
  const { state, errors, setState, handleChange, handleSubmit, handleBlur } =
    useSaveSub(TicketStore.ticket, ticketValidate, TicketStore.addTicket);
  const navigate = useNavigate();
  const [mn, setMn] = useState("");

  const saveTicket = async (e) => {
    try {
      const resp = await Swal.fire({
        title: "Desea guardar los cambios?",
        text: "Esta acción registra un pago.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "rgb(176, 221, 51)",
        cancelButtonColor: "#3085d6",
      });

      if (resp.isConfirmed) {
        setState({ ...state, contract_id: contract.id });
        await handleSubmit(e);
        await loadContracts();
        Swal.fire({
          title: "Registrado",
          text: "La informacion se guardo correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al guardar los cambios",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "error al guardar el recibo",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const goEdit = async (ticket) => {
    TicketStore.setEditing(true);
    TicketStore.setEditId(ticket.id);
    setState(ticket);
    setMn("nwticket");
  };

  const btnMn = (e) => {
    e.preventDefault();
    setMn(e.target.id);
  };
  const handlerPage = () => {
    switch (mn) {
      case "tickets":
        return (
          <div>
            <div className="ui buttons">
              <ModalDoc
                data={ContractStore.contract}
                url={"/api/contracts/export/pdf/contractExportPDF?id="}
                color={"secondary"}
                title={"Contrato promesa"}
              />
              <ModalDoc
                data={ContractStore.contract}
                url={"/api/contracts/export/pdf/contractExportPDF?id="}
                color={"primary"}
                title={"Contrato Final"}
              />
            </div>
            <table className="ui stackable small table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Fecha</th>

                  <th>Concepto</th>
                  <th>Pago</th>
                  <th>Monto($)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list !== [] && list !== undefined
                  ? list.map((data) => {
                      return (
                        <tr key={"r" + data.id}>
                          <td>{data.id}</td>
                          <td>{data.date}</td>

                          <td> {data.concept}</td>
                          <td>{data.paytype}</td>
                          <td>{changeFormat.numberToString(data.amount)}</td>
                          <td>
                            <div
                              key={"edit" + data.id}
                              className="ui mini basic icon buttons"
                            >
                              <button id="delete" className="ui  button">
                                <i
                                  id={"del" + data.id}
                                  onClick={(e) => {
                                    //removeTicket(e, data.id);
                                    //btnView(e);
                                  }}
                                  className="trash red icon"
                                ></i>
                              </button>
                              <button className="ui  button">
                                <i
                                  id={"del" + data.id}
                                  onClick={() => {
                                    console.log(data);
                                    goEdit(data);
                                  }}
                                  id={"edit" + data.id}
                                  className="edit blue icon"
                                ></i>
                              </button>
                              <button className="ui  button">
                                <i
                                  onClick={() => {
                                    goEdit(data);
                                  }}
                                  id={"view" + data.id}
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
        );

      case "contract":
        return (
          <embed
            type="application/pdf"
            //src={urlPdf}
            width={"100%"}
            height={"500px"}
            title="Fall Nature Hikes"
          />
        );

      case "nwticket":
        return (
          <form action="" className="ui form">
            <div className="right four wide field">
              <div className="field">
                <h4 className="ui dividing header">Nuevo recibo:</h4>
                <label>Fecha:</label>
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={state.date}
                  type="date"
                  name="date"
                  placeholder="0.00"
                />
              </div>
              <div className="field">
                <label>Concepto:</label>
                <input
                  className="ui fluid dropdown"
                  onChange={handleChange}
                  value={state.concept}
                  name="concept"
                />
              </div>
              <div className="field">
                <label>Forma de pago:</label>

                <select
                  class="ui dropdown"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={state.paytype}
                  name="paytype"
                >
                  <option value="">Opciones</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>
              <div className="field">
                <label>Por la cantidad ($):</label>
                <div className="fields">
                  <div className="sixteen wide field">
                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={state.amount}
                      type="text"
                      name="amount"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <label>Referencia:</label>
                <div className="sixteen wide field">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={state.ref}
                    type="text"
                    name="ref"
                    placeholder="Referencia de pago"
                  />
                </div>

                <div
                  className="ui green button"
                  onClick={(e) => {
                    //addTicket(e);
                  }}
                >
                  Guardar recibo
                </div>
                <div
                  className="ui black button"
                  id={"contractid"}
                  onClick={(e) => {
                    setMn("tickets");
                  }}
                >
                  Cancelar
                </div>
              </div>
            </div>
          </form>
        );

      default:
        setMn("tickets");
        return;
    }
  };

  return (
    <Fragment>
      <div className="image content">
        <div className="ui fluid card">
          <div className="content">
            <div className="ui internally celled grid">
              <div className="row">
                <div className="sixteen wide computer column">
                  <div className="ui mini statistics">
                    <div className="statistic">
                      <div className="value"> {ContractStore.contract?.id}</div>
                      <div className="label">Contrato:</div>
                    </div>
                    <div className="statistic">
                      <div className="value">
                        {" "}
                        {ContractStore.contract?.buyer?.name +
                          " " +
                          ContractStore.contract?.buyer?.lastnames}
                      </div>
                      <div className="label">Cliente</div>
                    </div>
                    <div className="statistic">
                      <div className="value">
                        {ContractStore.contract?.property?.name}
                      </div>
                      <div className="label">Lote</div>
                    </div>
                    <div className="statistic">
                      <div className="value">
                        {changeFormat.numberToString(
                          ContractStore.contract?.property?.amount_init,
                        )}
                      </div>
                      <div className="label">Costo Lote($)</div>
                    </div>

                    <div className="statistic">
                      <div className="value">
                        {changeFormat.numberToString(
                          ContractStore.contract?.advance,
                        )}
                      </div>
                      <div className="label">Anticipo ($)</div>
                    </div>
                    <div className="statistic">
                      <div className="value">
                        {changeFormat.numberToString(
                          ContractStore.contract?.pagado,
                        )}
                      </div>
                      <div className="label">Pagado ($)</div>
                    </div>
                    <div className="statistic">
                      <div className="value">
                        {changeFormat.numberToString(
                          ContractStore.contract?.saldo,
                        )}
                      </div>
                      <div className="label">Saldo ($)</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="five wide mobile three wide computer column">
                  <div
                    className="ui green attached button"
                    id="nwticket"
                    onClick={(e) => {
                      setState({
                        id: null,
                        concept: "Mensualidad",
                        contract_id: null,
                        paytype: "Efectivo",
                        ref: "",
                        date: "",
                        amount: "$ 0.00",
                      });
                      btnMn(e);
                    }}
                  >
                    +Recibo
                  </div>

                  <div
                    className="ui primary attached button"
                    id="tickets"
                    onClick={(e) => {
                      btnMn(e);
                    }}
                  >
                    Recibos
                  </div>
                  <div
                    className="ui black attached button"
                    id="exit"
                    
                    onClick={(e) => {
                      btnView(e)
                    }}
                  >
                    Regresar
                  </div>
                </div>

                <div className="eleven wide mobile thirteen wide computer column">
                  {handlerPage()}
                </div>
              </div>
            </div>

            <div className="description"></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Show;
