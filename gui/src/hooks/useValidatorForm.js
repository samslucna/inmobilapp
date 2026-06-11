// hooks/useValidatorForm.js
import { useEffect, useState, useCallback, useRef } from "react";

const useValidatorForm = (
  initialValues,
  validationRules,
  onSubmit,
  options = {}
) => {
  const {
    resetOnSubmit = true,
    validateOnChange = true,
    validateOnBlur = true,
    clearErrorsOnChange = true,
  } = options;

  const [state, setState] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  
  // Ref para evitar envíos múltiples
  const isSubmittingRef = useRef(false);
  const submitTimeoutRef = useRef(null);

  // Función de validación
  const validate = useCallback(async (values) => {
    setIsValidating(true);
    
    try {
      let validationErrors = {};
      
      if (typeof validationRules === 'function') {
        validationErrors = await validationRules(values);
      } else if (validationRules && typeof validationRules === 'object') {
        for (const field in validationRules) {
          const rules = validationRules[field];
          const value = values[field];
          
          if (rules.required && (!value || value === '')) {
            validationErrors[field] = typeof rules.required === 'string' 
              ? rules.required 
              : `${field} es obligatorio`;
          }
          
          if (rules.minLength && value && value.length < rules.minLength.value) {
            validationErrors[field] = rules.minLength.message;
          }
          
          if (rules.maxLength && value && value.length > rules.maxLength.value) {
            validationErrors[field] = rules.maxLength.message;
          }
          
          if (rules.pattern && value && !rules.pattern.value.test(value)) {
            validationErrors[field] = rules.pattern.message;
          }
          
          if (rules.email && value) {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailRegex.test(value)) {
              validationErrors[field] = 'El correo electrónico no es válido';
            }
          }
          
          if (rules.custom && typeof rules.custom === 'function') {
            const customError = await rules.custom(value, values);
            if (customError) {
              validationErrors[field] = customError;
            }
          }
        }
      }
      
      setErrors(validationErrors);
      return validationErrors;
      
    } catch (error) {
      console.error("Error en validación:", error);
      return { _form: "Error al validar el formulario" };
    } finally {
      setIsValidating(false);
    }
  }, [validationRules]);

  // Validación con debounce
  useEffect(() => {
    if (validateOnChange && !isSubmitting) {
      const timeoutId = setTimeout(() => {
        validate(state);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [state, validate, validateOnChange, isSubmitting]);

  // Manejar envío - CORREGIDO para evitar múltiples envíos
  useEffect(() => {
    if (!isSubmitting) return;
    
    // Prevenir ejecución múltiple
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    
    const submitForm = async () => {
      try {
        const validationErrors = await validate(state);
        
        if (Object.keys(validationErrors).length === 0) {
          await onSubmit(state);
          
          if (resetOnSubmit) {
            setState(initialValues);
            setTouched({});
          }
        } else {
          const allTouched = {};
          Object.keys(state).forEach(key => {
            allTouched[key] = true;
          });
          setTouched(allTouched);
        }
      } catch (error) {
        console.error("Error al enviar formulario:", error);
      } finally {
        setIsSubmitting(false);
        isSubmittingRef.current = false;
      }
    };
    
    submitForm();
  }, [isSubmitting, state, validate, onSubmit, initialValues, resetOnSubmit]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    let newValue = value;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'number') {
      newValue = value === '' ? '' : Number(value);
    }
    
    setState(prev => ({ ...prev, [name]: newValue }));
    
    if (clearErrorsOnChange && errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  }, [errors, touched, clearErrorsOnChange]);

  const handleBlur = useCallback(async (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validateOnBlur) {
      await validate(state);
    }
  }, [state, validate, validateOnBlur]);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    
    // Prevenir envíos múltiples
    if (isSubmittingRef.current || isSubmitting) {
      console.log("Formulario ya está siendo enviado, ignorando...");
      return;
    }
    
    setSubmitCount(prev => prev + 1);
    setIsSubmitting(true);
  }, [isSubmitting]);

  const resetForm = useCallback((newValues = initialValues) => {
    setState(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    isSubmittingRef.current = false;
    setSubmitCount(0);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setState(prev => ({ ...prev, [name]: value }));
  }, []);

  return {
    state,
    errors,
    touched,
    isSubmitting,
    isValidating,
    submitCount,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setState,
  };
};

export default useValidatorForm;