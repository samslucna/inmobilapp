export default function projectValidate(project) {
  let errors = {};

  if (!project.name) {
    errors.name = "El nombre es requerido";
  }

  return errors;

}
