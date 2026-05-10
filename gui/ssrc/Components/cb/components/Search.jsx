import React, { Fragment, useContext,useState, useEffect } from "react";
import { ToolsContext } from "../../../context/ToolsContext";
import $ from "jquery";
import { LoginContext } from "../../../context/LoginContext";
//import "sweetalert2/dist/sweetalert2.css";

const Search = () => {
  const {updateDatas,
    toExportDoc,
    datasAuxTable,
    setDatasAuxTable,
    datasTable,
    numberToString,
    setDatasTable,
    readDatas,
    searchDatas,
    pagination,
    setPagination,
  } = useContext(ToolsContext);

  const { user } = useContext(LoginContext);

  const [exportToExcel, setExportToExcel] = useState({
    all: "api/properties/exports/xls/all",
    bystage: "api/properties/exporttoexcel/bystage",
    byblock: "api/properties/exporttoexcel/byblock",
  });

  const paginator = async (e) => {
    e.preventDefault();
    const { id } = e.target;
    loadTable("/api/properties?page=" + parseInt(id));
    let ob = pagination;
    ob.current = parseInt(id);
    //console.log(ob);
    setPagination(ob);
    updateTable();
    //setCurrentPag(id);
  };

  const renderPagination = (numpag) => {
    let dataret = [];

    for (let i = 0; i < numpag; i++) {
      dataret.push(i + 1);
    }
    return dataret.map((inp) => {
      return (
        <button
          key={inp}
          onClick={(e) => {
            paginator(e);
          }}
          className="ui button"
          id={inp}
        >
          {" "}
          {inp}
        </button>
      );
    });
  };

  const loadTable = (table) => {
    let a = readDatas(table).then(async (res) => {
      let result = await res.json();
      //console.log(result)
      let lim = pagination.limit;
      setPagination({
        limit: lim,
        current: result.current_page,
        total: result.last_page,
      });
      setDatasTable(result.data);
      return;
    });
  };

  const updateTable = async () => {
    setDatasTable([]);
    setDatasTable(datasTable);
  };

  const searchBy = async (e) => {
    e.preventDefault();
    const { value } = e.target;


    if (value !== "") {
      let seachRender = await searchDatas(
        "/api/properties/search?name=",
        value
      );
      //console.log(seachRender)
      setDatasTable(seachRender);
    } else {
      setDatasTable(datasAuxTable);
    }

    //searchDatas
  };

  const toExport = (e, routeExport) => {
    e.preventDefault();
    return toExportDoc(routeExport)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al descargar el archivo: ${response.status} ${response.statusText}`
          );
        }
        let res = response.blob();
        //console.log(response)
        return res;
      })
      .then((blob) => {
        //console.log(blob)
        const url = URL.createObjectURL(blob);
        //console.log(url)
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "properties.xlsx");
        document.body.appendChild(link);
        link.click();
        return blob;
      });
  };

  const deleteData = (id) => {};

  const editData = (e) => {
    e.preventDefault();
    const { id } = e.target;
    let idcv = id;
    //let data={}
    console.log(idcv.replace("edit", ""));
    
    //updateDatas("api/properties/",data)
  };

  useEffect(() => {
    $(".ui.dropdown").dropdown();

    loadTable("/api/properties?page=" + pagination.current);
    updateTable();
    //console.log(pagination.total)
  }, []);


  return (
    <Fragment>
       <div className="row">
        <div class="ui top attached menu">
          <div class="ui dropdown icon item">
            <i class="wrench icon"></i>
            <div class="menu">
              <div class="item">
                <i class="dropdown icon"></i>
                <span class="text">Reportes Excel</span>
                <div class="menu">
                  <div
                    class="item"
                    onClick={(e) => {
                      toExport(e, exportToExcel.all);
                    }}
                  >
                    Gral. Propiedades
                  </div>
                  <div
                    class="item"
                    onClick={(e) => {
                      toExport(e, exportToExcel.bystage);
                    }}
                  >
                    Por Etapa
                  </div>
                </div>
              </div>
              <div class="item">Open...</div>
              <div class="item">Save...</div>
              <div class="item">Edit Permissions</div>
              <div class="divider"></div>
              <div class="header">Export</div>
              <div class="item">Share...</div>
            </div>
          </div>
          <div class="right menu">
            <div class="ui right aligned category search item">
              <div class="ui transparent icon input">
                <input
                  class="prompt"
                  type="text"
                  placeholder="Buscar..."
                  onChange={searchBy}
                />
                <div class="ui basic modal">
                  <div class="ui icon header">
                    <i class="archive icon"></i>
                    Archive Old Messages
                  </div>
                  <div class="content">
                    <p>
                      Your inbox is getting full, would you like us to enable
                      automatic archiving of old messages?
                    </p>
                  </div>
                  <div class="actions">
                    <div className="ui red basic cancel inverted button">
                      <i className="remove icon"></i>
                      No
                    </div>
                    <div className="ui green ok inverted button">
                      <i className="checkmark icon"></i>
                      Yes
                    </div>
                  </div>
                </div>
                <i className="search link icon"></i>
              </div>
              <div className="results">jjjjj</div>
            </div>
          </div>
        </div>
        <div className="ui bottom attached segment">
          <table className="ui stackable small table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Caracteristicas</th>
                <th>$</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {datasTable !== []
                ? datasTable.map((data) => {
                    return (
                      <tr key={"r" + data.id}>
                        <td>{data.id}</td>
                        <td>{data.name}</td>
                        <td>{data.description}</td>
                        <td>{data.feature}</td>
                        <td>{numberToString(data.amount)}</td>
                        <td>
                          <div class="ui mini basic icon buttons">
                            <button id="delete" className="ui  button">
                              <i className="trash red icon"></i>
                            </button>
                            <button
                              id={"edit" + data.id}
                              onClick={(e) => {
                                editData(e);
                              }}
                              className="ui  button"
                            >
                              <i className="edit blue icon"></i>
                            </button>
                            <button
                              id="show"
                              onClick={() => {
                                
                              }}
                              className="ui  button"
                            >
                              <i className="eye teal icon"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6}>
                  <div className="ui divider"></div>
                  <div className="ui icon buttons">
                    {renderPagination(pagination.total)}
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default Search;
