import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";

import Form from "./Form";
import TableData from "./TableData";
import ProjectStore from "../../store/ProjectStore";
import FormAdd from "./FormAdd";
const DataList = observer(() => {
  useEffect(() => {
    ProjectStore.loadProjects();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
          
          {ProjectStore.hiddenForm? null :<ImportInput />}
          
        </Typography>

        <SearchInput />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {ProjectStore.hiddenForm ? (
            <Grid size={12}>
              <FormAdd />
            </Grid>
          ) : (
            <Grid size={12}>
              <TableData datas={ProjectStore.projects} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default DataList;
