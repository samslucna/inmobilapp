import { observer } from "mobx-react-lite";
import { Box, Typography, Button, Fade } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";
import SearchByDate from "./SearchByDate";
import { useState } from "react";
import Form from "./Form";
import TableData from "./TableData";
import TicketStore from "../../store/TicketStore";
import authStore from "../../store/AuthStore";

const DataList = observer(({ btnMn }) => {
  const { Can } = authStore;
  const [fileName, setFileName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [mnSearch, setMnSearch] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    if (e.target.id === "searchClient") {
      btnMn(e);
    } else {
      btnMnSearch(e);
    }
    setAnchorEl(null);
  };
  const handlerSearch = () => {
    switch (mnSearch) {
      case "main":
        return <SearchInput btnMn={btnMn} setMnSearch={setMnSearch} />;

      case "seachbydate":
        return <SearchByDate setMnSearch={setMnSearch} />;

      case "import":
        return <ImportInput btnMnSearch={btnMnSearch} btnMn={btnMn} />;

      default:
        return <SearchInput btnMn={btnMn} setMnSearch={setMnSearch} />;
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
          <Can permission={"recibos.read"}>
            <Button
              id="main"
              sx={{ background: "#3d5b92", color: "white" }}
              id="fade-button"
              aria-controls={open ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Mas
            </Button>
          </Can>
          <Menu
            id="fade-menu"
            slotProps={{
              list: {
                "aria-labelledby": "fade-button",
              },
            }}
            slots={{ transition: Fade }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <Can permission={'recibos.create'}>
            <MenuItem id="import" onClick={handleClose}>
              Import
            </MenuItem>
            </Can>
            <MenuItem id="seachbydate" onClick={handleClose}>
              Buscar por rango de fecha
            </MenuItem>
            <MenuItem id="searchClient" onClick={handleClose}>
              Buscar por Cliente
            </MenuItem>
          </Menu>
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom></Typography>
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
              <TableData datasTable={TicketStore.tickets} loading ={TicketStore.loading} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default DataList;
