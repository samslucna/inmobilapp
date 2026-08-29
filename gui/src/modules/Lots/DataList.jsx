import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import PropertyStore from "../../store/PropertyStore";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";
import ImportInputBoundaries from './ImportInputBoundaries'
import Form from "./Form";
import TableData from "./TableData";
import authStore from "../../store/AuthStore";
import PropertiesPage from "./PropertiesPage";

const DataList = observer(() => {
  
const {Can} = authStore;


  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
          {PropertyStore.hiddenForm ? null : <Can permission={'lotes.create'}>
            <ImportInput />
            <ImportInputBoundaries />
            </Can>}
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
             <PropertiesPage />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default DataList;
