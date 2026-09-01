import { observer } from "mobx-react-lite";
import { Box, Typography, Button, Fade, Pagination } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";
import SearchByDate from "./SearchByDate";
import { useState, useEffect } from "react";
import Form from "./Form";
import TableData from "./TableData";
import TicketStore from "../../store/TicketStore";
import authStore from "../../store/AuthStore";
import Filters from "./Filters";

const DataList = observer(({ btnMn }) => {
  const { Can } = authStore;
  const [fileName, setFileName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [mnSearch, setMnSearch] = useState("");
  const { loadTickets } = TicketStore;
  const [filters, setFilters] = useState({
    search: "",
    clientname: "",
    concept: "",
    status: "",
    datei: null,
    datee: null,
    month: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
    from: null,
    to: null,
  });
  const [data, setData] = useState([]);

  // Handler para el formulario de filtros
  const handleFilterSubmit = async (e) => {
    try {
      e.preventDefault();
      const { name, value } = e.target;
      let filter = { ...filters, [name]: value };
      filter.page = 1;
      const res = await loadTickets(filter.page, filter);

      if (res) {
        setPaginate(res);
        setFilters(filter);
        setData(res.data);
      }
    } catch (error) {
      console.log(e);
    }
  };

  const changePage = async (e) => {
    e.preventDefault();
    let { innerText } = e.target;
    let filter = { ...filters, page: innerText };

    const res = await loadTickets(innerText, filter);

    if (res) {
      setData(res.data);
      setPaginate(res);
      setFilters(filter);
    }
  };

  const btnConsolidate = async (e) => {
    e.preventDefault();
    //consolidate(e);
    console.log("consolidar");
    //const upd = await loadTickets(1, { page: 1 });

    //if (upd) {
    //  setPaginate(upd);
    //  setData(upd.data);
    //}
  };

  const resetFilter = async () => {
    const filterInit = {
      search: "",
      clientname: "",
      concept: "",
      status: "",
      datei: null,
      datee: null,
      month: "",
      year: "",
    };

    const res = await loadTickets(filterInit.page, filterInit);
    console.log(res);
    setFilters(filterInit);
    setData(res.data);
    setPaginate(res);
  };
  // Carga cuando cambian los filtros o la página
  useEffect(() => {
    const init = async () => {
      const dataApi = await loadTickets(filters.page, filters);
      if (dataApi) {
        setPaginate(dataApi);
        setData(dataApi.data);
      }
    };

    init();
  }, []);

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

      case "filters":
        return (
          <Filters
            onFilter={handleFilterSubmit}
            onReset={resetFilter}
            filters={filters}
            setFilters={setFilters}
            btnConsolidate={btnConsolidate}
            setMnSearch={setMnSearch}
          />
        );

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
              aria-controls={open ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Opciones..
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
            <Can permission={"recibos.create"}>
              <MenuItem
                color="success"
                onClick={() => {
                  TicketStore.setHiddenForm(true);
                }}
                sx={{ mb: 2 }}
              >
                +Recibo
              </MenuItem>
            </Can>
            <Can permission={"recibos.create"}>
              <MenuItem id="import" onClick={handleClose}>
                Import
              </MenuItem>
            </Can>
            <Can permission={"recibos.read"}>
              <MenuItem id="filters" onClick={handleClose}>
                Filtros
              </MenuItem>
              <MenuItem id="searchClient" onClick={handleClose}>
                Buscar por Cliente
              </MenuItem>
            </Can>
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
              <Form
                setData={setData}
                setPaginate={setPaginate}
                filters={filters}
              />
            </Grid>
          ) : (
            <>
              <Grid size={12}>
                <TableData
                  datasTable={data}
                  setData={setData}
                  setPaginate={setPaginate}
                  filters={filters}
                  loading={loading}
                />
              </Grid>
              <Pagination
                sx={{ textAlign: "center" }}
                count={paginate?.last_page}
                page={paginate?.current_page}
                onChange={(e) => changePage(e)}
              />
            </>
          )}
        </Grid>
      </Box>
    </>
  );
});

export default DataList;
