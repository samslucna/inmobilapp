import React, { Fragment, useContext } from "react";
import { ToolsContext } from "../../../../context/ToolsContext";
//import "sweetalert2/dist/sweetalert2.css";

const FrmModalOne = ({ titlesearch, table, queryTable, setQueryTable }) => {
  const { searchDatas, numberToString, getDataModal } =
    useContext(ToolsContext);

  const searchBy = async (e) => {
    e.preventDefault();
    const { value } = e.target;
    console.log(value);

    if (value !== "") {
      let seachRender = await searchDatas(
        "/api/" + table + "/search?name=",
        value
      );

      //console.log(seachRender)
      setQueryTable(seachRender);
    }
  };

  return (
    <Fragment>
      <div className="row">
        <div class="ui basic modal contract">
          <div key={titlesearch} class="ui icon header">
            <i class="archive icon"></i>
            {titlesearch}
          </div>
          <div class="content">
            <div className="row">
              <div class="ui top attached menu">
                <div class="right menu">
                  <div class="ui right aligned category search item">
                    <div class="ui transparent icon input">
                      <input
                        class="ui input"
                        type="text"
                        placeholder="Buscar..."
                        onChange={searchBy}
                      />
                      <div class="ui basic modal">
                        <div class="ui icon header">
                          <i class="archive icon"></i>
                          Archive Old Messages
                        </div>
                        <div class="content">
                          <p>
                            Your inbox is getting full, would you like us to
                            enable automatic archiving of old messages?
                          </p>
                        </div>
                        <div class="actions">
                          <div className="ui red basic cancel inverted button">
                            <i className="remove icon"></i>
                            No
                          </div>
                          <div className="ui green ok inverted button">
                            <i className="checkmark icon"></i>
                            Yes
                          </div>
                        </div>
                      </div>
                      <i className="search link icon"></i>
                    </div>
                    <div className="results">jjjjj</div>
                  </div>
                </div>
              </div>
              <div className="ui bottom attached segment">
                <table className="ui stackable small table">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>$</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryTable !== [] && queryTable !== undefined
                      ? queryTable.map((data) => {
                          return (
                            <tr key={"r" + data.id}>
                              <td>{data.id}</td>
                              <td>{data.name}</td>
                              <td>{numberToString(data.amount)}</td>
                              <td>
                                <div class="ui mini basic icon buttons">
                                  <button
                                    id={"show" + data.id}
                                    onClick={(e) => {
                                      //setData(data.id);
                                    }}
                                    className="ui  button"
                                  >
                                    <i className="plus teal icon"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={6}>
                        <div className="ui divider"></div>
                        <div className="ui icon buttons">
                          {/* {renderPagination(pagination.total)} */}
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          <div class="actions">
            <div className="ui red basic cancel inverted button">
              <i className="remove icon"></i>
              No
            </div>
            <div className="ui green ok inverted button">
              <i className="checkmark icon"></i>
              Yes
            </div>
          </div>

          <div class="field">
            <label>Send Receipt To:</label>
            <div class="ui fluid multiple search selection dropdown">
              <input type="hidden" name="receipt" />
              <i class="dropdown icon"></i>
              <div class="default text">Saved Contacts</div>
              <div class="menu">
                <div class="item" data-value="jenny" data-text="Jenny">
                  <img
                    class="ui mini avatar image"
                    src="/images/avatar/small/jenny.jpg"
                  />
                  Jenny Hess
                </div>
                <div class="item" data-value="elliot" data-text="Elliot">
                  <img
                    class="ui mini avatar image"
                    src="/images/avatar/small/elliot.jpg"
                  />
                  Elliot Fu
                </div>
                <div class="item" data-value="stevie" data-text="Stevie">
                  <img
                    class="ui mini avatar image"
                    src="/images/avatar/small/stevie.jpg"
                  />
                  Stevie Feliciano
                </div>
                <div class="item" data-value="christian" data-text="Christian">
                  <img
                    class="ui mini avatar image"
                    src="/images/avatar/small/christian.jpg"
                  />
                  Christian
                </div>
                <div class="item" data-value="matt" data-text="Matt">
                  <img
                    class="ui mini avatar image"
                    src="/images/avatar/small/matt.jpg"
                  />
                  Matt
                </div>
                <div class="item" data-value="justen" data-text="Justen">
                  <img
                    class="ui mini avatar image"
                    src="/images/avatar/small/justen.jpg"
                  />
                  Justen Kitsune
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default FrmModalOne;
