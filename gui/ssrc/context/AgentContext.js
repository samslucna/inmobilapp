import React, { createContext, useState, useContext } from "react";
import $ from "jquery";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import { ToolsContext } from "./ToolsContext";

export const AgentContext = createContext();

const AgentProvider = (props) => {
  const { saveDatas, deleteData, updateDatas, loadTable, inputNumber } =
    useContext(ToolsContext);

  const [inptUpd, setInptUpd] = useState(false);

  const [xlsImport, setXlsImport] = useState(null);
  const [datasTable, setDatasTable] = useState([]);
  const [inputError, setInputError] = useState(false);

  const [agent, setAgent] = useState({
    name: "",
    lastnames: "",
    address: "",
    phone: "",
    dni: "",
    email: "",
  });
  const clearForm = () => {
    setAgent({
      name: "",
      lastnames: "",
      address: "",
      phone: "",
      dni: "",
      email: "",
    });

    setInptUpd(false);
  };

  const validInput = () => {
    const { name, lastnames, address, phone, dni, email } = agent;

    if (
      name.trim() === "" ||
      lastnames.trim() === "" ||
      address.trim() === "" ||
      phone.trim() === "" ||
      dni.trim() === "" ||
      email.trim() === ""
    ) {
      setInputError(true);
    } else {
      setInputError(false);
    }
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
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //console.log(dataInsert)

        // right button

        if (agent.id !== undefined || agent.id !== "") {
          $("#loader").dimmer("show");
          await updateDatas("/api/agents/" + agent.id, agent);
          loadTable("/api/agents?page=1");
          await setInptUpd(false);
          $("#loader").dimmer("hide");
          Swal.fire("Operacion Exitosa...", "", "success");
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

        $("#loader").dimmer("show");
        await deleteData("/api/agents/" + id, { id: id });
        loadTable("/api/agents?page=1");
        await setInptUpd(false);
        $("#loader").dimmer("hide");
        Swal.fire("Operacion Exitosa...", "", "success");
        //clearForm();
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
      }
    });
  };

  const addData = async () => {
    await validInput()
    //let mount = toDouble(Agent.amount);
    if (inputError === true) {
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
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          $("#loader").dimmer("show");

          saveDatas("/api/agents", agent).then((res) => {
            if (res.status === 200) {
              $("#loader").dimmer("hide");
              Swal.fire("Guardado!", "", "success");
              clearForm();
            } else {
              Swal.fire("Error al guardar la informacion..", "", "error");
            }
          });
          //clearForm();
        } else if (result.isDenied) {
          Swal.fire("Operacion Cancelada...", "", "error");
        }
      });
    }
  };

  const agentChangeInput = (e, result) => {
    e.preventDefault();
    console.log("------");
    const { name, value } = e.target || result;

    if (name === "amount") {
      setAgent({
        ...agent,
        [name]: inputNumber(e),
      });
    } else {
      setAgent({
        ...agent,
        [name]: value,
      });
    }
  };

  return (
    <AgentContext.Provider
      value={{
        agent,
        setAgent,
        addData,
        agentChangeInput,
        xlsImport,
        setXlsImport,
        inptUpd,
        setInptUpd,
        datasTable,
        setDatasTable,
        removeData,
        clearForm,
        addData,
        EditData,
        inputError,
        validInput,
      }}
    >
      {" "}
      {props.children}{" "}
    </AgentContext.Provider>
  );
};

export default AgentProvider;
