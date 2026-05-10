import React, { createContext, useState, useContext } from "react";
import $ from "jquery";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import { ToolsContext } from "./ToolsContext";

export const TicketContext = createContext();

const TicketProvider = (props) => {
  const {
    toDouble,
    renderDate,
    saveDatas,
    deleteData,
    setUrImport,
    toExport,
    setUrlExportData,
    setSearchEdit,
    loadTable,
    searchDatas,
    inputNumber,
  } = useContext(ToolsContext);



  const [rangeDate, setRangeDate] = useState({
    dates: "",
    datee: "",
  });
 
  const [xlsImport, setXlsImport] = useState(null);

  const [queryTable, setQueryTable] = useState([]);

  const [searchInput, setSearchInput] = useState({
    buyer: "text",
    seller: "text",
    agent: "text",
    property: "text",
    contract: "text",
  });
  const [inptUpd, setInptUpd] = useState(false);
  const [contract, setContract] = useState({
    buyer_id: "",
    seller_id: "",
    agent_id: "",
    property_id: "",
    plazo: "",
    amount: "",
    datecontract: "",
    partamount: 0.0,
  });

  const [ticket, setTicket] = useState({
    concept: "",
    amount: 0.0,
    datepay: Date.now(),
    paytype_id: "",
    contract_id: "",
  });
  

  const removeData = async (e, id) => {
    e.preventDefault();
    Swal.fire({
      title: "Desea Eliminar el registo?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //console.log(dataInsert)

        // right button

        if (ticket.id != undefined || ticket.id != "") {
          $("#loader").dimmer("show");
          await deleteData("/api/tickets/" + id, { id: id });

          $("#loader").dimmer("hide");
        }

        //clearForm();
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
      }
    });
  };

  const removeTicket = async (e, id) => {
    e.preventDefault();
    Swal.fire({
      title: "Desea Eliminar el registo?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //console.log(dataInsert)

        // right button

        if (ticket.id != undefined || ticket.id != "") {
          $("#loader").dimmer("show");
          await deleteData("/api/tickets/" + id, { id: id });

          Swal.fire("Operacion Exitosa...", "", "success");
          $("#loader").dimmer("hide");
        }

        //clearForm();
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
        $("#loader").dimmer("hide");
      }
    });
  };

  const addData = async () => {
    //let mount = toDouble(ticket.amount);

    let dataInsert = {
      concept: ticket.concept,
      amount: toDouble(ticket.amount),
      datepay: renderDate(ticket.datepay),
      paytype_id: ticket.paytype_id,
      contract_id: contract.id,
    };

    Swal.fire({
      title: "Desea guardar los Cambios?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#d33",
      confirmButtonText: "Guardar",
      denyButtonText: `Cancelar`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //console.log(dataInsert)
        $("#loader").dimmer("show");
        await saveDatas("/api/tickets", dataInsert).then(async (res) => {
          if (res.status == 200) {
            await loadTable("tickets");

            Swal.fire("Guardado!", "", "success");
            $("#loader").dimmer("hide");
          } else {
            Swal.fire("Error al guardar la informacion..", "", "error");
            $("#loader").dimmer("hide");
          }
        });
        //clearForm();
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
      }
    });
  };

  const seachQueryData = async (table, name) => {
    let seachRender = await searchDatas(table, name);
    setQueryTable(seachRender.data);
  };


  // sumar totales arreglos
  const getTotal = (listsum) => {
    let aux = 0;
    let auxval = 0;
    listsum.forEach((res) => {
      aux = res.amount;
      aux = aux + auxval;
      auxval = aux;
    });
    let auxticket = ticket;
    auxticket.subtotal = auxval.toFixed(2);
    //setTicket(auxticket);
    return auxval.toFixed(2);
  };

  const offTotal = (total, off) => {
    let res;
    total = parseFloat(total);
    off = parseFloat(off);
    if (total > off || total === off) {
      res = total - off;
      return res;
    }
  };

  const searchByTo = (e, result) => {
    e.preventDefault();
    const { name, value } = e.target || result;

    setSearchEdit(name);
    if (value !== "" && value !== undefined) {
      switch (name) {
        case "srchprop":
          seachQueryData("properties", value);
          break;
        case "srchseller":
          seachQueryData("sellers", value);
          break;

        case "srchagent":
          seachQueryData("agents", value);
          break;
        case "srchbuyer":
          seachQueryData("buyers", value);
          break;
        default:
          setQueryTable([]);
          break;
      }
    }
  };

  const ticketChangeInput = (e, result) => {
    e.preventDefault();

    const { name, value } = e.target || result;
    if (name === "amount" || name === "partamount") {
      setTicket({
        ...ticket,
        [name]: inputNumber(e),
      });
    } else {
      setTicket({
        ...ticket,
        [name]: value,
      });
    }
  };

  const btnImport = async (e, url) => {
    e.preventDefault();

    if (xlsImport != null) {
      //let urlxls = URL.createObjectURL(xlsImport);
      $("#loader").dimmer("show");
      await setUrImport(url, xlsImport);
      await loadTable("/api/tickets?page=1");
      $("#loader").dimmer("hide");
    }
  };

  const onChangeImport = (e) => {
    e.preventDefault();

    setXlsImport(e.target.files[0]);
  };

  const updateRangeDate = (e, result) => {
    e.preventDefault();
    const { name, value } = e.target || result;

    switch (name) {
      case "dates":
        rangeDate.dates = new Date(value);

        setRangeDate(rangeDate);
        break;
      case "datee":
        rangeDate.datee = new Date(value);
        setRangeDate(rangeDate);
        break;
    }
  };



  const btnExport = async (e, url, typedoc, cod, namedoc) => {
    e.preventDefault();
    
    switch (cod) {
      case "all":
        $("#loader").dimmer("show");
        await toExport(url, typedoc, cod, namedoc);
        $("#loader").dimmer("hide");
        return;
      case "bydate":
        console.log("bydate");
        $("#loader").dimmer("show");
        await setUrlExportData(url, namedoc, rangeDate);
        $("#loader").dimmer("hide");
        return;

      default:
        break;
    }
  };


  return (
    <TicketContext.Provider
      value={{
        searchByTo,
        ticketChangeInput,
        removeTicket,
        setRangeDate,
        ticket,
        getTotal,
        offTotal,
        rangeDate,
        setTicket,
        queryTable,
        setQueryTable,
        addData,
        contract,
        setContract,
        searchInput,
        inptUpd,
        setInptUpd,
        setSearchInput,
        seachQueryData,
        removeData,
        xlsImport,
        btnImport,
        btnExport,
        onChangeImport,
        updateRangeDate,
      }}
    >
      {" "}
      {props.children}{" "}
    </TicketContext.Provider>
  );
};

export default TicketProvider;
