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
import contractValidate from "../../validator/contractValidate";
import changeFormat from "../../helper/changeFormat";

export default function Form() {
  const { seachQueryData, setSearchEdit, contract } = ContractStore;
  const { client, setClient } = ClientStore;
  const { propertary, setPropertary } = PropertaryStore;
  const { property, setProperty } = PropertyStore;
  const { agent, setAgent } = AgentStore;
  const [datas, setDatas] = useState([]);
  const [datasPropietarios, setDatasPropietarios] = useState([]);
  const [datasAgente, setDatasAgente] = useState([]);
  const [datasLotes, setDatasLotes] = useState([]);
  const { state, errors, setState, handleChange, handleSubmit, handleBlur } =
    useSaveSub(
      ContractStore.contract,
      contractValidate,
      ContractStore.addContract,
    );

  const {
    client_id,
    seller_id,
    property_id,
    agent_id,
    date,
    advance,
    paytype,
    ref,
    plazo,
  } = state;

  const cleanForm = () => {
    ContractStore.setContract({
      id: null,
      buyer_id: "",
      seller_id: "",
      agent_id: "",
      property_id: "",
      plazo: "",
      paytype: "",
      ref: "",
      date: "",
      advance: "$ 0.00",
    });

    setClient({
      id: null,
      name: "",
      lastnames: "",
      phone: "",
      email: "",
      dni: "",
    });
    setAgent({
      id: null,
      name: "",
      lastnames: "",
      phone: "",
      email: "",
      dni: "",
    });
    setPropertary({
      id: null,
      name: "",
      lastnames: "",
      phone: "",
      email: "",
      dni: "",
    });

    setProperty({
      id: null,
      project_id: null,
      stage_id: null,
      block_id: null,
      name: "",
      description: "",
      m2: 0.0,
      address: "",
      amount_init: 0.0,
      amount_end: 0.0,
      status: "disponible",
      boundaries: [],
    });
  };

  const saveContract = async (e) => {
    setState(state);
    handleSubmit(e);
  };

  const searchBy = async (e, result) => {
    e.preventDefault();
    const { name, value } = e.target || result;

    setSearchEdit(name);
    if (value !== "" && value !== undefined) {
      switch (name) {
        case "srchproperty":
          setDatasLotes([]);
          const lotes = await seachQueryData("properties", value);

          const lotesdisponibles = lotes.filter(
            (p) => p.status === "disponible",
          );
          //console.log(lotesdisponibles);
          setDatasLotes(lotesdisponibles);
          break;
        case "srchagent":
          setDatasPropietarios([]);
          let agente = await seachQueryData("agents", value);

          setDatasAgente(agente);
          break;
        case "srchseller":
          setDatasPropietarios([]);
          let propietarios = await seachQueryData("sellers", value);

          setDatasPropietarios(propietarios);
          break;

        case "srchclient":
          setDatas([]);
          let clientes = await seachQueryData("buyers", value);
          setDatas(clientes.data);
          break;
        default:
          setDatas([]);
          break;
      }
    }
  };

  useEffect(() => {
    if (!ContractStore.editing) {
    
    }
  }, []);

  return (
    <>
      <Box>
        <Grid container>
          <Grid sx={{ marginLeft: 5 }} size={{ sm: 12, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {ContractStore.editing === false
                ? "Registrar nuevo Contrato"
                : "Editar Contrato"}
            </Typography>

            <TextField
              name="date"
              label="Fecha"
              type="date"
              fullWidth
              value={date ? changeFormat.toDate(date) : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              sx={{ mb: 2 }}
            />

            {errors.date && <Alert severity="error">{errors.date}</Alert>}
            <Autocomplete
              sx={{ marginBottom: 2 }}
              key={"cliente"}
              options={datas}
              value={client}
              getOptionLabel={(option) => {
                try {
                  return (
                    option?.id + ".- " + option?.name + " " + option?.lastnames
                  );
                } catch (error) {
                  console.log(error);
                }
              }}
              onChange={(e, newValue) => {
                try {
                  if (e.currentTarget !== undefined) {
                    setState({ ...state, buyer_id: newValue?.id });
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
                  name={"srchclient"}
                  label="Cliente"
                  fullWidth
                />
              )}
            />
            {errors.seller_id && (
              <Alert severity="error">{errors.seller_id}</Alert>
            )}
            <Autocomplete
              sx={{ marginBottom: 2 }}
              key={"propietario"}
              options={datasPropietarios}
              value={propertary}
              getOptionLabel={(option) => {
                try {
                  return (
                    option?.id + ".- " + option?.name + " " + option?.lastnames
                  );
                } catch (error) {
                  console.log(error);
                }
              }}
              onChange={(e, newValue) => {
                if (e.currentTarget !== undefined) {
                  setState({ ...state, seller_id: newValue?.id });
                  // Muestra el valor seleccionado
                  setPropertary(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={searchBy}
                  name={"srchseller"}
                  label="Dueño/Vendedor"
                  fullWidth
                />
              )}
            />

            {errors.seller_id && (
              <Alert severity="error">{errors.seller_id}</Alert>
            )}
            <Autocomplete
              sx={{ marginBottom: 2 }}
              key={"agente"}
              options={datasAgente}
              value={agent}
              getOptionLabel={(option) => {
                try {
                  return (
                    option?.id + ".- " + option?.name + " " + option?.lastnames
                  );
                } catch (error) {
                  console.log(error);
                }
              }}
              onChange={(e, newValue) => {
                if (e.currentTarget !== undefined) {
                  setState({ ...state, agent_id: newValue?.id });
                  // Muestra el valor seleccionado
                  setAgent(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={searchBy}
                  name={"srchagent"}
                  label="Agente de Ventas"
                  fullWidth
                />
              )}
            />
            {errors.agent_id && (
              <Alert severity="error">{errors.agent_id}</Alert>
            )}
            <Autocomplete
              sx={{ marginBottom: 2 }}
              key={"lote"}
              value={property}
              options={datasLotes}
              getOptionLabel={(option) => {
                try {
                  return (
                    option?.id +
                    ".- " +
                    option?.name +
                    " " +
                    option?.description
                  );
                } catch (error) {
                  console.log(error);
                }
              }}
              onChange={(e, newValue) => {
                if (e.currentTarget !== undefined) {
                  setState({ ...state, property_id: newValue?.id });

                  setProperty(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={searchBy}
                  name={"srchproperty"}
                  label="Lote"
                  fullWidth
                />
              )}
            />

            {errors.property_id && (
              <Alert severity="error">{errors.property_id}</Alert>
            )}
            <TextField
              select
              label={"Plazo"}
              fullWidth
              margin="normal"
              name={"plazo"}
              value={plazo ? plazo : ""}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <MenuItem key={0} value={""}>
                {"No hay datos disponibles"}
              </MenuItem>

              <MenuItem key={1} value={12}>
                {"12 Meses"}
              </MenuItem>
              <MenuItem key={2} value={24}>
                {"24 Meses"}
              </MenuItem>

              <MenuItem key={3} value={36}>
                {"36 Meses"}
              </MenuItem>
            </TextField>
            {errors.plazo && <Alert severity="error">{errors.plazo}</Alert>}
            <TextField
              name="advance"
              label="Enganche ($)"
              type="text"
              fullWidth
              required
              value={advance ? advance : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              sx={{ mt: 2 }}
            />

            {errors.advance && <Alert severity="error">{errors.advance}</Alert>}
            <TextField
              select
              label={"Forma de Pago"}
              fullWidth
              margin="normal"
              name={"paytype"}
              value={paytype}
              onChange={handleChange}
              onBlur={handleBlur}
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
          </Grid>
          <Grid size={{ sm: 12, md: 1 }}></Grid>
          <Grid sx={{ marginTop: 5 }} size={{ sm: 12, md: 5 }}>
            <div className="ui fluid card">
              <div className="content">
                <div className="ui internally celled grid">
                  <div className="row">
                    <div className="sixteen wide computer column">
                      <div className="ui mini statistics">
                        <div className="statistic">
                          <div className="value">
                            {client !== undefined
                              ? client?.name + " " + client?.lastnames
                              : null}
                          </div>
                          <div className="label">Cliente</div>
                        </div>

                        <div className="statistic">
                          <div className="value">
                            {propertary !== undefined
                              ? propertary?.id +
                                " " +
                                propertary?.name +
                                " " +
                                propertary?.lastnames
                              : ""}
                          </div>
                          <div className="label">Dueño/Propietario</div>
                        </div>
                        <div className="statistic">
                          <div className="value">
                            {agent !== undefined
                              ? agent?.id +
                                " " +
                                agent?.name +
                                " " +
                                agent?.lastnames
                              : ""}
                          </div>
                          <div className="label">Agente de Ventas</div>
                        </div>
                        <div className="statistic">
                          <div className="value">
                            {property !== undefined
                              ? property?.id + " " + property?.name
                              : null}
                          </div>
                          <div className="label">Lote</div>
                        </div>
                        <div className="statistic">
                          <div className="value">{plazo + " " + "Meses"}</div>
                          <div className="label">Plazo</div>
                        </div>
                        <div className="statistic">
                          <div className="value">
                            <p>{advance}</p>
                          </div>
                          <div className="label">Enganche($)</div>
                        </div>
                        <div className="statistic">
                          <div className="value">
                            <p>{paytype}</p>
                          </div>
                          <div className="label">Forma de Pago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => {
                  ContractStore.setHiddenForm(false);
                  ContractStore.setEditing(false);
                  cleanForm();
                }}
                sx={{ background: "gray", color: "whitesmoke" }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={(e) => saveContract(e)}
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
