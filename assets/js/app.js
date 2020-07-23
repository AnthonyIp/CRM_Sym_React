import React, {useState} from 'react';
import ReactDom from 'react-dom';
import {HashRouter, Route, Switch, withRouter} from "react-router-dom";

import '../css/app.css';
import '../css/bootstrap.min.css';

import NavBar from "./components/navbar/navbar.component";
import PrivateRoute from "./components/privateRoute/private-route.component";
import AuthContext from "./contexts/AuthContext";
import CustomerPage from "./pages/CustomerPage.component";
import CustomersPage from "./pages/CustomersPage.component";
import HomePage from "./pages/HomePage.component";
import InvoicePage from "./pages/InvoicePage.component";
import InvoicesPage from "./pages/InvoicesPage.component";
import LoginPage from "./pages/Login.component";
import RegisterPage from "./pages/RegisterPage.component";
import AuthAPI from './services/authApi';

AuthAPI.setup();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());
    const NavbarWithRouter = withRouter(NavBar);
    const contextValue = {
        isAuthenticated,
        setIsAuthenticated
    }

    return (
        <AuthContext.Provider value={contextValue}>
            <HashRouter>
                <NavbarWithRouter/>
                <main className="container pt-5">
                    <Switch>
                        <Route exact path="/" component={HomePage}/>
                        <Route path="/register" component={RegisterPage}/>
                        <Route path="/login" render={(props) =>
                            isAuthenticated
                                ? props.history.goBack()
                                : <LoginPage onLogin={setIsAuthenticated} {...props} />
                        }/>
                        <PrivateRoute path="/customers/:id" component={CustomerPage}/>
                        <PrivateRoute path="/customers" component={CustomersPage}/>
                        <PrivateRoute path="/invoices/:id" component={InvoicePage}/>
                        <PrivateRoute path="/invoices" component={InvoicesPage}/>
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
};

const rootElement = document.getElementById('app');
ReactDom.render(<App/>, rootElement);
