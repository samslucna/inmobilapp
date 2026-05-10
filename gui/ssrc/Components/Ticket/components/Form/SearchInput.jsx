import React, { Fragment, useState, useContext, useEffect } from "react";
import { ToolsContext } from "../../../../context/ToolsContext";

const SearchInput = () => {
  const { searchBy } = useContext(ToolsContext);
 
  
  return (
    <Fragment>
      <div className="ui right aligned category search item">
        <div className="ui transparent icon input">
          <input
            className="prompt"
            type="text"
            placeholder="Buscar..."
            onChange={(e) => searchBy(e, "tickets")}
          />
          <i className="search link icon"></i>
        </div>
      </div>
    </Fragment>
  );
};

export default SearchInput;
