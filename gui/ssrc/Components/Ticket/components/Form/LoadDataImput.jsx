import React, { Fragment, useState, useContext, useEffect } from "react";

import { TicketContext } from "../../../../context/TicketContext";

const LoadDataImput = ({}) => {
  const { onChangeImport, btnImport } = useContext(TicketContext);
  return (
    <Fragment>
      <div class="ui right aligned category search item">
        <input type="file" onChange={onChangeImport} name="file" />

        <button className="ui compact icon button">
          <i
            id={"uploader"}
            onClick={(e) => {
              btnImport(e, "/api/tickets/import");
            }}
            className="cloud upload blue icon"
          ></i>
        </button>
      </div>
    </Fragment>
  );
};

export default LoadDataImput;
