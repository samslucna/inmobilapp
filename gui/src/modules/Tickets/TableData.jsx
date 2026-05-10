import Swal from "sweetalert2";
import InputBase from "@mui/material/InputBase";
import { observer } from "mobx-react-lite";
import { styled, alpha } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import { useState, Fragment } from "react";
import { Box, Typography } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import TicketStore from "../../store/TicketStore";
import AgentStore from "../../store/AgentStore";
import ClientStore from "../../store/ClientStore";
import PropertyStore from "../../store/PropertyStore";
import PropertaryStore from "../../store/PropertaryStore";
import changeFormat from "../../helper/changeFormat";

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
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (resp.isConfirmed) {
      await TicketStore.removeContracts(id);
      await TicketStore.loadTickets();

      Swal.fire({
        title: "Eliminado",
        text: "El usuario ha sido eliminado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleChange = (e, value) => {
    TicketStore.handlePaginationChange(value);
  };

  const goEdit = async (ticket) => {
    PropertyStore.setProperty(ticket.property);
    PropertaryStore.setPropertary(ticket.seller);
    TicketStore.setEditing(true);
    TicketStore.setEditId(ticket.id);
    TicketStore.setTicket(ticket);
    TicketStore.setHiddenForm(true);
  };

  const btnView = (e, data) => {
    e.preventDefault();
    TicketStore.setTicket(data);

    setMn(e.target.id);

    //setInptUpd(true);
  };

  return (
    <Fragment>
      <div className="row">
        <div>
          <div className="ui bottom attached segment">
            <table className="ui stackable small table">
              <thead>
                <tr>
                  <th>Numero</th>
                  <th>Fecha</th>
                  <th>Concepto($)</th>
                  <th>Monto($)</th>
                  <th>Status</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {datasTable !== [] && datasTable !== undefined
                  ? datasTable.map((data) => {
                      return (
                        <tr key={"r" + data.id}>
                          <td>{data?.id}</td>

                          <td>{changeFormat.toDate(data.date)}</td>
                          <td>{data.concept}</td>

                          <td>{changeFormat.numberToString(data.amount)}</td>
                          <td>{data.status}</td>

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
                                  id={"view" + data.id}
                                  onClick={(e) => {
                                    //btnView(e, data);
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
              <tfoot>
                <tr align="center">
                  <td colSpan={6}>
                    <div className="ui divider"></div>
                    <div className="ui icon buttons">
                      <Pagination
                        count={TicketStore.pagination.last_page}
                        page={TicketStore.pagination.currentPage}
                        onChange={handleChange}
                      />
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
});

export default TableData;
