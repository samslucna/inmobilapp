import React, { Fragment, useContext } from "react";
import { ToolsContext } from "../../../../context/ToolsContext";
import { TicketContext } from "../../../../context/TicketContext";
import $ from "jquery";
const TableData = ({ dataTbl }) => {
  const { numberToString, renderDate, renderPagination,pagination } =
    useContext(ToolsContext);
  const { removeData, setTicket, setInptUpd, inptUpd } =
    useContext(TicketContext);

  const showModal = async (e, data) => {
    e.preventDefault();

    setTicket([]);
    setTicket(data);

    $("#AgentEdit")
      .modal({
        allowMultiple: false,
        onDeny: function () {
          console.log("salir");
        },
      })
      .modal("show");
  };

  const btnEdit = (e, data) => {
    e.preventDefault();
    if (inptUpd === false) {
      setTicket(data);
      setInptUpd(true);
    } else if (inptUpd === true) {
      setTicket({});
      setInptUpd(false);
    }
  };

  return (
    <Fragment>
      <table className="ui  unstackable small table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Fecha</th>
            <th>Concepto</th>
            <th>Forma de pago</th>
            <th>Importe ($)</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {dataTbl !== [] && dataTbl !== undefined
            ? dataTbl.map((data) => {
                return (
                  <tr key={"r" + data.id}>
                    <td>{data.id}</td>
                    <td>{renderDate(data.datepay)}</td>
                    <td>{data.concept}</td>
                    <td>
                      {data.paytype_id === 1 ? (
                        <p>Efectivo</p>
                      ) : data.paytype_id === 2 ? (
                        <p>Deposito</p>
                      ) : data.paytype_id === 3 ? (
                        <p>Transferencia</p>
                      ) : null}
                    </td>
                    <td>{numberToString(data.amount)}</td>

                    <td>
                      <div
                        key={"edit" + data.id}
                        className="ui mini basic icon buttons"
                      >
                        <button id="delete" className="ui  button">
                          <i
                            id={"del" + data.id}
                            onClick={(e) => {
                              removeData(e, data.id);
                            }}
                            className="trash red icon"
                          ></i>
                        </button>
                        <button className="ui  button">
                          <i
                            id={"edit" + data.id}
                            onClick={(e) => {
                              btnEdit(e, data);
                            }}
                            className="edit blue icon"
                          ></i>
                        </button>
                        <button className="ui  button">
                          <i
                            id={"view" + data.id}
                            onClick={(e) => {
                              showModal(e, data);
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
          <tr>
            <td colSpan={6}>
              <div className="field">
                <div className="ui divider"></div>
                <div className="ui icon buttons">
                  {renderPagination(pagination.total, "tickets")}
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </Fragment>
  );
};

export default TableData;
