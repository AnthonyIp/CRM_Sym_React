import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Field from "../components/field/field.component";
import UsersAPI from "../services/usersApi";

const RegisterPage = ({ history }) => {
    const [user, setUser] = useState({firstName: '', lastName: '', email: '', password: '', passwordConfirm: ''});
    const [errors, setErrors] = useState({firstName: '', lastName: '', email: '', password: '', passwordConfirm: ''});

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]: value});
    };

    //Gestion de la soumission
    const handleSubmit = async event => {
        event.preventDefault();
        const apiErrors = {};

        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
            setErrors(apiErrors);
            return;
        }

        try {
            await UsersAPI.register(user);
            setErrors({});
            history.replace("/login");
        } catch (err) {
            const { violations } = err.response.data;

            if (violations) {
                violations.forEach( ({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            }
        }
    }

    return (
        <div className={`register-page`}>
            <h1 className={`mb-5`}>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    name={`lastName`}
                    label={`Nom de famille`}
                    placeholder={`Veuillez saisir votre nom de famille`}
                    error={errors.lastName}
                    user={user.lastName}
                    onChange={handleChange}
                />
                <Field
                    name={`firstName`}
                    label={`Prénom`}
                    placeholder={`Veuillez saisir votre prénom`}
                    error={errors.firstName}
                    user={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name={`email`}
                    label={`Email`}
                    placeholder={`Veuillez saisir votre adresse email`}
                    error={errors.email}
                    user={user.email}
                    onChange={handleChange}
                />
                <Field
                    name={`password`}
                    label={`Mot de passe`}
                    placeholder={`Veuillez saisir votre mot de passe`}
                    type={"password"}
                    error={errors.password}
                    user={user.password}
                    onChange={handleChange}
                />
                <Field
                    name={`passwordConfirm`}
                    label={`Confirmation du mot de passe`}
                    placeholder={`Veuillez confirmer votre mot de passe`}
                    type={"password"}
                    error={errors.passwordConfirm}
                    user={user.passwordConfirm}
                    onChange={handleChange}
                />
                <div className="form-group text-center">
                    <Link to="/login" className="btn btn-primary mr-2">J'ai déjà un compte</Link>
                    <button type="submit" className={`btn btn-success`}>Enregistrer</button>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
