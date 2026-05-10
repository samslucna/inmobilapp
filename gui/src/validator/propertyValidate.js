export default function propertyValidate(property) {
  let errors = {};

  if (!property.block_id) {
    errors.block_id = "La manzana es requerida";
  }

  if (!property.name) {
    errors.name = "El nombre es requerido";
  }

  if (!property.description) {
    errors.description = "La descripción es requerida";
  }

  if (!property.address) {
    errors.address = "La dirección es requerida";
  }

  if (!property.m2 || property.m2 <= 0) {
    errors.m2 = "Obligatorio";
  }

  if (!property.amount_init || property.amount_init <= 0) {
    errors.amount_init = "El precio inicial es requerido";
  }

  return errors;
}
