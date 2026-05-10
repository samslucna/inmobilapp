import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";
import Form from "./Form";
import TableData from "./TableData";
import RolStore from "../../../store/RolStore";

const DataList = observer(() => {
  useEffect(() => {
    RolStore.loadRols();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
          {RolStore.hiddenForm ? null : <ImportInput />}
        </Typography>

        <SearchInput />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {RolStore.hiddenForm ? (
            <Grid size={12}>
              <Form />
            </Grid>
          ) : (
            <Grid size={12}>
              <TableData datas={RolStore.rols} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default DataList;
