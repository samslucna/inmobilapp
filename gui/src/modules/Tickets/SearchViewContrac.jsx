import {
  Typography,
  TextField,
  Autocomplete,
  ButtonGroup,
  Button,
} from "@mui/material";
import DataList from "./DataList";
import SearchInput from "./SearchInput";
import { useEffect, useState } from "react";
import ContractStore from "../../store/ContractStore";
import changeFormat from "../../helper/changeFormat";
import ClientStore from "../../store/ClientStore";
import TicketStore from "../../store/TicketStore";
import Form from "./Form";
import Modal from "./Modal";
import { set } from "mobx";
import ModalDoc from "./ModalDoc";

export default function SearchViewContract() {
  const { searchEdit, seachQueryData, contract, setSearchEdit, queryTable } =
    ContractStore;
  const { urlImp, setUrlImp } = TicketStore;
  const { client, setClient } = ClientStore;
  const [tktdDatas, setTktDatas] = useState([]);
  const [datas, setDatas] = useState([]);
  const [state, setState] = useState({});

  const searchBy = async (e, result) => {
    e.preventDefault();
    const { name, value } = e.target || result;
    setSearchEdit(name);
    if (value !== "" && value !== undefined) {
      switch (name) {
        case "srchContract":
          setDatas([]);
          let contracts = await seachQueryData("contracts", value);
          setDatas(contracts);
          break;
        default:
          setDatas([]);
          break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    } catch (error) {
      console.error("Error al crear usuario", error.response?.data);
      alert("Hubo un error al registrar");
    }
  };

  useEffect(() => {
    ContractStore.loadContracts();
  }, []);


  return (
    <>
      <Typography variant="h5" mb={2} >
        Buscar cliente:
      </Typography>
      <div className="row">
        <div class="ui centered grid">
          <div class=" row">
            <div class="column">
              <div class="ui category search">
                <Autocomplete
                  sx={{ marginBottom: 2 }}
                  key={"contracts"}
                  options={datas}
                  getOptionLabel={(option) => {
                    try {
                     
                      setTktDatas(option?.tickets);
                      return option?.id + ".- " + option?.cliente;
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  onChange={(e, newValue) => {
                    try {
                      if (e.currentTarget !== undefined) {
                        setState(newValue);
                        ContractStore.setContract(newValue);
                        //setTktDatas(newValue?.tickets);

                        // Muestra el valor seleccionado
                        //setClient(newValue);
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={searchBy}
                      name={"srchContract"}
                      label="Contrato"
                      fullWidth
                    />
                  )}
                />
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
                          >
                            {data.id + " - " + data.buyer.cliente}
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
                              {ContractStore.contract?.buyer != undefined ? (
                                <div>
                                  <label>#:</label>{" "}
                                  <p>{ContractStore.contract.buyer.id}</p>
                                  <label>Nombre: </label>
                                  <p>
                                    {ContractStore.contract?.buyer.name +
                                      " " +
                                      ContractStore.contract?.buyer.lastnames}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                            <div className="field">
                              <h4 class="ui dividing header">
                                Datos del Lote:
                              </h4>
                              {ContractStore.contract?.buyer != undefined ? (
                                <div>
                                  <label># Lote:</label>
                                  <p>{ContractStore.contract?.property.id}</p>
                                  <label>Nombre:</label>
                                  <p>{ContractStore.contract?.property.name}</p>
                                  <label>Manzana:</label>
                                  <p>
                                    {ContractStore.contract?.property.block_id}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                            <div className="field">
                              <h4 class="ui dividing header">
                                Resumen de Cuenta:
                              </h4>
                              {ContractStore.contract?.buyer != undefined ? (
                                <div>
                                  <div class="two fields">
                                    <div className="field">
                                      <label>Costo: </label>
                                      <p>
                                        {changeFormat.numberToString(
                                          ContractStore.contract?.property
                                            .amount_init,
                                        )}
                                      </p>
                                      <label>Enganche: </label>
                                      <p>
                                        {changeFormat.numberToString(
                                          ContractStore.contract?.advance,
                                        )}
                                      </p>
                                      <label>Status: </label>
                                      <p>
                                        {ContractStore.contract?.property.status}
                                      </p>
                                    </div>
                                    <div className="field">
                                      <label>Plazo: </label>
                                      <p>{ContractStore.contract?.plazo}</p>
                                      <label>Abonado: </label>
                                      <p>
                                        {changeFormat.numberToString(
                                          ContractStore.contract?.pagado,
                                        )}
                                      </p>
                                      <label>Saldo: </label>
                                      <p>
                                        {changeFormat.numberToString(
                                          ContractStore.contract?.saldo,
                                        )}
                                      </p>
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
                            <Modal color={"success"} title={"Excel"} />

                            <ModalDoc
                              data={state}
                              color={"error"}
                              title={"PDF"}
                            />

                            <Button
                              sx={{ mb: 2 }}
                              variant="contained"
                              color={"gray"}
                              onClick={(e) => {
                            
                                setState({});
                                ContractStore.setContract({});
                                setTktDatas([]);
                              }}
                            >
                              Limpiar
                            </Button>
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
                                        <td>
                                          {changeFormat.toDate(data.date)}
                                        </td>

                                        <td> {data.concept}</td>
                                        <td>{data.paytype}</td>
                                        <td>
                                          {changeFormat.numberToString(
                                            data.amount,
                                          )}
                                        </td>

                                        <td>
                                          <div
                                            key={data.id}
                                            className="ui mini basic icon buttons"
                                          >
                                            <button className="ui  button">
                                              <i
                                                id={data.id}
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
                                                  //showModal(e, data);
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
    </>
  );
}
