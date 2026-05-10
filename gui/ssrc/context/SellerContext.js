import React, { createContext, useState, useContext } from "react";
import $ from "jquery";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import { ToolsContext } from "./ToolsContext";

export const SellerContext = createContext();

const SellerProvider = (props) => {
  const { saveDatas, inputNumber, loadTable, updateDatas, deleteData } =
    useContext(ToolsContext);
  const [seller, setSeller] = useState({
    name: "",
    lastnames: "",
    address: "",
    phone: "",
    dni: "",
    email: "",
  });

  const [inptUpd, setInptUpd] = useState(false);
  const [xlsImport, setXlsImport] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [datasTable, setDatasTable] = useState([]);

  const addData = async () => {
    //let mount = toDouble(Seller.amount);
    await validInput()
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
        $("#loader").dimmer("show");
        if (result.isConfirmed) {
          //console.log(dataInsert)
          saveDatas("/api/sellers", seller).then(async (res) => {
            if (res.status === 200) {
              await loadTable("/api/sellers?page=1");
              Swal.fire("Guardado!", "", "success");
              clearForm();
              $("#loader").dimmer("hide");
            } else {
              $("#loader").dimmer("hide");
              Swal.fire("Error al guardar la informacion..", "", "error");
            }
          });
          //clearForm();
        } else if (result.isDenied) {
          Swal.fire("Operacion Cancelada...", "", "error");
          $("#loader").dimmer("hide");
        }
      });
    }
  };

  const sellerChangeInput = (e, result) => {
    e.preventDefault();
    console.log("------");
    const { name, value } = e.target || result;

    if (name === "amount") {
      setSeller({
        ...seller,
        [name]: inputNumber(e),
      });
    } else {
      setSeller({
        ...seller,
        [name]: value,
      });
    }
  };

  const validInput = () => {
    const { name, lastnames, address, phone, dni, email } = seller;
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
  const clearForm = () => {
    setSeller({
      name: "",
      lastnames: "",
      address: "",
      phone: "",
      dni: "",
      email: "",
    });
    setInptUpd(false);
  };

  const EditData = async (e) => {
    e.preventDefault();
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
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        $("#loader").dimmer("show");
        if (result.isConfirmed) {
          //console.log(dataInsert)

          // right button

          if (seller.id !== undefined || seller.id !== "") {
            await updateDatas("/api/sellers/" + seller.id, seller);
            await loadTable("/api/sellers?page=1");
            await clearForm();
            Swal.fire("", "Actualizado correctamente..", "success");
            $("#loader").dimmer("hide");
          }

          //clearForm();
        } else if (result.isDenied) {
          Swal.fire("Operacion Cancelada...", "", "error");
          $("#loader").dimmer("hide");
        }
      });
    }
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

        if (seller.id !== undefined || seller.id !== "") {
          $("#loader").dimmer("show");
          await deleteData("/api/sellers/" + id, { id: id });
          await loadTable("/api/sellers?page=1");
          clearForm();
          $("#loader").dimmer("hide");
          Swal.fire("Operacion Exitosa...", "", "success");
        }

        //clearForm();
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
        $("#loader").dimmer("hide");
      }
    });
  };

  return (
    <SellerContext.Provider
      value={{
        seller,
        setSeller,
        addData,
        sellerChangeInput,
        xlsImport,
        setXlsImport,
        clearForm,
        inptUpd,
        setInptUpd,
        datasTable,
        setDatasTable,
        EditData,
        removeData,validInput
      }}
    >
      {" "}
      {props.children}{" "}
    </SellerContext.Provider>
  );
};

export default SellerProvider;
