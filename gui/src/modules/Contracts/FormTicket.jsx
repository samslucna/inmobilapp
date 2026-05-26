import {
  Button,
  Card,
  Box,
  TextField,
  DialogActions,
  Alert,
  Typography,
  MenuItem,
  Grid,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import useSaveSub from "../../hooks/useSaveSub";

import ContractStore from "../../store/ContractStore";
import AgentStore from "../../store/AgentStore";
import { useEffect, useState } from "react";
import TicketStore from "../../store/TicketStore";
import ticketValidate from "../../validator/ticketValidate";
import changeFormat from "../../helper/changeFormat";
import Swal from "sweetalert2";

export default function FormTicket({ setMn }) {
  const { contract, loadContracts } = ContractStore;
  const { state, errors, setState, handleChange, handleSubmit, handleBlur } =
    useSaveSub(TicketStore.ticket, ticketValidate, TicketStore.addTicket);

  const saveTicket = async (e) => {
    try {
      const resp = await Swal.fire({
        title: "Desea guardar los cambios?",
        text: "Esta acción registra un pago.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "rgb(51, 111, 221)",
        cancelButtonColor: "#d63b30",
      });

      if (resp.isConfirmed) {
        setState({ ...state, contract_id: contract.id });

        await handleSubmit(e);
        const getContractUpdate = await ContractStore.showContract(
          "contracts",
          contract.id,
        );
        ContractStore.setContract(getContractUpdate.contract);
        TicketStore.setEditing(false);
        await loadContracts();
        setState({
          id: null,
          concept: "Mensualidad",
          contract_id: null,
          paytype: "Efectivo",
          ref: "",
          date: "",
          amount: "$ 0.00",
        });
        setMn("tickets");
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

  useEffect(() => {
    const load = async () => {
      if (!TicketStore.editing) {
        setState({
          id: null,
          concept: "Mensualidad",
          contract_id: null,
          paytype: "Efectivo",
          ref: "",
          date: "",
          amount: "$ 0.00",
        });
        console.log("clean");
        TicketStore.setTicket({
          id: null,
          concept: "Mensualidad",
          contract_id: null,
          paytype: "Efectivo",
          ref: "",
          date: "",
          amount: "$ 0.00",
        });
      }
    };
    load();
  }, [TicketStore.editing]);

  return (
    <>
      <form className="ui form">
        <div className="right sixteen wide mobile five wide computer field">
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
            {errors.date && (
            <span class="ui pointing red basic label">{errors.date}</span>
          )}
          <div className="field">
            <label>Concepto:</label>
            <input
              className="ui fluid dropdown"
              onChange={handleChange}
              value={state.concept}
              name="concept"
            />
          </div>
          {errors.name && (
            <span class="ui pointing red basic label">{errors.name}</span>
          )}
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
          {errors.paytype && (
            <span class="ui pointing red basic label">{errors.paytype}</span>
          )}
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
            {errors.amount && (
              <span class="ui pointing red basic label">{errors.amount}</span>
            )}
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
                saveTicket(e);
              }}
            >
              Guardar recibo
            </div>
            <div
              className="ui black button"
              id={"cancel"}
              onClick={(e) => {
                TicketStore.setEditing(false);
                setMn("tickets");
              }}
            >
              Cancelar
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
