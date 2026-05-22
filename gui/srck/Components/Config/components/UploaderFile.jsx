import React, { Fragment, useContext, useEffect, useState } from "react";
import $ from "jquery";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import "../css/styles.css";
import { ConfigContext } from "../../../context/ConfigContext";
import { ToolsContext } from "../../../context/ToolsContext";

const UploaderFile = () => {
  const {
    fileUpload,
    setFileUpload,
    descFile,
    setDescFile,
    reportList,
    setReportList,
  } = useContext(ConfigContext);
  const { uploaderFiles, readDatas,deleteData } = useContext(ToolsContext);
  const [urlFile, setUrlFile] = useState("");

  const onChangeImport = (e) => {
    e.preventDefault();

    setFileUpload(e.target.files[0]);
  };

  const onChangeUpload = (e, result) => {
    e.preventDefault();
    const { name, value } = e.target || result;
    setDescFile({
      ...descFile,
      [name]: value,
    });
  };

  const setUrlReport = (e, url) => {
    e.preventDefault();
    $("#loader").dimmer("show");
    setUrlFile("");

    setUrlFile("http:localhost:8080/public/reports/" + url);
    $("#loader").dimmer("show");
  };

  const btnUploadFile = async (e, url) => {
    e.preventDefault();

    if (fileUpload != null) {
      //let urlxls = URL.createObjectURL(fileUpload);
      $("#loader").dimmer("show");
      await uploaderFiles(url, fileUpload, descFile);
      $("#loader").dimmer("hide");
      return readDatas("api/upload_files").then(async (res) => {
        let result = await res.data;

        await setReportList(result.data);
      });
    }
  };

    const removeData = async (e, id) => {
    e.preventDefault();
    Swal.fire({
      title: "Desea Eliminar la Plantilla?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
      showCancelButton: false,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //console.log(dataInsert)

        // right button
        console.log(id)

        if (id !== "") {
          $("#loader").dimmer("show");
          await deleteData("/api/upload_files/" + id, { id: id });
          await rndertable();
         // await setInptUpd(false);
          $("#loader").dimmer("hide");
            Swal.fire("Operacion exitosa", "Plantilla eliminada...", "success");
        }

        //clearForm();
      } else if (result.isDenied) {
        Swal.fire("Operacion Cancelada...", "", "error");
      }
    });
  };

  const rndertable = async () => {
    $(".ui.dropdown.tableseach").dropdown();
    return readDatas("api/upload_files").then(async (res) => {
      let result = await res.data;

      await setReportList(result.data);
    });
  };

  useEffect(() => {
    rndertable();
  }, []);

  return (
    <Fragment>
      <div className="row">
        <div className="ui page dimmer" id="loader">
          <div className="content">
            <h2 className="ui inverted icon header">
              <div className="ui large text loader">Loading..</div>
            </h2>
          </div>
        </div>

        <div className="field">
          <h3 class="ui dividing header">Subir archivo.</h3>
          <div className="field">
            <div class="ui left icon input">
              <input
                type="text"
                onChange={onChangeUpload}
                value={descFile.name}
                name="name"
                placeholder="Nombre"
              />
              <i class="file icon"></i>
            </div>
          </div>
          <div className="field">
            <div class="ui left icon input">
              <input
                type="text"
                onChange={onChangeUpload}
                value={descFile.description}
                name="description"
                placeholder="Descripcion"
              />
              <i class="file icon"></i>
            </div>
          </div>
          <div className="field">
            <input
              type="file"
              className="ui small input"
              onChange={onChangeImport}
              name="file"
            />

            <button
              className="ui compact icon button"
              id={"uploader"}
              onClick={(e) => {
                btnUploadFile(e, "/api/tickets/uploadfile");
              }}
            >
              <i className="cloud upload blue icon"></i> Subir
            </button>
          </div>

          <h3 class="ui dividing header"></h3>
        </div>
      </div>

      <div className="ui grid">
        <div className="sixteen wide column">
          <div className="eleven wide column">
            <div class="ui list">
              <div class="item">
                <i class="folder icon"></i>
                <div class="content">
                  <div class="header">Reportes:</div>
                  <div class="list">
                    {reportList !== [] && reportList !== undefined
                      ? reportList.map((data) => {
                          return (
                            <div key={"r" + data.id} class="item">
                              <i class="file excel icon"></i>
                              <div class="content">
                                <div class="header">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      setUrlReport(e, data.fileurl);
                                    }}
                                  >
                                    {data.name}
                                  </a>
                                </div>
                                <div class="description">{data.datas}</div>
                                    <a
                                    href="#"
                                    onClick={(e) => {
                                      removeData(e, data.id);
                                    }}
                                  >X</a>
                              </div>
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="field">
            <embed src={urlFile}></embed>
          </div>
        </div>

      </div>
    </Fragment>
  );
};

export default UploaderFile;
