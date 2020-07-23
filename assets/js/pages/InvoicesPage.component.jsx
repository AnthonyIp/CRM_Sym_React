import moment from "moment";
import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Pagination from "../components/pagination/pagination.component";
import InvoicesApi from "../services/invoicesApi";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger",
};
const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée",
};

const InvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 10;
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');


    /*Permet de récupérer la liste des factures*/
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesApi.findAll();
            setInvoices(data);
        } catch (error) {
            console.error(error.response);
        }
    };

    /*Au chargement, exécuter l'action*/
    useEffect(() => {
        fetchInvoices();
    }, []);

    /*Gestion du changement de page*/
    const handlePageChange = page => setCurrentPage(page);

    /*Gestion de la recherche*/
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    /*Gestion de la suppression de la facture*/
    const handleDelete = async id => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesApi.deleteById(id)
        } catch (error) {
            setInvoices(originalInvoices);
            console.error(error.response)
        }
    };

    /*Filtrage des factures en fonction de la recherche*/
    const filteredInvoices = invoices.filter(invoice =>
        invoice.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        invoice.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        invoice.amount.toString().includes(search.toLowerCase()) ||
        STATUS_LABELS[invoice.status].toLowerCase().includes(search.toLowerCase())
    );

    /*Pagination des données*/
    const paginationInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return (
        <div className="invoices-page">
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
            </div>

            <div className="form-group">
                <input type="text" className="form-control"
                       placeholder="Rechercher avec son nom de famille ou prénom ou email"
                       value={search}
                       onChange={handleSearch}
                />
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th className="text-center">Date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {
                    paginationInvoices.map(invoice => {
                        return (
                            <tr key={invoice.id}>
                                <td>{invoice.chrono}</td>
                                <td>
                                    <Link to={"/customers/" + invoice.customer.id}>
                                        {invoice.customer.firstName} {invoice.customer.lastName}
                                    </Link>
                                </td>
                                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                                <td className="text-center">
                                    <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                                        {STATUS_LABELS[invoice.status]}
                                    </span>
                                </td>
                                <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                                <td>
                                    <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-2">
                                        Editer
                                    </Link>
                                    <button onClick={() => handleDelete(invoice.id)} className="btn btn-sm btn-danger">
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>

            {itemsPerPage < filteredInvoices.length && (
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage}
                            length={filteredInvoices.length} onPageChanged={handlePageChange}
                />
            )}

        </div>
    );
};

export default InvoicesPage;
