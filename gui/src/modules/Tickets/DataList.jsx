import { observer } from "mobx-react-lite";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";
import SearchByDate from "./SearchByDate";
import { useState } from "react";
import Form from "./Form";
import TableData from "./TableData";
import TicketStore from "../../store/TicketStore";

const DataList = observer(({ btnMn }) => {
  const [mnSearch, setMnSearch] = useState("");
  const handlerSearch = () => {
    switch (mnSearch) {
      case "main":
        return <SearchInput btnMn={btnMn} />;

      case "seachbydate":
        return <SearchByDate />;

      default:
        return <SearchInput btnMn={btnMn} />;
    }
  };

  const btnMnSearch = (e) => {
    e.preventDefault();
    setMnSearch(e.target.id);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
          {TicketStore.hiddenForm ? null : (
            <ImportInput btnMnSearch={btnMnSearch} btnMn={btnMn} />
          )}
        </Typography>
        {handlerSearch()}
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {TicketStore.hiddenForm ? (
            <Grid size={12}>
              <Form />
            </Grid>
          ) : (
            <Grid size={12}>
              <TableData datasTable={TicketStore.tickets} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default DataList;
