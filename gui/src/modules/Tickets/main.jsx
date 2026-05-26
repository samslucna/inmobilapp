import {
  Typography,
  TextField,
  Autocomplete,
  ButtonGroup,
  Button,
} from "@mui/material";

import DataList from "./DataList";
import SearchInput from "./SearchInput";
import { useEffect, useState, MouseEvent } from "react";
import TicketStore from "../../store/TicketStore";
import changeFormat from "../../helper/changeFormat";
import ClientStore from "../../store/ClientStore";
import Form from "./Form";
import { observer } from "mobx-react-lite";


import SearchViewContract from "./SearchViewContrac";

export default function Page() {
  const [mn, setMn] = useState("");
  

  const btnMn = (e) => {
    e.preventDefault();
    setMn(e.target.id);
  };


  const handlerPage = () => {
    switch (mn) {
      case "main":
        return (
          <DataList  btnMn={btnMn} />
        );

      case "searchClient":
        return <SearchViewContract btnMn={btnMn} />;

      default:
        return (
          <DataList btnMn={btnMn} />
        );
    }
  };

  useEffect(() => {
    TicketStore.loadTickets();
  }, []);

  return (
    <>
      <Typography variant="h4" mb={2}>
        Recibos
      </Typography>
   
      {handlerPage()}
    </>
  );
}
