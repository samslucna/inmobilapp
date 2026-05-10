export default function boundaryValidate(boundary) {
  let errors = {};



  if (!boundary.name) {
    errors.name = "El nombre colindancia es requerido";
  }

  if (!boundary.description) {
    errors.description = "La colindancia es requerida";
  }

  if (!boundary.m2) {
    errors.m2 = "Los metros cuadrados son requeridos";
  }



  return errors;
}
