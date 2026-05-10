export default function userValidate(user) {
  let errors = {};

  if (!user.name) {
    errors.name = "El nombre es requerido";
  }

  if (!user.email) {
    errors.email = "El email es requerido";
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(user.email)) {
    errors.email = "El email  formato no válido";
  }

  if (!user.password) {
    errors.password = "La contraseña es requerida";
  } else if (user.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

   if (!user.rol) {
    errors.rol = "El rol es requerido";
  }


  return errors;
}