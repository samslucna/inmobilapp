import { styled, alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

import ReportStore from "../../store/ReportStore";

import changeFormat from "../../helper/changeFormat";

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

export default function SearchByDate({ action }) {
  return (
    <Toolbar sx={{ mb: 2 }}>
     
        <>
          <Search sx={{ background: "#f5f5f5", mb: 4 }}>
            <SearchIconWrapper>Del:</SearchIconWrapper>
            <StyledInputBase
              onChange={(e) => ReportStore.updateRangeDate(e)}
              name="date_init"
              type="date"
              placeholder="Buscar…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Search sx={{ background: "#f5f5f5", mb: 4 }}>
            <SearchIconWrapper>Al:</SearchIconWrapper>
            <StyledInputBase
              onChange={(e) => ReportStore.updateRangeDate(e)}
              name="date_end"
              type="date"
              placeholder="Buscar…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box display="flex" justifyContent="flex-start" mb={2}>
            <Button
              variant="contained"
         
              onClick={(e)=>action(e)}
              sx={{ mb: 2 }}
            >
              Filtrar
            </Button>
          </Box>
    
        </>
      
    </Toolbar>
  );
}
