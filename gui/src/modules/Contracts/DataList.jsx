import { observer } from "mobx-react-lite";
import ContractStore from "../../store/ContractStore";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Form from "./Form";
import TableData from "./TableData";
import { useState } from "react";
import changeFormat from "../../helper/changeFormat";

const DataList = observer(() => {

  return (
    <>
 

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {ContractStore.hiddenForm ? (
            <Grid size={12}>
              <Form />
            </Grid>
          ) : (
            <Grid size={12}>
              <TableData datasTable={ContractStore.constracts} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default DataList;
