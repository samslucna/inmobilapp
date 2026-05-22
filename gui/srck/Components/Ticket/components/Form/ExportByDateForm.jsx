import { Fragment, useContext } from "react";

import { TicketContext } from "../../../../context/TicketContext";
import { ToolsContext } from "../../../../context/ToolsContext";



const ExportByDateForm = ({}) => {
  const { btnExport, updateRangeDate,rangeDate } = useContext(TicketContext);
  const { renderDate } = useContext(ToolsContext);
  return (
    <Fragment>
      <div className="ui right aligned category search item">
        <div class="ui action input">
          <input type="date" onChange={updateRangeDate} name="dates" />
          <input type="date" onChange={updateRangeDate} name="datee" />
          <button
            class="ui teal right labeled icon button"
            onClick={(e) =>
              btnExport(
                e,
                "/api/tickets/export/xls/date",
                "xls",
                "bydate",
                "Todos los contratos por fecha de "+renderDate(rangeDate.dates)+"-"+renderDate(rangeDate.datee),
              )
            }
          >
            Buscar
            <i
              class="search icon"
              onClick={(e) =>
                btnExport(
                  e,
                  "/api/tickets/export/xls/date",
                  "xls",
                  "bydate",
                  "contratos fecha de a ",
                )
              }
            ></i>
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default ExportByDateForm;
