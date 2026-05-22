import React, { createContext, useState, useContext } from "react";
import $ from "jquery";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import { ToolsContext } from "./ToolsContext";
import TicketsTable from "../Components/Contract/components/Layout/TableTickets";
import TicketFrm from "../Components/Ticket/components/Form/frmTicket";
export const ContractContext = createContext();

const ContractProvider = (props) => {
  const {
    setUrImport,
    saveDatas,
    loadTable,
    deleteData,
    updateDatas,
    toDouble,
    inputNumber,
    searchDatas,
    showAllSubData,
    renderDate,
    toExport,
  } = useContext(ToolsContext);

  const [contract, setContract] = useState({
    buyer_id: "",
    seller_id: "",
    agent_id: "",
    property_id: "",
    plazo: "",
    amount: "",
    conditionpay: "",
    datecontract: "",
    partamount: "$ 0.00",
  });

  const [queryTable, setQueryTable] = useState([]);
  const [buyer, setBuyer] = useState({ id: "", name: "", lastnames: "" });
  const [seller, setSeller] = useState({ id: "", name: "", lastnames: "" });
  const [agent, setAgent] = useState({ id: "", name: "", lastnames: "" });
  const [property, setProperty] = useState({ id: "", name: "", mz: "" });
  const [searchInput, setSearchInput] = useState({
    buyer: "text",
    seller: "text",
    agent: "text",
    property: "text",
  });
  const [searchEdit, setSearchEdit] = useState(null);

  const [inptUpd, setInptUpd] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [xlsImport, setXlsImport] = useState(null);
  const [datasTable, setDatasTable] = useState([]);
  const [ticket, setTicket] = useState({
    concept: "",
    amount: 0.0,
    datepay: Date.now(),
    paytype_id: "",
    contract_id: "",
  });
  const [list, setList] = useState([]);
  const [mn, setMn] = useState("");
  const [urlPdf, setUrlPdf] = useState(null);
  const [detailsContract, setDetailsContract] = useState({});
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
  const addData = async () => {
    let dataInsert = {
      buyer_id: buyer.id !== undefined ? buyer.id : "",
      seller_id: seller.id !== undefined ? seller.id : "",
      agent_id: agent.id !== undefined ? agent.id : "",
      property_id: property.id !== undefined ? property.id : "",
      plazo: contract.plazo,
      conditionpay: 1,
      amount: property.amount !== undefined ? property.amount : "",
      datecontract: contract.datecontract,
      partamount: parseFloat(toDouble(contract.partamount)).toFixed(2),
    };

    if (dataInsert.buyer_id === "") {
      Swal.fire("Todos los campos son obligatorios...", "", "error");
    } else {
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
          await saveDatas("/api/contracts", dataInsert);
          clearForm();
          Swal.fire("Guardado!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Operacion Cancelada...", "", "error");
        }
      });
    }
  };

  const addDataTicket = async () => {
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

  const EditData = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Desea guardar los Cambios?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#d33",
      confirmButtonText: "Guardar",
      denyButtonText: `Cancelar`,
      showCancelButton: false,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //console.log(dataInsert)

        // right button

        if (contract.id != undefined || contract.id != "") {
          $("#loader").dimmer("show");
          await updateDatas("/api/contracts/" + contract.id, contract);
          await loadTable("/api/contracts?page=1");
          await setInptUpd(false);
          $("#loader").dimmer("hide");
        }

        //clearForm();
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
      }
    });
  };

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

        if (contract.id != undefined || contract.id != "") {
          $("#loader").dimmer("show");
          await deleteData("/api/contracts/" + id, { id: id });
          await loadTable("/api/contracts?page=1");
          await setInptUpd(false);
          $("#loader").dimmer("hide");
        }

        //clearForm();
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
      }
    });
  };

  const validInput = () => {
    if (
      contract.buyer_id.toString() === "" ||
      contract.agent_id.toString() === "" ||
      contract.seller_id.toString() === "" ||
      contract.property_id.toString() === "" ||
      contract.plazo === "" ||
      contract.amount === "" ||
      contract.partamount === ""
    ) {
      setInputError(true);
    } else {
      setInputError(false);
    }
  };

  const clearForm = () => {
    setContract({
      buyer_id: "",
      seller_id: "",
      agent_id: "",
      property_id: "",
      plazo: "",
      amount: "",
      datecontract: Date.now(),
      partamount: "$ 0.00",
    });

    setBuyer({ id: "", name: "", lastnames: "" });
    setAgent({ id: "", name: "", lastnames: "" });
    setSeller({ id: "", name: "", lastnames: "" });
    setProperty({ id: "", name: "", mz: "" });
  };

  const contractChangeInput = (e, result) => {
    e.preventDefault();

    const { name, value } = e.target || result;
    if (name === "amount" || name === "partamount") {
      setContract({
        ...contract,
        [name]: inputNumber(e),
      });
    } else {
      setContract({
        ...contract,
        [name]: value,
      });
    }
  };

  const searchBy = (e, result) => {
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

  const seachQueryData = async (table, name) => {
    let seachRender = await searchDatas(table, name);
    console.log(seachRender.data);
    await setQueryTable(seachRender.data);
  };

  const setData = async (e, data) => {
    e.preventDefault();
    const { id } = e.target;
    let named = id.replace(data.id, "");

    switch (named) {
      case "pr":
        console.log(data);
        setProperty(data);
        setQueryTable([]);

        setSearchInput({ ...searchInput, property: "hidden" });
        break;

      case "ar":
        console.log(data);
        setAgent(data);
        setQueryTable([]);
        setSearchInput({ ...searchInput, agent: "hidden" });
        break;

      case "sr":
        console.log(data);
        setSeller(data);
        setQueryTable([]);
        setSearchInput({ ...searchInput, seller: "hidden" });
        break;

      case "br":
        console.log(data);
        setBuyer(data);
        setQueryTable([]);
        setSearchInput({ ...searchInput, buyer: "hidden" });
        break;

      default:
        break;
    }
  };

  const editDataInput = (e) => {
    e.preventDefault();
    const { id } = e.target;

    if (id != "") {
      const idname = e.target.id.substr(0, 10);

      switch (idname) {
        case "property_i":
          setProperty({ id: "", name: "" });
          setSearchInput({ ...searchInput, property: "text" });
          break;

        case "buyer_idss":
          setBuyer({ id: "", name: "", lastnames: "" });
          setSearchInput({ ...searchInput, buyer: "text" });
          break;

        case "agent_idss":
          setAgent({ id: "", name: "", lastnames: "" });
          setSearchInput({ ...searchInput, agent: "text" });
          break;

        case "seller_ids":
          setSeller({ id: "", name: "", lastnames: "" });
          setSearchInput({ ...searchInput, seller: "text" });
          break;

        default:
          break;
      }
    }
  };

  const exporTicketsContract = async (e) => {
    e.preventDefault();

    if (contract.buyer !== undefined) {
      $("#loader").dimmer("show");
      await toExport(
        "/api/tickets/export/xls/acountclient",
        "xls",
        "acountclient",
        "EstadoCuentaContrato" + contract.id,
        contract
      ); 
      $("#loader").dimmer("hide");
    }
  };

  const btnMn = (e) => {
    e.preventDefault();

    setMn(e.target.id);
    showAllSubData("contracts", contract).then((res) => {
      setDetailsContract(res);
      setList(res.tickets)
    });
  };

  const btnExport = async (e, url, typedoc, cod, namedoc) => {
    e.preventDefault();
    $("#loader").dimmer("show");
    let urldoc = await toExport(url, typedoc, cod, namedoc);
    await loadTable("/api/contracts?page=1");

    if (urldoc !== null) {
      setUrlPdf(urldoc);
    }
    $("#loader").dimmer("hide");
  };

  const showView = async (e, data) => {
    e.preventDefault();
  };

  const btnView = async (e, data) => {
    e.preventDefault();
    let detailContract = await showAllSubData("contracts", data);
    console.log(detailContract);
    setDetailsContract(detailContract);
    setContract(data);
    setMn(e.target.id);

    if (inptUpd === false) {
      try {
        setList([]);
        setList(data.tickets);
        setInptUpd(true);
      } catch (error) {
        console.log(error);
      }
    } else if (inptUpd === true) {
      //setList(data.tickets);
      setInptUpd(false);
    }
  };

  const btnEdit = (e, data) => {
    e.preventDefault();
    if (inptUpd === false) {
      setContract(data);
      setInptUpd(true);
    } else if (inptUpd === true) {
      setContract({});
      setInptUpd(false);
    }
  };

  const onChangeImport = (e) => {
    e.preventDefault();

    setXlsImport(e.target.files[0]);
  };

  const btnImport = async (e, url) => {
    e.preventDefault();

    if (xlsImport != null) {
      //let urlxls = URL.createObjectURL(xlsImport);
      $("#loader").dimmer("show");
      await setUrImport(url, xlsImport);
      await loadTable("/api/contracts?page=1");
      $("#loader").dimmer("hide");
    }
  };

  const rndertable = async () => {
    setDatasTable([]);
    setInptUpd(false);
    $(".ui.dropdown.tableseach").dropdown();
    await loadTable("/api/contracts?page=1");
  };

  const handlerPage = () => {
    switch (mn) {
      case "tickets":
        return <TicketsTable />;

      case "contract":
        return (
          <embed
            type="application/pdf"
            src={urlPdf}
            width={"100%"}
            height={"500px"}
            title="Fall Nature Hikes"
          />
        );
      
      case "ticketpdf":
        return (
          <embed
            type="application/pdf"
            src={urlPdf}
            width={"100%"}
            height={"500px"}
            title="Fall Nature Hikes"
          />
        );

      case "ticketspdf":
        return (
          <embed
            type="application/pdf"
            src={urlPdf}
            width={"100%"}
            height={"500px"}
            title="estadocuenta"
          />
        );

      case "nwticket":
        return (
          <TicketFrm
            ticket={ticket}
            addDataTicket={addDataTicket}
            ticketChangeInput={ticketChangeInput}
            renderDate={renderDate}
          />
        );

      default:
        return <TicketsTable />;
    }
  };

  return (
    <ContractContext.Provider
      value={{
        contract,
        detailsContract,
        btnExport,
        handlerPage,
        btnView,
        showView,
        list,
        setList,
        mn,
        setMn,
        urlPdf,
        setUrlPdf,
        exporTicketsContract,
        btnMn,
        buyer,
        property,
        seller,
        agent,
        validInput,
        setContract,
        removeData,
        addData,
        EditData,
        xlsImport,
        setXlsImport,
        inptUpd,
        setInptUpd,
        datasTable,
        setDatasTable,
        contractChangeInput,
        searchEdit,
        setSearchEdit,
        searchBy,
        setData,
        seachQueryData,
        editDataInput,
        searchInput,
        setSearchInput,
        queryTable,
        setQueryTable,
        btnEdit,
        onChangeImport,
        btnImport,
        rndertable,
        addDataTicket,
      }}
    >
      {" "}
      {props.children}{" "}
    </ContractContext.Provider>
  );
};

export default ContractProvider;
