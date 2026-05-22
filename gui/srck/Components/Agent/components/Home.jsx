import React, { Fragment, useContext, useState } from "react";
import { RenderContext } from "../../../context/RenderContext";
import Manage from "./Manage";
import Search from "./Search";
import Main from "./Main";

const Home = () => {
  
  const [selectedconten, setSelectedConten] = useState("");

  const navMenu = (e) => {
    e.preventDefault();
    //
    // console.log(e.target.id);
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
       
            <Manage 
              setSelectedConten={setSelectedConten}
            />
          
        );

      case "main":
        return (
          
            <Main setSelectedConten={setSelectedConten} />
          
        );

      default:
        return (
          
            <Main  setSelectedConten={setSelectedConten} />
         
        );
    }
  };

  return (
    <Fragment>
      <div className="field">
      <div className="five ui buttons">
      <button className="ui button" id="main" onClick={(e) => navMenu(e)}>
          Inicio
        </button>
        <button className="ui button" id="search" onClick={(e) => navMenu(e)}>
          Busqueda
        </button>
        <button className="ui button" id="manage" onClick={(e) => navMenu(e)}>
          Registrar Vendedor
        </button>
        
      </div>
      <div className="ui celled grid container">
        <div className="row">
          <div className="sexteen wide column">{handlerConten()}</div>
        </div>
      </div>
      </div>
    </Fragment>
  );
};

export default Home;
