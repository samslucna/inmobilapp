export default function ticketValidate(ticket) {
  let errors = {};

  if (!ticket.concept) {
    errors.concept = "El campo no puede estar vacio";
  }

  if (!ticket.amount) {
    errors.amount = "Debe ingresar una cantidad";
  }

  if (!ticket.date) {
    errors.date = "Debe seleccionar una fecha";
  }

  if (!ticket.paytype) {
    errors.paytype = "Debe seleccionar una forma de pago";
  }


  if (!ticket.ref) {
    errors.ref = "Debe ingresar una referencia de pago";
  }

  return errors;
}
