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
import FormTicket from "./FormTicket";
import TableTickets from "./TableTickets";

const Show = ({ btnView, list, setList }) => {
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
        return <TableTickets contract={contract} setMn={setMn} />;

      case "nwticket":
        return <FormTicket setMn={setMn} />;

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
                <div className="sixteen wide mobile three wide computer column">
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
                      btnView(e);
                    }}
                  >
                    Regresar
                  </div>
                </div>

                <div className="sixteen wide mobile thirteen wide computer column">
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
