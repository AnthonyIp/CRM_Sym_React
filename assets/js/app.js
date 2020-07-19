import React from 'react';
import ReactDom from 'react-dom';
import NavBar from "./components/navbar/navbar.component";
import HomePage from "./pages/HomePage.component";
import {HashRouter, Switch, Route} from "react-router-dom";

import '../css/bootstrap.min.css';
import '../css/app.css';
import CustomersPage from "./pages/CustomersPage.component";

const App = () => {
    return (
        <HashRouter>
            <NavBar/>
            <main className="container pt-5">
                <Switch>
                    <HomePage exact path="/" component={HomePage}/>
                    <CustomersPage path="/customers" component={CustomersPage}/>
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement = document.getElementById('app');
ReactDom.render(<App/>, rootElement);
