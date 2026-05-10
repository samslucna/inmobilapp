import React, { Fragment, useContext, useState } from "react";
import { RenderContext } from "../../../context/RenderContext";
import Manage from "./Manage";
import UploaderFile from "./UploaderFile";
import Main from "./Main";

const Home = () => {
  const { setSelectedPage } = useContext(RenderContext);
  const [selectedconten, setSelectedConten] = useState("");

  const navMenu = (e) => {
    e.preventDefault();
    //
    // console.log(e.target.id);
    setSelectedConten(e.target.id);
  };

  const handlerConten = () => {
    
    switch (selectedconten) {
      case "UploaderFile":
        return (
          
            <UploaderFile setSelectedConten={setSelectedConten} />
          
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
          
            <Main setSelectedConten={setSelectedConten} />
         
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
        <button className="ui button" id="UploaderFile" onClick={(e) => navMenu(e)}>
          UploaderFiles
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
