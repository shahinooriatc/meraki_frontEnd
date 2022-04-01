import React from "react";
import './App.css';
import Routes from "./routes";
import {ThemeProvider} from "@mui/material";
import theme from "./theme";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {ConnectedRouter} from "connected-react-router";
import {history} from "./store";

export default function App() {
  return (
      <ThemeProvider theme={theme}>
        <ToastContainer autoClose={3000}/>
        <ConnectedRouter history={history}>
          <Routes/>
        </ConnectedRouter>
      </ThemeProvider>
  );
}
