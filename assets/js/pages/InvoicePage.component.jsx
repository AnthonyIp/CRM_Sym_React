import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import Field from "../components/field/field.component";
import FormContentLoader from "../components/form-content-loader/form-content-loader.component";
import Select from "../components/select/select.component";
import CustomersAPI from "../services/customersApi";
import InvoicesAPI from "../services/invoicesApi";

const InvoicePage = ({match, history}) => {
    const {id = "new"} = match.params;
    const [invoice, setInvoice] = useState({amount: "", customer: "", status: "SENT"});
    const [customers, setCustomers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState({amount: '', customer: '', status: ''});
    const [loading, setLoading] = useState(true);

    // Récupération des clients
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
            if (!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            toast.error("Impossible de charger les clients");
            history.replace("/invoices");
        }
    };

    // Récupération d'une facture
    const fetchInvoice = async id => {
        try {
            const {amount, status, customer} = await InvoicesAPI.findById(id);
            setInvoice({amount, status, customer: customer.id});
            setLoading(false);
        } catch (err) {
            toast.error("Impossible de charger la facture demandée");
            history.replace('/invoices');
        }
    };

    // Récupération de la liste des clients à chaque chargement du composant
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Récupération de la bonne facture quand l'identifiant de l'URL change
    useEffect(() => {
        if (id !== 'new') {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]: value});
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if (editing) {
                await InvoicesAPI.update(id, invoice);
                toast.success("La facture a bien été modifiée");
            } else {
                await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été enregistrée");
                history.replace('/invoices');
            }
        } catch ({response}) {
            const {violations} = response.data;

            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire");
            }
        }
    };

    return (
        <div className={`invoice-page`}>
            {!editing && <h1>Création d'une facture</h1> || <h1>Modification de la facture</h1>}

            {loading && <FormContentLoader/>}

            {!loading && (
                <form onSubmit={handleSubmit}>
                    <Field
                        label={`Montant`}
                        name={`amount`}
                        type={`number`}
                        placeholder={`Montant de la facture`}
                        onChange={handleChange}
                        value={invoice.amount}
                        error={errors.amount}
                    />
                    <Select
                        name={`customer`}
                        label={`Client`}
                        value={invoice.customer}
                        error={errors.customer}
                        onChange={handleChange}
                    >
                        {
                            customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.firstName} {customer.lastName}
                                </option>
                            ))
                        }
                    </Select>
                    <Select
                        name="status"
                        label="Statut"
                        value={invoice.status}
                        error={errors.status}
                        onChange={handleChange}
                    >
                        <option value="SENT">Envoyée</option>
                        <option value="PAID">Payée</option>
                        <option value="CANCELLED">Annulée</option>
                    </Select>
                    <div className="form-group text-center">
                        <Link to={`/invoices`} className="btn btn-danger mr-2">Retour à la liste</Link>
                        <button type="submit" className={`btn btn-success`}>Enregistrer</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default InvoicePage;
