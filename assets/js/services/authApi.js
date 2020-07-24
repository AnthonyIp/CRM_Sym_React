import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {LOGIN_API} from "../config";
import CustomersApi from './customersApi';

/**
 *  Mise en place du token en en-tete de la requête
 *
 * @param {string} token Le token JST
 *  */
function setAxiosToken(token) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + token;
}

/* Verification de l'existence d'un token et le mettre en place pour les requêtes sinon */
function setup() {
    const token = window.localStorage.getItem('auth_token');

    if (token) {
        const {exp : expiration} = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

/* Déconnexion et suppression du token dans le localeStorage et Axios */
function logout() {
    window.localStorage.removeItem('auth_token');
    delete axios.defaults.headers['Authorization'];
}

/* Authentification de l'utilisateur et mise en place du token dans le localeStorage */
function authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            /*je stock le token dans le localstorage*/
            window.localStorage.setItem('auth_token', token);
            /*Je préviens a Axios qu'on a maintenant un header par default sur toutes nos futures requêtes HTTP*/
            setAxiosToken(token);
        })
}

/* Verification si on est authentifié ou pas */
function isAuthenticated() {
    const token = window.localStorage.getItem('auth_token');
    if (token) {
        const {exp: expiration} = jwtDecode(token);
        return expiration * 1000 > new Date().getTime();
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};
