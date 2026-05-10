import React, { Fragment, useContext } from "react";

const frmTicket = ({ticket,renderDate,addDataTicket,ticketChangeInput}) => {

  return (
    <Fragment>
      <form action="!#">
        {" "}
        <div className="right four wide field">
          <div className="field">
            <h4 class="ui dividing header">Nuevo recibo:</h4>
            <label>Fecha:</label>
            <input
              onChange={ticketChangeInput}
              value={renderDate(ticket.datepay)}
              type="date"
              name="datepay"
              placeholder="0.00"
            />
          </div>
          <div class=" field">
            <label>Concepto:</label>
            <select
              class="ui fluid dropdown"
              onChange={ticketChangeInput}
              value={ticket.concept}
              name="concept"
            >
              <option value="">Concepto:</option>
              <option value="1">Enganche</option>

              <option value="2">Mensualidad</option>
            </select>
          </div>
          <div class="field">
            <label>Forma de pago:</label>
            <select
              class="ui fluid dropdown"
              onChange={ticketChangeInput}
              value={ticket.paytype_id}
              name="paytype_id"
            >
              <option value="">Forma de pago:</option>
              <option value="1">Efectivo</option>
              <option value="2">Deposito</option>
              <option value="3">Transferencia</option>
            </select>
          </div>
          <div class="field">
            <label>Por la cantidad ($):</label>
            <div class="fields">
              <div class="sixteen wide field">
                <input
                  onChange={ticketChangeInput}
                  value={ticket.amount}
                  type="text"
                  name="amount"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div
              class="ui green button"
              onClick={(e) => {
                addDataTicket(e);
              }}
            >
              Guardar recibo
            </div>
            <div
              class="ui black button"
              id={"contractid"}
              onClick={(e) => {
                //editDataInput(e);
              }}
            >
              Cancelar
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default frmTicket;
