import React, { Fragment, useContext, useState } from "react";
import { RenderContext } from "../../../context/RenderContext";
import Manage from "./Manage";
import Search from "./Search";
import Main from "./Main";

const Home = () => {
  const { setSelectedPage } = useContext(RenderContext);
  const [selectedconten, setSelectedConten] = useState(null);

  const navMenu = (e) => {
    e.preventDefault();
    if(selectedconten!=null){
      setSelectedConten(e.target.id);
    }else{
      setSelectedConten(null)
      setSelectedConten(e.target.id)
    };  
  }
  const handlerConten = () => {
    
    switch (selectedconten) {
      case "search":
        return (
          
           <Search  setSelectedConten={setSelectedConten} />
          
        );

      case "manage":
        return (
       
            <Manage 
              selectedconten={selectedconten}
              setSelectedPage={setSelectedPage}
              setSelectedConten={setSelectedConten}
            />
          
        );

      case "main":
        return (
          
            <Main  setSelectedConten={setSelectedConten} />
          
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
          Registrar Contrato
        </button>
        
      </div>
      <div className="ui celled grid">
        <div className="row">
          <div className="sexteen wide column">{handlerConten()}</div>
        </div>
      </div>
      </div>
    </Fragment>
  );
};

export default Home;
