
import jquery from 'jquery';
import ('semantic-ui-css');
window.$ = window.jQuery = jquery;




function App() {
  return (
    <div className="App">
      <div class="ui celled grid">
      <h3 className="ui header">
                  <i className="building icon"></i>
                  <div className="content">
                    InmobilAp
                    <div className="sub header">Manage your preferences</div>
                  </div>
                </h3>
                <div className="ui basic fluid buttons">
              <a className="active item">
             
              </a>

              <div className="ui button">
                {" "}
                <i className="home icon"></i> Inicio
              </div>
              <div className="ui button">
                <i className="building icon"></i> Inmbuebles
              </div>
              <div className="ui button">
                <i className="users icon"></i> Inmbuebles
              </div>
              <div className="ui button">
                <i className="ticket alternative icon"></i> Inmbuebles
              </div>
            </div>
        <div className="row">
          <div className="two wide column">
            <div className="ui vertical basic fluid buttons">
              <a className="active item">
             
              </a>

              <div className="ui button">
                {" "}
                <i className="home icon"></i> Inicio
              </div>
              <div className="ui button">
                <i className="building icon"></i> Inmbuebles
              </div>
              <div className="ui button">
                <i className="users icon"></i> Inmbuebles
              </div>
              <div className="ui button">
                <i className="ticket alternative icon"></i> Inmbuebles
              </div>
            </div>
          </div>

          <div className="fourteen wide column">
            <div className="ui celled grid">
              <div className="row">
                <div className="five wide column">
                  <form class="ui form">
                    <h4 class="ui dividing header">
                      Registra inmueble o propiedad
                    </h4>
                    <div class="field">
                      <label>Nombre:</label>
                      <div class="field">
                        <input type="text" name="name" placeholder="Nombre" />
                      </div>
                      <label>Descripción:</label>
                      <div class="field">
                        <textarea
                          rows="2"
                          type="text"
                          name="description"
                          placeholder="........."
                        />
                      </div>
                    </div>
                    <div class="field">
                      <label>Direccion:</label>
                      <div class="fields">
                        <input
                          type="text"
                          name="address"
                          placeholder="Calle, #Numero Colonia"
                        />
                      </div>
                    </div>
                    <h4 class="ui dividing header">Caracteristicas:</h4>
                    <div class="four fields">
                      <div class="field">
                        <label>Habitaciones:</label>
                        <input placeholder="First Name" type="text" />
                      </div>
                      <div class="field">
                        <label>Construido:</label>
                        <input placeholder="Last Name" type="text" />
                      </div>
                      <div class="field">
                        <label>Baños:</label>
                        <input placeholder="Last Name" type="text" />
                      </div>
                      <div class="field">
                        <label>Terreno M2:</label>
                        <input placeholder="Last Name" type="text" />
                      </div>
                    </div>

                    <div className="field">
                      <label>Precio de compra($):</label>
                      <input type="text" name="amount" placeholder="0.00" />
                    </div>
                    <div class="ui aligned right icon buttons">
                      <div className="ui red button">
                        <i className="trash icon"></i>
                        Eliminar
                      </div>
                      <div className="ui green button">
                        <i className="save icon"></i>
                        Guardar
                      </div>
                      <div className="ui teal button">
                        <i className="window close icon"></i>
                        Cancelar
                      </div>
                    </div>
                  </form>
                </div>
                <div className="eleven wide column">
                  <div class="ui top attached menu">
                    <div class="ui dropdown icon item">
                      <i class="wrench icon"></i>
                      <div class="menu">
                        <div class="item">
                          <i class="dropdown icon"></i>
                          <span class="text">New</span>
                          <div class="menu">
                            <div class="item">Document</div>
                            <div class="item">Image</div>
                          </div>
                        </div>
                        <div class="item">Open...</div>
                        <div class="item">Save...</div>
                        <div class="item">Edit Permissions</div>
                        <div class="divider"></div>
                        <div class="header">Export</div>
                        <div class="item">Share...</div>
                      </div>
                    </div>
                    <div class="right menu">
                      <div class="ui right aligned category search item">
                        <div class="ui transparent icon input">
                          <input
                            class="prompt"
                            type="text"
                            placeholder="Search animals..."
                          />
                          <i class="search link icon"></i>
                        </div>
                        <div class="results"></div>
                      </div>
                    </div>
                  </div>
                  <div class="ui bottom attached segment">
                  <table class="ui very  table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Another Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>John</td>
                        <td>Approved</td>
                        <td>Approved</td>
                        <td>None</td>
                      </tr>
                      <tr>
                        <td>Jamie</td>
                        <td>Approved</td>
                        <td>Approved</td>
                        <td>Requires call</td>
                      </tr>
                      <tr>
                        <td>John</td>
                        <td>Approved</td>
                        <td>Approved</td>
                        <td>None</td>
                      </tr>
                      <tr>
                        <td>Jamie</td>
                        <td>Approved</td>
                        <td>Approved</td>
                        <td>Requires call</td>
                      </tr>
                      <tr>
                        <td>John</td>
                        <td>Approved</td>
                        <td>Approved</td>
                        <td>None</td>
                      </tr>
                      <tr>
                        <td>Jamie</td>
                        <td>Approved</td>
                        <td>Approved</td>
                        <td>Requires call</td>
                      </tr>
                      <tr>
                        <td>John</td>
                        <td>Approved</td>
                        <td>Approved</td>
                        <td>None</td>
                      </tr>
                      <tr>
                        <td>Jamie</td>
                        <td>Approved</td>
                        <td>Approved</td>
                        <td>Requires call</td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
          
      
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
