import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import AuthAPI from "../../services/authApi";
import AuthContext from "../../contexts/AuthContext";

const NavBar = ({history}) => {
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        history.push('/login');
    }

    return (
        <div className="navbar-component">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink className="navbar-brand" to={'/'}>SymReact</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03"
                        aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor03">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to={'/customers'}>Client</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={'/invoices'}>Factures</NavLink>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        {
                            (!isAuthenticated &&
                                (
                                    <>
                                        <li className="nav-item">
                                            <NavLink to={'/register'} className="nav-link">Inscription</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to={'/login'} className="btn btn-secondary">Connexion</NavLink>
                                        </li>
                                    </>
                                )) || (
                                <>
                                    <li className="nav-item">
                                        <button className="btn btn-danger" onClick={handleLogout}>Déconnexion
                                        </button>
                                    </li>

                                </>
                            )

                        }


                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;
