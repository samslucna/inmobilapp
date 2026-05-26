import { TextField, MenuItem } from "@mui/material";


export default function Selector({ datas,label,name,value, onChange,blur }) {

  return (
    <TextField
      select
      label={label}
      fullWidth
      margin="normal"
      name={name}
      value={value}
      onChange={onChange}
      onBlur={blur}
    >
      {datas && datas.length === 0 && (
        <MenuItem key={0} value={''}  >
          {"No hay datos disponibles"}
        </MenuItem>
      )}
      {datas && datas.map((data) => (
        <MenuItem key={data.id} value={data.id}>
          {data.name}
        </MenuItem>
      ))}
    </TextField>
  );
}