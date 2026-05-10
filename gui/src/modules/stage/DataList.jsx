import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Box, Typography } from "@mui/material";
import StageStore from "../../store/StageStore";
import Grid from "@mui/material/Grid";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";
import Form from "./Form";
import TableData from "./TableData";
import { Toaster } from "react-hot-toast";


const DataList = observer(() => {
  useEffect(() => {
    StageStore.getStages();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Toaster />
        <Typography variant="h5" gutterBottom>
          
          {StageStore.hiddenForm? null :<ImportInput />}
          
        </Typography>

        <SearchInput />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {StageStore.hiddenForm ? (
            <Grid size={12}>
              <Form />
            </Grid>
          ) : (
            <Grid size={12}>
              <TableData datas={StageStore.stages} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default DataList;
