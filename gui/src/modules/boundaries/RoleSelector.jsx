import { TextField, MenuItem } from "@mui/material";
import RolStore from "../../store/RolStore";
import { useEffect } from "react";

export default function RoleSelector({ value, onChange, blur }) {

 
  return (
    <TextField
      select
      label="Rol"
      fullWidth
      margin="normal"
      name="rol"
      value={
        typeof value === "object" ? value.id : value
      }
      onChange={onChange}
      onBlur={blur}
    >
      {RolStore.rols.map((rol) => (
        <MenuItem key={rol.id} value={rol.id}>
          {rol.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
