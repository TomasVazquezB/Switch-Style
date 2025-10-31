import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import ShopContextProvider from './context/ShopContext.jsx'
import { DataProvider } from './context/DataContext';
import { BrowserRouter } from 'react-router-dom';

import '../index.css'
import './fixes/overrides.css'

import { ThemeProvider } from './context/ThemeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <DataProvider>
      <ShopContextProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ShopContextProvider>
    </DataProvider>
  </BrowserRouter>
);
