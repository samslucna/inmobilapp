// validator/userValidate.js
const userValidate = {
  name: {
    required: "El nombre es obligatorio",
    minLength: {
      value: 3,
      message: "El nombre debe tener al menos 3 caracteres"
    },
    maxLength: {
      value: 255,
      message: "El nombre no puede exceder los 255 caracteres"
    }
  },
  email: {
    required: "El correo electrónico es obligatorio",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "El correo electrónico no es válido"
    }
  },
  password: {
    minLength: {
      value: 8,
      message: "La contraseña debe tener al menos 8 caracteres"
    }
  },
  role_id: {
    required: "Debe seleccionar un rol",
    custom: {
      isValid: (value) => value && value !== "",
      message: "Debe seleccionar un rol válido"
    }
  }
};

export default userValidate;