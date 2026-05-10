import { styled, alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { Box, Button } from "@mui/material";
import StageStore from "../../store/StageStore";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import PersonAdd from "@mui/icons-material/PersonAdd";

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
      {StageStore.hiddenForm ? null : (
        <>
          <Box display="flex" justifyContent="flex-start" mb={2}>
            <Button
              variant="contained"
              //startIcon={<PersonAdd />}
              onClick={() => {
                StageStore.setStage({
                  id: null,
                  project_id: 0,
                  name: "",
                });
                StageStore.setHiddenForm(true);
              }}
              sx={{ mb: 2 }}
            >
              + Nueva Etapa
            </Button>
            {/* <Button
              variant="contained"
              sx={{ mb: 2 }}
              color="success"
              onClick={() => StageStore.loadUsers()}
              style={{ marginLeft: "10px" }}
            >
              Exportar
            </Button>
            <Button
              variant="contained"
              sx={{ mb: 2 }}
              color="error"
              onClick={() => StageStore.loadUsers()}
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
              onChange={(e) => StageStore.searchByTable(e, "stages/search")}
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
