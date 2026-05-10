import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import userStore from "../../store/UserStore";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchInput from "./SearchInput";
import Form from "./Form";
import TableData from "./TableData";
import BoundaryStore from "../../store/BoundaryStore";

const List = observer(() => {
 
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom></Typography>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {BoundaryStore.hiddenForm ? (
            <Grid size={12}>
              <Form />
            </Grid>
          ) : (
            <Grid size={12}>
              <Button
                variant="contained"
                onClick={() => {
                  BoundaryStore.setHiddenForm(true);
                }}
                sx={{ mb: 2 }}
              >
                +Agregar
              </Button>
              <TableData datas={BoundaryStore.Boundaries} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default List;
