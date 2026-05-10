import { useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { Box, Button } from "@mui/material";
import BlocksStore from "../../store/BlocksStore";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import StageStore from "../../store/StageStore";


const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));



export default function SearchInput() {
  useEffect(() => {
  StageStore.getStages();
}, []);
  return (
    <Toolbar sx={{ mb: 2 }}>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
      ></Typography>
      {BlocksStore.hiddenForm ? null : (
        <>
          <Box display="flex" justifyContent="flex-start" mb={2}>
            <Button
              variant="contained"
              //startIcon={<PersonAdd />}
              onClick={() => {
                BlocksStore.setBlock({
                  id: null,
                  stage_id: 0,
                  name: "",
                });
                BlocksStore.setHiddenForm(true);
              }}
              sx={{ mb: 2 }}
            >
              + Nueva Manzana
            </Button>
            {/* <Button
              variant="contained"
              sx={{ mb: 2 }}
              color="success"
              onClick={() => BlocksStore.loadUsers()}
              style={{ marginLeft: "10px" }}
            >
              Exportar
            </Button>
            <Button
              variant="contained"
              sx={{ mb: 2 }}
              color="error"
              onClick={() => BlocksStore.loadUsers()}
              style={{ marginLeft: "10px" }}
            >
              PDF
            </Button> */}
          </Box>
          <Search sx={{ background: "whitesmoke", mb: 4 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={(e) => BlocksStore.searchByTable(e, "blocks/search")}
              name="q"
              placeholder="Buscar…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </>
      )}
    </Toolbar>
  );
}
