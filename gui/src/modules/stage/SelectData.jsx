import { TextField, MenuItem } from "@mui/material";

export default function SelectData({ datas, name, value, onChange, blur }) {
  
  return (
    <TextField
      select
      label="Proyecto"
      fullWidth
      margin="normal"
      name={name}
      value={value}
      onChange={onChange}
      onBlur={blur}
    >
      <MenuItem key={'0'} value={value}>
        {"Seleccione un proyecto"}
      </MenuItem>
      {datas.map((data) => (
        <MenuItem key={data.id} value={data.id}>
          {data.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
