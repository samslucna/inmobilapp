import React, { useState, Fragment, useContext, useEffect } from "react";
import { LoginContext } from "../../../context/LoginContext";
import { ToolsContext } from "../../../context/ToolsContext";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import $ from "jquery";
const Auth = ({ setSelectedPageMain }) => {
  const { selectAlert } = useContext(ToolsContext);
  const { user, registerUser, setUser, logued, loginUser } =
    useContext(LoginContext);

  const changeUserInput = async (e, result) => {
    e.preventDefault();
    const { name, value } = e.target || result;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const btnAddUser = async (e) => {
    e.preventDefault();
  
    await registerUser(user);
  

    //console.log('usuario no logueado...')
    if (logued !== false) {
      Swal.fire("Verifique sus datos..", "", "info");
      //user.pass = passcrypt;
      //localStorage.setItem("user", JSON.stringify(user));
    }
  };

  {
    /*          <div className="field">
                  <div className="ui left icon input">
                    <i className="user icon"></i>
                    <input
                      type="text"
                      name="name"
                      onChange={changeUserInput}
                      value={user.name}
                      placeholder="Usuario"
                    />
                  </div>
                </div> */
  }

  {
    /*    <button
                className="ui fluid large teal submit button"
                onClick={(e) => {
                  btnAddUser(e);
                }}
              >
                Registrar
              </button> */
  }
  const btnLogin = async (e) => {
    e.preventDefault();

    const { email, password } = user;

    try {
      if (email.trim() !== "" || password.trim() !== "") {
   
        let res = await loginUser(user);

        if (res.status === 200) {
          localStorage.setItem("user", JSON.stringify(res));
          await selectAlert("loginok", "Bienvenido " + res.data.user.email);
       
          setSelectedPageMain("userprofile");
        } else if (res.status === 401) {
          Swal.fire("Verifique sus datos..", "usuario o contraseña", "info");
      
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <div className="ui middle aligned center aligned grid">
        <div className="ui page dimmer" id="loader1">
          <div className="content">
            <h2 className="ui inverted icon header">
              <div className="ui large text loader">Loading..</div>
            </h2>
          </div>
        </div>
        <div className="row">
          <div className="ui fourteen wide mobile eight wide tablet four wide computer column">
            <h2 className="ui teal image header">
              {/* <img src="assets/images/logo.png" className="image" /> */}
              <div className="content">inmobilAp</div>
            </h2>
            <form className="ui large form">
              <div className="ui stacked segment">
                <div className="field">
                  <div className="ui left icon input">
                    <i className="user icon"></i>
                    <input
                      type="text"
                      name="name"
                      onChange={changeUserInput}
                      value={user.name}
                      placeholder="Usuario"
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="ui left icon input">
                    <i className="user icon"></i>
                    <input
                      type="text"
                      onChange={changeUserInput}
                      value={user.email}
                      name="email"
                      placeholder="E-mail address"
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="ui left icon input">
                    <i className="lock icon"></i>
                    <input
                      type="password"
                      name="password"
                      onChange={changeUserInput}
                      value={user.password}
                      placeholder="Password"
                    />
                  </div>
                </div>

                <button
                  className="ui fluid large teal submit button"
                  onClick={(e) => {
                    btnLogin(e);
                  }}
                >
                  Entrar
                </button>
              </div>

              <button
                className="ui fluid large teal submit button"
                onClick={(e) => {
                  btnAddUser(e);
                }}
              >
                Registrar
              </button> 

              <div className="ui error message">hola</div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Auth;
