import React, { createContext, useState, useContext } from "react";
import $ from "jquery";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";

import { ToolsContext } from "./ToolsContext";
export const BuyerContext = createContext();

const BuyerProvider = (props) => {
  const [buyer, setBuyer] = useState({
    name: "",
    lastnames: "",
    address: "",
    phone: "",
    dni: "",
    email: "",
  });
  const [inptUpd, setInptUpd] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [xlsImport, setXlsImport] = useState(null);

  const { saveDatas, inputNumber, deleteData, updateDatas, loadTable } =
    useContext(ToolsContext);

  const validInput = () => {
    const { name, lastnames, address, phone, dni, email } = buyer;

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

  const addData = async (table) => {
    //let mount = toDouble(Buyer.amount);
    await validInput();
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
          saveDatas("/api/" + table, buyer).then((res) => {
            if (res.status === 200) {
              Swal.fire("Guardado!", "", "success");
              $("#loader").dimmer("hide");
              clearForm();
            } else {
              Swal.fire("Error al guardar la informacion..", "", "error");
            }
          });
        } else if (result.isDenied) {
          Swal.fire("Operacion Cancelada...", "", "error");
        }
      });
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

        if (buyer.id !== undefined || buyer.id !== "") {
          $("#loader").dimmer("show");
          try {
            await updateDatas("/api/buyers/" + buyer.id, buyer);
            await loadTable("/api/buyers?page=1");

            $("#loader").dimmer("hide");
            await setInptUpd(false);
            clearForm();
            Swal.fire("Operacion Exitosa...", "", "success");
          } catch (error) {
            console.log(error);
          }
        }

        //clearForm();
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
      }
    });
  };

  const buyerChangeInput = (e, result) => {
    e.preventDefault();
    console.log("------");
    const { name, value } = e.target || result;

    if (name === "amount") {
      setBuyer({
        ...buyer,
        [name]: inputNumber(e),
      });
    } else {
      setBuyer({
        ...buyer,
        [name]: value,
      });
    }
  };

  const clearForm = () => {
    setBuyer({
      name: "",
      lastnames: "",
      address: "",
      phone: "",
      dni: "",
      email: "",
    });

    setInptUpd(false);
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

        $("#loader").dimmer("show");
        await deleteData("/api/buyers/" + id, { id: id });
        await loadTable("/api/buyers?page=1");
        $("#loader").dimmer("hide");
        Swal.fire("Operacion Exitosa...", "", "success");
        //clearForm();
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
      }
    });
  };

  return (
    <BuyerContext.Provider
      value={{
        buyer,
        setBuyer,
        addData,
        buyerChangeInput,
        xlsImport,
        setXlsImport,
        inptUpd,
        setInptUpd,
        clearForm,
        removeData,
        EditData,
        validInput,
      }}
    >
      {" "}
      {props.children}{" "}
    </BuyerContext.Provider>
  );
};

export default BuyerProvider;
