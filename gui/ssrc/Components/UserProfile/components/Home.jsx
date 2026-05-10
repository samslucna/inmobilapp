import React, { Fragment } from "react";
import $ from "jquery";
//import "../css/styles.css";
window.$ = window.jQuery = $;

const Home = () => {
  return (
    <Fragment>
      <div className="ui celled grid">
        <div className="row">
          <div className="sixteen wide column">
            <h2>Home</h2>

         
            <button id="Salir" className="ui basic button">
              Salir
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
