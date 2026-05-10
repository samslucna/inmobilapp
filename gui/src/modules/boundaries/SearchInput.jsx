import { styled, alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { Link } from "react-router-dom";
import BoundaryStore from "../../store/BoundaryStore";

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
  return (
    <Toolbar sx={{ mb: 2 }}>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
      ></Typography>
      {BoundaryStore.hiddenForm ? null : (
        <>
          <Box display="flex" justifyContent="flex-start" mb={2}>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => {
        
                BoundaryStore.setHiddenForm(true);
              }}
              sx={{ mb: 2 }}
            >
              Nuevo Usuario
            </Button>
            {/* <Button
              variant="contained"
              sx={{ mb: 2 }}
              color="success"
              onClick={() => BoundaryStore.loadUsers()}
              style={{ marginLeft: "10px" }}
            >
              Exportar
            </Button>
            <Button
              variant="contained"
              sx={{ mb: 2 }}
              color="error"
              onClick={() => BoundaryStore.loadUsers()}
              style={{ marginLeft: "10px" }}
            >
              PDF
            </Button> */}
          </Box>
          <Search sx={{ background: "#f5f5f5", mb: 4 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={(e) => BoundaryStore.searchByTable(e, "users/search")}
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
