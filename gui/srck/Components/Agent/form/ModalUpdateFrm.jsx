import React, { Fragment} from "react";

const ModalUpdateFrm = ({ agent }) => {

  return (
    <Fragment>
      <div className="ui modal" id="AgentEdit">
        <i className="close icon"></i>
        <div className="header">Informacion del Agente de ventas:</div>
        <div className="image content">
          <div className="ui fluid card">
            <div className="content">
              <div className="header">{agent.name}</div>
              <div className="description">
                <form className="ui celled form">
                <div class="field">
                        <h4 class="ui dividing header"></h4>
                        <div class="three fields">
                          <div class="field">
                            <label>Nombre:</label>
                            <p>{agent.name+' '+agent.lastnames}</p>
                          </div>
                          <div class="field">
                            <label>Direccion:</label>
                            <p>{agent.address}</p>
                          </div>
                          <div class="field">
                            <label>Telefono:</label>
                            <p>{agent.phone}</p>
                          </div>
                          <div class="field">
                            <label>INE:</label>
                            <p>{agent.dni}</p>
                          </div>
                        </div>
                      </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="actions">
          <div className="ui black deny button">
            <i className="power off icon"></i>Salir
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ModalUpdateFrm;
