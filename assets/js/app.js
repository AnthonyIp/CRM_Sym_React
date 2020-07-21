import React from 'react';
import ReactDom from 'react-dom';
import {HashRouter, Route, Switch} from "react-router-dom";

import '../css/app.css';
import '../css/bootstrap.min.css';

import NavBar from "./components/navbar/navbar.component";
import CustomersPage from "./pages/CustomersPage.component";
import HomePage from "./pages/HomePage.component";
import InvoicesPage from "./pages/InvoicesPage.component";

const App = () => {
    return (
        <HashRouter>
            <NavBar/>
            <main className="container pt-5">
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route path="/customers" component={CustomersPage}/>
                    <Route path="/invoices" component={InvoicesPage}/>
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement = document.getElementById('app');
ReactDom.render(<App/>, rootElement);
