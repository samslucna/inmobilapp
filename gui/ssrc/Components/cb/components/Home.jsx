import React, { Fragment, useContext, useState } from "react";
import { RenderContext } from "../../../context/RenderContext";
import ManageContract from "./ManageContract";
import Search from "./Search";
import Main from "./Main";
import ToolsProvider from "../../../context/ToolsContext";

const Home = () => {
  const { setSelectedPage } = useContext(RenderContext);
  const [selectedconten, setSelectedConten] = useState("");

  const navMenu = (e) => {
    e.preventDefault();
    console.log(e.target.id);
    setSelectedConten(e.target.id);
  };

  const handlerConten = () => {
    switch (selectedconten) {
      case "search":
        return (
          
            <Search setSelectedConten={setSelectedConten} />
          
        );

      case "manage":
        return (
         
            <ManageContract
              selectedconten={selectedconten}
              setSelectedPage={setSelectedPage}
              setSelectedConten={setSelectedConten}
            />
          
        );

      case "main":
        return (
          
            <Main setSelectedConten={setSelectedConten} />
          
        );

      default:
        return (
         
            <Main setSelectedConten={setSelectedConten} />
          
        );
    }
  };

  return (
    <Fragment>
      <div class="five ui buttons">
     {/*  <button class="ui button" id="main" onClick={(e) => navMenu(e)}>
          Principal
        </button> */}
        <button class="ui button" id="search" onClick={(e) => navMenu(e)}>
          Buscar contrato
        </button>
        <button class="ui button" id="manage" onClick={(e) => navMenu(e)}>
          Captura contrato
        </button>
        <button class="ui button" id="manage" onClick={(e) => navMenu(e)}>
          Recibos de pago
        </button>
        <button class="ui button" id="manage" onClick={(e) => navMenu(e)}>
          Reportes
        </button>
        <button class="ui button" id="manage" onClick={(e) => navMenu(e)}>
          Otros
        </button>
      </div>
      <div className="ui celled grid container">
        <div className="row">
          <div className="sexteen wide column">{handlerConten()}</div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
