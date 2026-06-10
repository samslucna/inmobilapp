import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import PropertaryStore from "../../store/PropertaryStore";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";

import Form from "./Form";
import TableData from "./TableData";
import authStore from "../../store/AuthStore";

const DataList = observer(() => {
  const {Can} =authStore;
  useEffect(() => {
    PropertaryStore.loadPropertaries();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
          
          {PropertaryStore.hiddenForm? null :<Can permission={'usuarios.create'}> <ImportInput /></Can>}
          
        </Typography>

        <SearchInput />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {PropertaryStore.hiddenForm ? (
            <Grid size={12}>
              <Form />
            </Grid>
          ) : (
            <Grid size={12}>
              <TableData datas={PropertaryStore.propertaries} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default DataList;
