import { TextField, MenuItem } from "@mui/material";
import RolStore from "../../../store/RolStore";

export default function RoleSelector({ value, onChange,blur }) {
  return (
    <TextField
      select
      label="Rol"
      fullWidth
      margin="normal"
      name="rol"
      value={value}
      onChange={onChange}
    >
      {RolStore.rols.map((rol) => (
        <MenuItem key={rol} value={rol}>
          {rol}
        </MenuItem>
      ))}
    </TextField>
  );
}