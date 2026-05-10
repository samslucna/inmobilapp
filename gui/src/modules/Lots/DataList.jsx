import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import PropertyStore from "../../store/PropertyStore";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";

import Form from "./Form";
import TableData from "./TableData";

const DataList = observer(() => {
  



  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
          {PropertyStore.hiddenForm ? null : <ImportInput />}
        </Typography>

        <SearchInput />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {PropertyStore.hiddenForm ? (
            <Grid size={12}>
              <Form />
            </Grid>
          ) : (
            <Grid size={12}>
              <TableData datas={PropertyStore.properties} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default DataList;
