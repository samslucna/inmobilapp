import { TextField, MenuItem } from "@mui/material";
import userStore from "../../store/UserStore";

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
      onBlur={blur}
    >
      {userStore.roles.map((rol) => (
        <MenuItem key={rol} value={rol}>
          {rol}
        </MenuItem>
      ))}
    </TextField>
  );
}