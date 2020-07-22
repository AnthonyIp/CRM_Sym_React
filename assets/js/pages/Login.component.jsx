import React, {useContext, useState} from 'react';
import AuthContext from "../contexts/AuthContext";
import AuthAPI from "../services/authApi";

const LoginPage = ({history}) => {
    const [credentials, setCredentials] = useState({username: '', password: ''});
    const [error, setError] = useState('');
    const {setIsAuthenticated} = useContext(AuthContext);

    /*Gestion des champs*/
    const handleCredentials = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCredentials({...credentials, [name]: value})
    }

    /*Gestion de l'authentification*/
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await AuthAPI.authenticate(credentials);
            setError('');
            setIsAuthenticated(true);
            history.replace('/customers');
        } catch (error) {
            console.error(error.response);
            setError('Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas');
        }
    }

    return (
        <div className={`login-page`}>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input type="email" className={"form-control" + (error && " is-invalid")} name={`username`}
                           id="username"
                           placeholder="Veuillez entrer votre adresse email"
                           value={credentials.username} onChange={handleCredentials}
                    />
                    {
                        error && <p className="invalid-feedback">
                            {error}
                        </p>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" className="form-control" name={`password`} id="password"
                           placeholder="Veuillez entrer votre mot de passe"
                           value={credentials.password} onChange={handleCredentials}
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Connexion</button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;

