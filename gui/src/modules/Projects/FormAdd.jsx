import { Fragment } from "react";
import "sweetalert2/dist/sweetalert2.css";

import ProjectStore from "../../store/ProjectStore";
import projectValidateValidate from "../../validator/projectValidate";
import useValidatorForm from "../../hooks/useValidatorForm";

const FormAdd = () => {
  const { state, errors, handleChange, handleSubmit, handleBlur } =
    useValidatorForm(
      ProjectStore.project,
      projectValidateValidate,
      ProjectStore.addProject,
    );

  const { id, name } = state;

  const saveProject = async (e) => {
    handleSubmit(e);
  };

  return (
    <Fragment>
      <div className="ui grid container">
        <div className="row">
          <div className="sixteen wide column">
            <h3 className="ui dividing header">
              {id === null ? "Nuevo Proyecto" : "Editar Proyecto"}
            </h3>
          </div>
        </div>

        <div className="ui page dimmer" id="loader">
          <div className="content">
            <h2 className="ui inverted icon header">
              <div className="ui large text loader">Loading..</div>
            </h2>
          </div>
        </div>

        <div className="row">
          <div className="sixteen wide column">
            <form className="ui celled form">
              <div className="two fields">
                <div className="field">
                  <div className="field">
                    <label>Nombre:</label>
                    <div className="ui small icon input">
                      <input
                        onChange={handleChange}
                        value={name}
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        onBlur={handleBlur}
                      />
                    </div>
                    {errors.name && (
                      <div className="ui pointing red basic label">
                        {errors.name}
                      </div>
                    )}
                  </div>
                  

                  <br />
                  <div className="ui right icon buttons">
                    <div
                      onClick={(e) => saveProject(e)}
                      id="add"
                      className="ui green button"
                    >
                      <i className="save icon"></i>
                      Guardar
                    </div>

                    <div
                      onClick={() => {
                        ProjectStore.setHiddenForm(false);
                        ProjectStore.setEditing(false);
                      }}
                      id="cln"
                      className="ui gray button"
                    >
                      <i className="window close icon"></i>
                      Cancelar
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

      
      </div>
    </Fragment>
  );
};

export default FormAdd;
