import "semantic-ui-css/semantic.min.css";

export default function TableSem({datasTable}) {
  return (
    <>
     <table key={"property"} className="ui stackable small table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Manzana</th>
                  <th>$</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {datasTable !== [] && datasTable !== undefined
                  ? datasTable.map((data) => {
                      return (
                        <tr key={"r" + data.id}>
                          <td>{data.id}</td>
                          <td>{data.name}</td>
                          <td>{data.description}</td>
                          <td>{data.block}</td>
                          <td>{data.amount_init}</td>
                          <td>
                            <div
                              key={"edit" + data.id}
                              className="ui mini basic icon buttons"
                            >
                              <button id="delete" className="ui  button">
                                <i
                                  id={"del" + data.id}
                                  onClick={(e) => {
                                    //removeData(e, data.id);
                                  }}
                                  className="trash red icon"
                                ></i>
                              </button>
                              <button className="ui  button">
                                <i
                                  id={"edit" + data.id}
                                  onClick={(e) => {
                                    //btnEdit(e, data);
                                  }}
                                  className="edit blue icon"
                                ></i>
                              </button>
                              <button className="ui  button">
                                <i
                                  id={"view" + data.id}
                                  onClick={(e) => {
                                    //showModal(e, data);
                                  }}
                                  className="eye blue icon"
                                ></i>
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
                      {}
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
    </>
  )
};