import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Field from "../components/field/field.component";
import FormContentLoader from "../components/form-content-loader/form-content-loader.component";
import CustomerAPI from "../services/customersApi";
import { toast } from "react-toastify";

const CustomerPage = ({match, history}) => {
    const {id = "new"} = match.params;
    const [customer, setCustomer] = useState({lastName: '', firstName: '', email: '', company: ''});
    const [errors, setErrors] = useState({lastName: '', firstName: '', email: '', company: ''});
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company} = await CustomerAPI.findById(id);
            setCustomer({firstName, lastName, email, company});
            setLoading(false);
        } catch (err) {
            toast.error("Le client n'a pas pu être chargé");
            history.replace('/customers');
        }
    }

    useEffect(() => {
        if (id !== 'new') {
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]: value})
    }

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            setErrors({});
            if (editing) {
                await CustomerAPI.edit(id, customer);
                toast.success("Le client a bien été modifié");
            } else {
                await CustomerAPI.create(customer);
                toast.success("Le client a bien été créé");
                history.replace('/customers');
            }
        } catch ({response}) {
            const {violations} = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) =>
                    apiErrors[propertyPath] = message
                );
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire !");
            }
        }
    }

    return (
        <div className={`customer-page`}>
            {!editing && <h1>Création d'un client</h1> || <h1>Modification du client</h1>}

            {loading && <FormContentLoader />}
            {!loading && (
                <form onSubmit={handleSubmit}>
                <Field
                    label={`Nom de famille`}
                    name={`lastName`}
                    placeholder={`Veuillez entrer le nom de famille du client`}
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    label={`Prénom`}
                    name={`firstName`}
                    placeholder={`Veuillez entrer le prénom du client`}
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    label={`Email`}
                    name={`email`}
                    placeholder={`Veuillez entrer l'adresse email du client`}
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    label={`Entreprise`}
                    name={`company`}
                    placeholder={`Veuillez entrer l'entreprise du client`}
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />
                <div className="form-group text-center">
                    <Link to={`/customers`} className="btn btn-danger mr-2">Retour à la liste</Link>
                    <button type="submit" className={`btn btn-success`}>Enregistrer</button>
                </div>
            </form>
            )}
        </div>
    );
};

export default CustomerPage;
