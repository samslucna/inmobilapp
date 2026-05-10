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
import PropertaryStore from "../../store/PropertaryStore";
import BoundaryStore from "../../store/BoundaryStore";
import useSaveSub from "../../hooks/useSaveSub";
import ClientStore from "../../store/ClientStore";
import ContractStore from "../../store/ContractStore";
import AgentStore from "../../store/AgentStore";
import { useEffect, useState } from "react";
import PropertyStore from "../../store/PropertyStore";
import TicketStore from "../../store/TicketStore";
import ticketValidate from "../../validator/ticketValidate";
import changeFormat from "../../helper/changeFormat";
import Swal from "sweetalert2";

export default function Form() {
  const {
    seachQueryData,
    setSearchEdit,
    contract,
    loadContracts,
    showContract,
    setContract,
  } = ContractStore;
  const { client, setClient } = ClientStore;
  const { agent, setAgent } = AgentStore;
  const [datas, setDatas] = useState([]);
  const [datasContract, setDatasContract] = useState([]);
  const { state, errors, setState, handleChange, handleSubmit, handleBlur } =
    useSaveSub(TicketStore.ticket, ticketValidate, TicketStore.addTicket);

  const { id, contract_id, date, concept, amount, paytype, ref } = state;

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
      } else {
        Swal.fire({
          title: "Registrado",
          text: "El Lote se registro correctamente",
          icon: "success",
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

  const searchBy = async (e, result) => {
    e.preventDefault();
    try {
      const { name, value } = e.target || result;
      setSearchEdit(name);

      if (value !== "" && value !== undefined) {
        switch (name) {
          case "srchcontract":
            setDatasContract([]);
            let contracts = await seachQueryData("contracts", value);
            setDatasContract(contracts);

          default:
            setDatas([]);
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const setContractData = async () => {
      const getContract = await showContract("contracts", contract.id);
      setContract(getContract.contract);
    };
    setContractData();
  }, [handleSubmit]);

  return (
    <>
      <Box>
        <Grid container>
          <Grid sx={{ marginLeft: 5 }} size={{ sm: 12, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {TicketStore.editing === false
                ? "Registrar nuevo recibo"
                : "Editar recibo"}
            </Typography>

            <Autocomplete
              sx={{ marginBottom: 2 }}
              key={"cliente"}
              options={datasContract}
              getOptionLabel={(option) => {
                try {
                  return "C-" + option?.id + ".- " + option?.cliente;
                } catch (error) {
                  console.log(error);
                }
              }}
              onChange={(e, newValue) => {
                try {
                  if (e.currentTarget !== undefined) {
                    setState({ ...state, contract_id: newValue?.id });
                    // Muestra el valor seleccionado
                    setClient(newValue);
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={searchBy}
                  name={"srchcontract"}
                  label="Contrato"
                  fullWidth
                />
              )}
            />

            {errors.contract_id && (
              <Alert severity="error">{errors.contract_id}</Alert>
            )}

            <TextField
              name="date"
              type="date"
              fullWidth
              value={date}
              onChange={handleChange}
              onBlur={handleBlur}
              sx={{ mb: 2 }}
            />

            {errors.date && <Alert severity="error">{errors.date}</Alert>}

            <TextField
              label={"Concepto:"}
              fullWidth
              margin="normal"
              name={"concept"}
              value={concept}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.concept && <Alert severity="error">{errors.concept}</Alert>}

            <TextField
              name="amount"
              label="Cantidad ($)"
              type="text"
              fullWidth
              required
              value={amount}
              onChange={handleChange}
              onBlur={handleBlur}
              sx={{ mt: 2 }}
            />

            {errors.amount && <Alert severity="error">{errors.amount}</Alert>}

            <TextField
              select
              label={"Forma de Pago"}
              fullWidth
              margin="normal"
              name={"paytype"}
              value={paytype}
              onChange={handleChange}
              onBlur={handleBlur}
              defaultValue={"Efectivo"}
            >
              <MenuItem key={0} value={""}>
                {"No hay datos disponibles"}
              </MenuItem>

              <MenuItem key={1} value={"Efectivo"}>
                {"Efectivo"}
              </MenuItem>
              <MenuItem key={2} value={"Deposito"}>
                {"Deposito"}
              </MenuItem>

              <MenuItem key={3} value={"Transferencia"}>
                {"Transferencia"}
              </MenuItem>
            </TextField>

            {errors.paytype && <Alert severity="error">{errors.paytype}</Alert>}

            <TextField
              name="ref"
              label="Referencia de Pago"
              type="text"
              fullWidth
              required
              value={ref}
              onChange={handleChange}
              onBlur={handleBlur}
              sx={{ mb: 2 }}
            />

            {errors.ref && <Alert severity="error">{errors.ref}</Alert>}

            <div className="ui fluid card"></div>
            {}
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => {
                  TicketStore.setHiddenForm(false);
                  TicketStore.setEditing(false);
                }}
                sx={{ background: "gray", color: "whitesmoke" }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={(e) => saveTicket(e)}
              >
                Guardar
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
