import {
  Typography,
  TextField,
  Autocomplete,
  ButtonGroup,
  Button,isMobile,isTablet,useTheme,
useMediaQuery,
} from "@mui/material";
import DataList from "./DataList";
import SearchInput from "./SearchInput";
import { useEffect, useState } from "react";
import ContractStore from "../../store/ContractStore";
import changeFormat from "../../helper/changeFormat";
import ClientStore from "../../store/ClientStore";
import TicketStore from "../../store/TicketStore";
import {KeyboardReturn} from '@mui/icons-material'
import Form from "./Form";
import Modal from "./Modal";

import ModalDoc from "./ModalDoc";

export default function SearchViewContract({btnMn}) {
const theme = useTheme();
 const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { searchEdit, seachQueryData, contract, setSearchEdit, queryTable } =
    ContractStore;
  const { urlImp, setUrlImp } = TicketStore;
  const { client, setClient } = ClientStore;
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
          setDatas(contracts.data);
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
          <ButtonGroup
        variant="outlined"
        aria-label="outlined button group"
        sx={{ mb: 2 }}
      >
         <Button
                       type="button"
                       variant="contained"
                       sx={{
                         color: "white",
                         background: "#3576ca",
                         "&:hover": { background: "#b02626" },
                       }}
                       startIcon={<KeyboardReturn />}
                       onClick={e=>btnMn(e)}
                       fullWidth={isMobile}
                       size={isMobile ? "small" : "medium"}
                     >
                       Atras
                     </Button>
 
      </ButtonGroup>
        <div className="ui centered grid">
          <div className=" row">
           
            <div className="column">
              <div className="ui category search">
                <Autocomplete
                  sx={{ marginBottom: 2 }}
                  key={"contracts"}
                  options={datas}
                  getOptionLabel={(option) => {
                    try {
                     
                      //setTktDatas(option?.tickets);
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
              <div className="ui right dropdown  srchticket item">
                <div className="menu ">
                  {queryTable !== []
                    ? queryTable.map((data) => {
                        return (
                          <div
                            key={"cr" + data.id}
                            id={"cr" + data.id}
                            className="item"
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

          <div className=" row">
            <div className="sixteen wide column">
              <div className="ui centered fluid card">
                <div className="content">
                  <form className="ui form">
                    <h3 className="ui dividing header">Capturar Recibo</h3>
                    <div className="field">
                      <div className="two fields">
                        <div className="field">
                          <div className="two fields">
                            <div className="field">
                              <h4 className="ui dividing header">
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
                              <h4 className="ui dividing header">
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
                              <h4 className="ui dividing header">
                                Resumen de Cuenta:
                              </h4>
                              {ContractStore.contract?.buyer != undefined ? (
                                <div>
                                  <div className="two fields">
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
                        <div className="field">
                          <h4 className="ui dividing header">Recibos:</h4>
                          <div className="field">
                     
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
                                //setTktDatas([]);
                              }}
                            >
                              Limpiar
                            </Button>
                          </div>

                       
                        </div>
                      </div>
                    </div>
                  </form>
                  {/*Aqui ver ticket */}
                </div>

                <div className="extra content">
                  <span className="right floated">Joined in 2013</span>
                  <span>
                    <i className="user icon"></i>
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
