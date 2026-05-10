import React, { Fragment, useContext,useState } from "react";

import ExportByDateForm from "../Form/ExportByDateForm";
import LoadDataImput from "../Form/LoadDataImput";
import SearchInput from "../Form/SearchInput";
import { TicketContext } from "../../../../context/TicketContext";

const DwnLfCnr = ({ dataTbl }) => {

  const { btnExport } = useContext(TicketContext);
  const [selectedconten, setSelectedConten] = useState("");

  const navMenu = (e) => {
    e.preventDefault();
    //
    // console.log(e.target.id);
    setSelectedConten(e.target.id);
  };

  const handlerConten = () => {
    switch (selectedconten) {
      case "exportbydate":
        return <ExportByDateForm setSelectedConten={setSelectedConten} />;

      case "ImportInput":
        return <LoadDataImput setSelectedConten={setSelectedConten} />;

      case "search":
        return <SearchInput setSelectedConten={setSelectedConten} />;

      default:
        return <SearchInput setSelectedConten={setSelectedConten} />;
    }
  };

  return (
    <Fragment>
      <div className="ui top attached menu">
        <div className="ui dropdown tableseach icon item">
          <i className="wrench icon"></i>
          <div className="menu">
            <div className="item">
              <i className="dropdown icon"></i>
              <span className="text">Reportes Excel</span>
              <div className="menu">
                <div
                id="exportbydate"
                  className="item"
                  onClick={(e) => {
                    navMenu(
                      e
                    );
                  }}
                >
                  Exportar por Fecha
                </div>
                      <div
                  className="item"
                  onClick={(e) => {
                       btnExport(
                      e,
                      "/api/tickets/export/xls",
                      "xls",
                      "all",
                      "contratos fecha de a "
                    );
                  }}
                >
                  Gral. Tickets
                </div>
              </div>
            </div>
            <div className="item">
              <i className="dropdown icon"></i>
              <span className="text">Reportes PDF</span>
              <div className="menu">
                <div
                  className="item"
                  onClick={(e) => {
                    btnExport(
                      e,
                      "/api/contracts/export/xls",
                      "xls",
                      "all",
                      "contratos fecha de a "
                    );
                  }}
                >
                  Gral. Tickets
                </div>
              </div>
            </div>



            <div className="divider"></div>
            <div className="header" id="search"
                  
                  onClick={(e) => {
                    navMenu(
                      e
                    );
                  }}
                >
                  Buscar</div>
          </div>
        </div>

        <div className="right menu">{handlerConten()}</div>
      </div>
    </Fragment>
  );
};

export default DwnLfCnr;
