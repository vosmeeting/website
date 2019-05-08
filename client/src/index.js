import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import RegApp from './App';
import * as serviceWorker from "./serviceWorker";
import './index.css';

ReactDOM.render(
  <Router>
    <RegApp />
  </Router>,
  document.getElementById('registerApp')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();