export default function rolValidate(rol) {
  let errors = {};

  if (!rol.name) {
    errors.name = "El nombre es requerido";
  }

  if (!rol.description) {
    errors.description = "Agrega una descripción";
  }

  return errors;

}
