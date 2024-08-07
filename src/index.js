import React from "react";
import { BrowserRouter} from "react-router-dom";
import ReactDOM from "react-dom/client";
import  { Provider} from "react-redux";
import App from "./App.js";
import CssBaseline from "@mui/material/CssBaseline/CssBaseline.js";
import "./index.scss";
import  store from './redux/store.js'
import {ThemeProvider} from "@mui/material";
import {theme} from "./theme.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <>
        <CssBaseline/>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Provider store={store}>
                    <App/>
                </Provider>
            </BrowserRouter>
        </ThemeProvider>
    </>
);
