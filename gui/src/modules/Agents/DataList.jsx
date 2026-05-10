import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import AgentStore from "../../store/AgentStore";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";

import Form from "./Form";
import TableData from "./TableData";

const DataList = observer(() => {
  useEffect(() => {
    AgentStore.loadAgents();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
          
          {AgentStore.hiddenForm? null :<ImportInput />}
          
        </Typography>

        <SearchInput />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {AgentStore.hiddenForm ? (
            <Grid size={12}>
              <Form />
            </Grid>
          ) : (
            <Grid size={12}>
              <TableData datas={AgentStore.agents} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default DataList;
