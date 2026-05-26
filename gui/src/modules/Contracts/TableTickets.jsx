import Swal from "sweetalert2";
import InputBase from "@mui/material/InputBase";
import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { styled, alpha } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import { useState, Fragment } from "react";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";
import ContractStore from "../../store/ContractStore";
import changeFormat from "../../helper/changeFormat";
import Show from "./Show";
import TicketStore from "../../store/TicketStore";
import ModalDoc from "./ModalDoc";
import ModalDocIcon from "./ModalDocIcon";

const TableTickets = observer(({ contract, setMn }) => {
  const [list, setList] = useState(contract.tickets);

  const handleDelete = async (id) => {
    const resp = await Swal.fire({
      title: "¿Desa eliminar este recibo?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "rgb(250, 93, 93)",
      cancelButtonColor: "#3085d6",
    });

    if (resp.isConfirmed) {
      await TicketStore.removeTicket(id);
      const getContractUpdate = await ContractStore.showContract(
        "contracts",
        contract.id,
      );
      ContractStore.setContract(getContractUpdate.contract);
      setList(getContractUpdate.tickets);
      await ContractStore.loadContracts();
      Swal.fire({
        title: "Eliminado",
        text: "El recibo se elimino correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const goEdit = async (ticket) => {
    TicketStore.setEditing(true);
    TicketStore.setEditId(ticket.id);
    TicketStore.setTicket(ticket);
    setMn("nwticket");
  };

  return (
    <div className="right sixteen wide five wide computer field">
      <div className="ui buttons">
        <ModalDoc
          data={ContractStore.contract}
          url={"/api/contracts/export/pdf/ticketsPDF?id="}
          color={"error"}
          title={"Lista de Recibos"}
        />
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
      <table className="ui stackable small  table">
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
                              handleDelete(data.id);
                            }}
                            className="trash red icon"
                          ></i>
                        </button>
                        <button className="ui  button">
                          <i
                            id={"del" + data.id}
                            onClick={() => {
                              goEdit(data);
                            }}
                            id={"edit" + data.id}
                            className="edit blue icon"
                          ></i>
                        </button>
                        <ModalDocIcon
                          data={data}
                          url={"/api/tickets/export/pdf/ticket?id="}
                          color={"eye blue icon"}
                          title={"Recibo #"+data.id}
                        />
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
});

export default TableTickets;
