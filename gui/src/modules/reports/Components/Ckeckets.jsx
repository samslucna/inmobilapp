import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import ReportStore from "../../../store/ReportStore";

//import Show from "./Show";

const Checkets = ({ data }) => {
  const { checkboxes, setCheckboxes } = ReportStore;

  const onChangeCheck = (e) => {
    e.preventDefault();
    const { name, checked } = e.target;

    if (name === "disponible" ) {
      if (checkboxes.disponible === 1) {
        setCheckboxes({ ...checkboxes, disponible: 0 });
      } else {
        setCheckboxes({ ...checkboxes, disponible: 1 });
      }
    }
    if (name === "apartado" ) {
      if (checkboxes.apartado === 1) {
        setCheckboxes({ ...checkboxes, apartado: 0 });
      } else {
        setCheckboxes({ ...checkboxes, apartado: 1 });
      }
    }
    if (name === "vendido") {
      if (checkboxes.vendido === 1) {
        setCheckboxes({ ...checkboxes, vendido: 0 });
      } else {
        setCheckboxes({ ...checkboxes, vendido: 1 });
      }
    }
    
  };

  return (
    <div>
      <FormControlLabel
        sx={{ marginLeft: 2 }}
        
        control={
          <Checkbox
            name="disponible"
            checked={checkboxes.disponible}
            onChange={onChangeCheck}
            sx={{
              color: "green",
              "&.Mui-checked": {
                color: "green",
              },
            }}
          />
        }
        label="Disponible"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="apartado"
            onChange={onChangeCheck}
            checked={checkboxes.apartado}
            sx={{
              color: "orange",
              "&.Mui-checked": {
                color: "orange",
              },
            }}
          />
        }
        label="Apartado"
      />
      <FormControlLabel
        control={
          <Checkbox
            onChange={onChangeCheck}
            name="vendido"
            checked={checkboxes.vendido}
            sx={{
              color: pink[800],
              "&.Mui-checked": {
                color: pink[600],
              },
            }}
          />
        }
        label="Pagado"
      />
    </div>
  );
};

export default Checkets;
