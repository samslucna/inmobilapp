import { Fragment, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import ProjectMain from "./mainproject";
import StageMain from "../stage";
import BlocksMain from "../blocks";

const FormProjects = () => {

  const [view, setView] = useState("projects");


  const onChangeView = (e) => {
    e.preventDefault();
    const { id } = e.target;
    console.log(id);
    setView(id);
  };

 const handlerPage = () => {
 
    switch (view) {
      case "proyectos":
        return <ProjectMain />;

      case "etapas":
        return <StageMain />;

      case "manzanas":
        return <BlocksMain />;
      default:
        return null

    }
  };
  return (
    <Fragment>
      <div className="image content">
        <div className="ui fluid card">
          <div className="content">
            <div class="ui internally celled grid">
              {/*               <div class="row">
                <div class="sixteen wide computer column">
                  <div class="ui mini statistics">
                    <div class="statistic">
                      <div class="value"> {contract.id}</div>
                      <div class="label">Contrato:</div>
                    </div>
                    <div class="statistic">
                      <div class="value">
                        {" "}
                        {contract.buyer.name + " " + contract.buyer.lastnames}
                      </div>
                      <div class="label">Cliente</div>
                    </div>
                    <div class="statistic">
                      <div class="value">{contract.property.name}</div>
                      <div class="label">Lote</div>
                    </div>
                    <div class="statistic">
                      <div class="value">{numberToString(contract.amount)}</div>
                      <div class="label">Costo Lote($)</div>
                    </div>
                    <div class="statistic">
                      <div class="value">{numberToString(detailsContract.totalTickets)}</div>
                      <div class="label">Abonado($)</div>
                    </div>
                    <div class="statistic">
                      <div class="value">{contract.amount === detailsContract.totalTickets ? <p>Finiquitado</p> : <p>Pagando..</p> }</div>
                      <div class="label">Status</div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div class="row">
                
                <div class="sixteen wide mobile three wide computer column">
                  <div
                    class="ui primary attached button"
                    id="proyectos"
                    onClick={(e) => {
                      onChangeView(e);
                    }}
                  >
                    Proyectos
                  </div>
                 
                  <div
                    class="ui primary attached button"
                    id="etapas"
                    onClick={(e) => {
                      onChangeView(e);
                    }}
                  >
                    Etapas
                  </div>
                  <div
                    class="ui black attached button"
                    id="manzanas"
                    onClick={(e) => {
                      onChangeView(e);
                    }}
                  >
                    Manzanas o Bloques
                  </div>
                </div>

                <div class="sixteen wide mobile thirteen wide computer column">
                  {handlerPage()}
                </div>
              </div>
            </div>

            <div className="description"></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default FormProjects;
