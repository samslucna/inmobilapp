import React, { Fragment, useContext, useEffect } from "react";
import { ToolsContext } from "../../../context/ToolsContext";
import $ from "jquery";
import TableData from "./Table";
import DwnLfCnr from "./Menu/DwnLfCnr";

const Search = () => {
  const { datasTable  } = useContext(ToolsContext);
 
    useEffect(() => {
    $(".ui.dropdown.tableseach").dropdown();

  
  }, []);

  return (
    <Fragment>
      <div className="row">
        <div class="ui page dimmer" id="loader">
          <div class="content">
            <h2 class="ui inverted icon header">
              <div class="ui large text loader">Loading..</div>
            </h2>
          </div>
        </div>

        <h3>Recibos</h3>

        <br />
        <div id="searchdatas">
          <div className="ui bottom attached segment">
          
            <DwnLfCnr />
            <TableData dataTbl={datasTable} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Search;
