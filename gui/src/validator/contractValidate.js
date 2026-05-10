export default function contractValidate(contract) {
  let errors = {};

  if (!contract.buyer_id) {
    errors.buyer_id = "Debe seleccionar un cliente";
  }

  if (!contract.agent_id) {
    errors.agent_id = "Debe seleccionar un agente de ventas";
  }

  if (!contract.seller_id) {
    errors.seller_id = "Debe seleccionar un cliente";
  }

  if (!contract.property_id) {
    errors.property_id = "Debe seleccionar un lote";
  }


  if (!contract.date) {
    errors.name = "Debe seleccionar una fecha";
  }
  if (!contract.advance) {
    errors.name = "Debe colocar un monto";
  }

  return errors;
}
