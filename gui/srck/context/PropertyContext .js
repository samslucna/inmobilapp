import React, { createContext, useState, useContext } from "react";
import $ from "jquery";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import { ToolsContext } from "./ToolsContext";

export const PropertyContext = createContext();

const PropertyProvider = (props) => {
  const {
    saveDatas,
    toDouble,
    inputNumber,
    deleteData,
    updateDatas,
    loadTable,
  } = useContext(ToolsContext);
  const [datasTable, setDatasTable] = useState([]);
  const [property, setProperty] = useState({
    name: "",
    description: "",
    m2: "",
    address: "",
    stage: "",
    colin1: "",
    colin2: "",
    colin3: "",
    colin4: "",
    amount: 0.0,
    status: 1,
    mz: "",
    buyer_id: 1,
    seller_id: 1,
  });
  const [inptUpd, setInptUpd] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [xlsImport, setXlsImport] = useState(null);

  const clearForm = () => {
    setProperty({
      name: "",
      description: "",
      m2: "",
      address: "",
      stage: "",
      colin1: "",
      colin2: "",
      colin3: "",
      colin4: "",
      amount: 0.0,
      status: 1,
      mz: "",
      buyer_id: 1,
      seller_id: 1,
    });

    setInptUpd(false);
  };

  const addData = async () => {
    let mount = toDouble(property.amount);

    property.amount = mount;
    await validInput();
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
          //console.log(dataInsert)
          $("#loader").dimmer("show");
          saveDatas("/api/properties", property).then(async (res) => {
            if (res.status === 200) {
              Swal.fire(
                "Operacion Exitosa..!",
                "Informacion almacenada",
                "success"
              );
              await loadTable("/api/properties?page=1");
              $("#loader").dimmer("hide");
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
      $("#loader").dimmer("hide");
    }
  };

  const propertyChangeInput = (e, result) => {
    e.preventDefault();
    console.log("------");
    const { name, value } = e.target || result;

    if (name === "amount") {
      setProperty({
        ...property,
        [name]: inputNumber(e),
      });
    } else {
      setProperty({
        ...property,
        [name]: value,
      });
    }
  };

  const validInput = () => {
    const {
      name,
      description,
      m2,
      address,
      stage,
      colin1,
      colin2,
      colin3,
      colin4,
      amount,
      status,
      mz,
      buyer_id,
      seller_id,
    } = property;

    if (

      name.trim() === "" ||
      description.trim() === "" ||
      address.trim() === "" ||
      m2.trim() === "" ||
      stage.trim() === "" ||
      colin1.trim() === "" ||
      colin2.trim() === "" ||
      colin3.trim() === "" ||
      colin4.trim() === "" ||
      mz.trim() === ""
    ) {
      setInputError(true);
    } else {
      setInputError(false);
    }
  };

  const EditData = (e) => {
    e.preventDefault();

    let amount = toDouble(property.amount);
    property.amount = parseFloat(amount);

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
        if (result.isConfirmed) {
          //console.log(dataInsert)

          // right button

          if (property.id !== undefined || property.id !== "") {
            $("#loader").dimmer("show");
            try {
              await updateDatas("/api/properties/" + property.id, property);
              await loadTable("/api/properties?page=1");
             clearForm()
              $("#loader").dimmer("hide");
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
    }
  };

  const removeData = async (e, id) => {
    e.preventDefault();

    Swal.fire({
      title: "Desea eliminar el registro?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      denyButtonColor: "rgb(74, 50, 50)",
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //console.log(dataInsert)
        $("#loader").dimmer("show");
        await deleteData("/api/properties/" + id, { id: id });
        await loadTable("/api/properties?page=1");
        $("#loader").dimmer("hide");
        Swal.fire("Operacion Exitosa...", "", "success");
        //clearForm();
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
      }
    });
  };

  return (
    <PropertyContext.Provider
      value={{
        property,
        setProperty,
        xlsImport,
        setXlsImport,
        inptUpd,
        setInptUpd,
        addData,
        propertyChangeInput,
        datasTable,
        setDatasTable,
        validInput,
        EditData,
        removeData,
        clearForm,
      }}
    >
      {" "}
      {props.children}{" "}
    </PropertyContext.Provider>
  );
};

export default PropertyProvider;
