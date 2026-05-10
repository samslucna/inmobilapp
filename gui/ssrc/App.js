import React, { Fragment } from "react";

import "semantic-ui-css/semantic.min.css";
import Auth from "./Components/Auth";
import jquery from "jquery";
import ToolsProvider from "./context/ToolsContext";
import LoginProvider from "./context/LoginContext";
import RenderProvider from "./context/RenderContext";


window.$ = window.jQuery = jquery;


function App() {
  return (
    <Fragment>
      <div className="App">
        <ToolsProvider>
          <LoginProvider>
            <RenderProvider>
              <Auth />
            </RenderProvider>
          </LoginProvider>
        </ToolsProvider>
      </div>
    </Fragment>
  );
}

export default App;
