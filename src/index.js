import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider, createStore } from 'easy-peasy';
import model from './model';
import App from './App';

const store = createStore(model);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  rootElement
);
