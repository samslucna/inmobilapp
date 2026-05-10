export default function clientValidate(client) {
  let errors = {};

  if (!client.name) {
    errors.name = "El nombre es requerido";
  }

  if (!client.lastnames) {
    errors.lastnames = "Los apellidos son requeridos";
  }

  if (!client.email) {
    errors.email = "El email es requerido";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(client.email)
  ) {
    errors.email = "El email  formato no válido";
  }

  if (!client.phone) {
    errors.phone = "Campo telefono obligatorio";
  } else if (client.phone.length !== 10) {
    errors.phone = "El telefono debe ser de 10 digitos";
  }

  if (!client.address) {
    errors.address = "La dirección es obligatoria";
  }

  if (!client.dni) {
    errors.dni = "El numero de identificación obligatoria";
  }

  return errors;
}
