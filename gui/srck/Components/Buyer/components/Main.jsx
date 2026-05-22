import React, { Fragment } from "react";

//import "sweetalert2/dist/sweetalert2.css";

const Main = ({setSelectedConten}) => {
  return (
    <Fragment>
      <div className="row">
        <h2>Clientes</h2>

        <div class="ui  cards">
          <div class="ui raised link card"  id="search" onClick={() => setSelectedConten('manage')}>
            <div class="content">
              <div class="header">Registrar</div>
              <div class="meta">
                <span class="category">Clientes</span>
              </div>
              <div class="description">
         
              </div>
            </div>
            <div class="extra content">
              <div class="right floated author"></div>
            </div>
          </div>

          <div class="ui raised link card" id="search" onClick={() => setSelectedConten('search')}>
            <div class="content">
              <div class="header">Buscar</div>
              <div class="meta">
                <span class="category">Clientes</span>
              </div>
              <div class="description">
                       <div class="ui list">
                  <div class="item">
                    <i class="user icon"></i>
                    <div class="content">
                      <div class="header">Buscar</div>
                 
                    </div>
                  </div>

                   <div class="item">
                    <i class="sync alternate icon"></i>
                    <div class="content">
                      <div class="header">Actualizar</div>
                    </div>
                  </div>
                  
                    <div class="item">
                    <i class="cloud upload icon"></i>
                    <div class="content">
                      <div class="header">Importar datos</div>
                    </div>
                  </div>
                   <div class="item">
                    <i class="clipboard outline icon"></i>
                    <div class="content">
                      <div class="header">Reportes</div>
                 
                    </div>
                  </div>
               
                </div>
              </div>
            </div>
            <div class="extra content">
              <div class="right floated author"></div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Main;
