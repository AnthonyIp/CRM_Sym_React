import moment from "moment";
import React, {useEffect, useState} from 'react';
import Pagination from "../components/pagination/pagination.component";
import InvoicesApi from "../services/invoicesApi";

const InvoicesPage = () => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');
    const STATUS_CLASSES = {
        PAID: "success",
        SENT: "primary",
        CANCELLED: "danger",
    };
    const STATUS_LABELS = {
        PAID: "Payé",
        SENT: "Envoyé",
        CANCELLED: "Annulé",
    }

    /*Permet de récupérer la liste des factures*/
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesApi.findAll();
            await setInvoices(data);
        } catch (error) {
            console.error(error.response);
        }
    }

    /*Au chargement, exécuter l'action*/
    useEffect(() => {
        fetchInvoices();
    }, []);

    /*Gestion de la suppression de la facture*/
    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesApi.deleteById(id)
        } catch (error) {
            setInvoices(originalInvoices);
            console.error(error.response)
        }
    }

    /*Gestion du changement de page*/
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    /*Gestion de la recherche*/
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }
    /*Filtrage des factures en fonction de la recherche*/
    const filteredInvoices = invoices.filter(invoice =>
        invoice.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        invoice.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        invoice.amount.toString().includes(search.toLowerCase()) ||
        STATUS_LABELS[invoice.status].toLowerCase().includes(search.toLowerCase())
    );

    const itemsPerPage = 10;
    /*Pagination des données*/
    const paginationInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return (
        <div className="invoices-page">
            <h1 className="mb-5">Liste des factures</h1>

            <div className="form-group">
                <input type="text" className="form-control"
                       placeholder="Rechercher avec son nom de famille ou prénom ou email" onChange={handleSearch}/>
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
                                <td><a href="">{invoice.customer.firstName} {invoice.customer.lastName}</a></td>
                                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                                <td className="text-center">
                                    <span
                                        className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                                </td>
                                <td className="text-center">{invoice.amount.toLocaleString()} &euro;</td>
                                <td>
                                    <button onClick={() => handleDelete(invoice.id)}
                                            className="btn btn-sm btn-primary mr-2">
                                        Editer
                                    </button>
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
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredInvoices.length}
                            onPageChanged={handlePageChange}/>
            )}

        </div>
    );
};

export default InvoicesPage;
