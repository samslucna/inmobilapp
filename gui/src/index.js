import { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import $ from 'jquery';
window.jQuery = window.$ = $;


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Fragment>
    <App />
  </Fragment>
);