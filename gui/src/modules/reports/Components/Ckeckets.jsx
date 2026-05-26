import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";



//import Show from "./Show";

const Checkets = ({ list }) => {
  return (
    <div>
      <FormControlLabel sx={{marginLeft:2}} control={<Checkbox defaultChecked sx={{
        color: 'green',
              "&.Mui-checked": {
                color: 'green',
              },
      }} />} label="Disponible" />
      <FormControlLabel control={<Checkbox defaultChecked sx={{
        color: 'orange',
              "&.Mui-checked": {
                color: 'orange',
              },
      }} />} label="Apartado" />
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked
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
