import { useEffect, useState } from "react";
import changeFormat from "../helper/changeFormat";

const useSaveSub = (InitialState, validator, fn) => {
  const [state, setState] = useState(InitialState);
  const [errors, setErrors] = useState({});
  const [submitForm, setSubmitForm] = useState(false);

  useEffect(() => {
    if (submitForm) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        fn(state);
        //setState(InitialState);
      }
      setSubmitForm(false);
    }
  }, [errors]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "active") {
      if (checked === false) {
        setState({ ...state, [name]: checked });
      } else {
        setState({ ...state, [name]: checked });
      }
    } else if (name === "advance" || name === "amount" || name === "amount_init" || name === "amount_end") {
        let data ={ ...state, [name]: changeFormat.inputMoney(e) }
        setState(data);
    }   else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validator(state);
    //console.log(errors)
    setErrors(errors);
    setSubmitForm(true);
  };

  const handleBlur = () => {
    const errors = validator(state);
    setErrors(errors);
  };
  return { state, errors, setState, handleChange, handleSubmit, handleBlur };
};

export default useSaveSub;
