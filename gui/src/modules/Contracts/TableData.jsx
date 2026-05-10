import Swal from "sweetalert2";
import InputBase from "@mui/material/InputBase";
import { observer } from "mobx-react-lite";
import { styled, alpha } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import { useState, Fragment } from "react";

import ContractStore from "../../store/ContractStore";
import AgentStore from "../../store/AgentStore";
import ClientStore from "../../store/ClientStore";
import PropertyStore from "../../store/PropertyStore";
import PropertaryStore from "../../store/PropertaryStore";
import changeFormat from "../../helper/changeFormat";
import Show from "./Show";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const TableData = observer(({ datasTable }) => {
  const [list, setList] = useState([]);
  const [mn, setMn] = useState("");

  const handleDelete = async (id) => {
    const resp = await Swal.fire({
      title: "¿Eliminar Contrato?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (resp.isConfirmed) {
      await ContractStore.removeContracts(id);
      await ContractStore.loadContracts();
      Swal.fire({
        title: "Eliminado",
        text: "El contrato se elimino correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleChange = (e, value) => {
    ContractStore.handlePaginationChange(value);
  };

  const goEdit = async (contract) => {
    AgentStore.setAgent(contract.agent);
    ClientStore.setClient(contract.buyer);
    PropertyStore.setProperty(contract.property);
    PropertaryStore.setPropertary(contract.seller);
    ContractStore.setEditing(true);
    ContractStore.setEditId(contract.id);
    ContractStore.setContract(contract);
    ContractStore.setHiddenForm(true);
  };

  const handlerPage = () => {
    switch (mn) {
      case "tickets":
        return (
          <div>
            <div class="ui buttons">
              <button class="ui green button">Exportar</button>
              <button class="ui red button">PDF</button>
            </div>
            <table class="ui stackable small table">
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
                                  id={"edit" + data.id}
                                  className="edit blue icon"
                                ></i>
                              </button>
                              <button className="ui  button">
                                <i
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

      case "table":
        return (
          <table className="ui stackable small table">
            <thead>
              <tr>
                <th>Numero</th>
                <th>Fecha</th>
                <th>Comprador/Cliente</th>
                <th>Lote</th>

                <th>Costo($)</th>
                <th>Pagado($)</th>
                <th>Saldo($)</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {datasTable && datasTable !== undefined
                ? datasTable.map((data) => {
                    if (data.buyer !== undefined) {
                      return (
                        <tr key={"r" + data.id}>
                          <td>{data.id}</td>

                          <td>{changeFormat.toDate(data.date)}</td>
                          <td>
                            {data.buyer.name + " " + data.buyer.lastnames}
                          </td>
                          <td>{data.property.name}</td>

                          <td>
                            {changeFormat.numberToString(
                              data.property.amount_init,
                            )}
                          </td>
                          <td>{changeFormat.numberToString(data.pagado)}</td>
                          <td>
                            {changeFormat.numberToString(
                              data.saldo,
                            )}
                          </td>
                          <td>
                            <div
                              key={"edit" + data.id}
                              className="ui mini basic icon buttons"
                            >
                              <button id="delete" className="ui  button">
                                <i
                                  id={"del" + data.id}
                                  onClick={(e) => {
                                    handleDelete(data.id);
                                  }}
                                  className="trash red icon"
                                ></i>
                              </button>
                              <button className="ui  button">
                                <i
                                  id={"edit" + data.id}
                                  onClick={(e) => {
                                    goEdit(data);
                                  }}
                                  className="edit blue icon"
                                ></i>
                              </button>
                              <button className="ui  button">
                                <i
                                  id={"view"}
                                  onClick={(e) => {
                                    btnView(e, data);
                                  }}
                                  className="eye blue icon"
                                ></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  })
                : null}
            </tbody>
            <tfoot>
              <tr align="center">
                <td colSpan={6}>
                  <div className="ui divider"></div>
                  <div className="ui icon buttons">
                    <Pagination
                      count={ContractStore.pagination.last_page}
                      page={ContractStore.pagination.currentPage}
                      onChange={handleChange}
                    />
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        );

      case "view":
        return <Show btnView={btnView} list={list} />;
      default:
        setMn("table");
        return;
    }
  };

  const btnMn = (e) => {
    e.preventDefault();
    setMn(e.target.id);
  };

  const btnView = (e, data) => {
    e.preventDefault();
    ContractStore.setContract(data);

    setMn(e.target.id);

    setList([]);

    setList(data?.tickets);
    //setInptUpd(true);
  };

  return (
    <Fragment>
      <div className="row">
        <div>
          <div className="ui bottom attached segment">{handlerPage()}</div>
        </div>
      </div>
    </Fragment>
  );
});

export default TableData;
