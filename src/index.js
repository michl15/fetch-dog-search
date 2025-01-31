import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Routes, Route } from "react-router";
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorPage from './components/ErrorPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/error" element={<ErrorPage/>}/>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
