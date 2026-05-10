import React, { Fragment, useContext, useEffect } from "react";
import { RenderContext } from "../../../context/RenderContext";
import $ from "jquery";
import { dropdown } from "semantic-ui-css";
import { LoginContext } from "../../../context/LoginContext";
import { ToolsContext } from "../../../context/ToolsContext";

const Main = ({ setSelectedPageMain }) => {
  const { selectedPage, handlerPage, setSelectedPage } =
    useContext(RenderContext);
  const { user, logout } = useContext(LoginContext);
  const { selectAlert } = useContext(ToolsContext);

  const navMenu = (e) => {
    e.preventDefault();
    if (selectedPage === null) {
      setSelectedPage(null);
      setSelectedPage(e.target.id);
    } else {
      setSelectedPage(null);
      setSelectedPage(e.target.id);
    }
  };

  const closeSession = async (e) => {
    e.preventDefault();
    let res = await logout();

    if (res.status === 200) {
      localStorage.removeItem("user");
      await selectAlert("loginok", "Cerrando sesión...");
      setSelectedPageMain("login");
    } else {
      console.log("Algo salio mal : Close Session");
    }
  };

  useEffect(function () {
    $(".ui.dropdown").dropdown();
  }, []);

  return (
    <Fragment>

        <div className="ui stackable  menu">
          <div className="item">
            <h2>
              {" "}
              <i className="building icon"></i>
            </h2>
            <div className="content">
              InmobilApp
              <div className="sub header">"Manage your preferences"</div>
            </div>
          </div>
          <a
            className="item"
            key={"cmhome"}
            id="cmhome"
            onClick={(e) => navMenu(e)}
          >
            Home
          </a>
          <a className="ui dropdown item" id="cmsales" key={"cmsales"}>
            <i className="ticket icon"></i>Ventas
            <i className="dropdown icon"></i>
            <div className="menu">
              <a
                className="item"
                key={"cmcontract"}
                id="cmcontract"
                onClick={(e) => navMenu(e)}
              >
                <i className="file alternate icon"></i> Contratos
              </a>
              <a
                className="item"
                key={"cmticket"}
                id="cmticket"
                onClick={(e) => navMenu(e)}
              >
                <i className="ticket alternate icon"></i> Recibos
              </a>
            </div>
          </a>
          <a className="ui dropdown item">
            Catalogos
            <i className="dropdown icon"></i>
            <div className="menu">
              <a
                className="item"
                key={"cmproperty"}
                id="cmproperty"
                onClick={(e) => navMenu(e)}
              >
                <i className="building icon"></i> Lotes
              </a>
              <a
                className="item"
                key={"cmagent"}
                id="cmagent"
                onClick={(e) => navMenu(e)}
              >
                <i className="user secret icon"></i> Agentes/Vendedores
              </a>
              <a
                className="item"
                key={"cmbuyer"}
                id="cmbuyer"
                onClick={(e) => navMenu(e)}
              >
                <i className="users icon"></i> Clientes
              </a>
              <a
                className="item"
                key={"cmseller"}
                id="cmseller"
                onClick={(e) => navMenu(e)}
              >
                <i className="id badge outline icon"></i> Propietarios
              </a>
            </div>
          </a>

          <a className="item" id="cmconfig" onClick={(e) => navMenu(e)}>
            <i className="wrench icon"></i>Configuración
          </a>
          <a className="ui dropdown item">
            {user.email}
            <i className="dropdown icon"></i>
            <div className="menu">
              {/* <div className="item">
                <i className="dropdown icon"></i>
                <span className="text">Categories</span>
                <div className="menu">
                  <div className="item">Unread</div>
                  <div className="item">Promotions</div>
                  <div className="item">Updates</div>
                </div>
              </div> */}
              <a className="item" onClick={(e) => closeSession(e)}>
                Salir
              </a>
            </div>
          </a>

          {/*
          <a className="item" id="cmad" onClick={(e) => navMenu(e)}>
            <i className="question circle icon"></i> Acerca de ...
          </a> */}
        </div>
        <div className="row">
          <div className="sixteen wide column">{handlerPage()}</div>
        </div>
    
    </Fragment>
  );
};

export default Main;
