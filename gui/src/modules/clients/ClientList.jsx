import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ClientStore from "../../store/ClientStore";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";

import Form from "./Form";
import TableData from "./TableData";

const ClientList = observer(() => {
  useEffect(() => {
    ClientStore.loadClients();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
          
          {ClientStore.hiddenForm? null :<ImportInput />}
          
        </Typography>

        <SearchInput />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {ClientStore.hiddenForm ? (
            <Grid size={12}>
              <Form />
            </Grid>
          ) : (
            <Grid size={12}>
              <TableData datas={ClientStore.clients} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default ClientList;
