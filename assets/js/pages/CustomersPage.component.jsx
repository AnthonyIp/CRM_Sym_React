import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import Pagination from "../components/pagination/pagination.component";
import TableLoader from "../components/table-loader/table-loader.component";
import CustomersApi from '../services/customersApi';

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    /*Permet de récupérer la liste des customers*/
    const fetchCustomers = async () => {
        try {
            const data = await CustomersApi.findAll();
            await setCustomers(data);
            setLoading(false);
        } catch (error) {
            toast.error("Impossible de charger les clients");
        }
    }

    /*Au chargement, exécuter l'action*/
    useEffect(() => {
        fetchCustomers();
    }, []);

    /*Gestion de la suppression du client*/
    const handleDelete = async (id) => {
        /*Copie de la liste original*/
        const originalCustomers = [...customers];
        /*On enlève la ligne a supprimée */
        setCustomers(customers.filter(customer => customer.id !== id));
        /*On supprime depuis la bdd et si il y a une erreur on remet l'ancienne liste*/
        try {
            await CustomersApi.deleteById(id)
            toast.success("Le client a bien été supprimé");
        } catch (error) {
            setCustomers(originalCustomers);
            toast.error("La suppression du client n'a pas pu fonctionner");
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
    /*Filtrage des customers en fonction de la recherche*/
    const filteredCustomers = customers.filter(customer =>
        customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        (customer.company && customer.company.toLowerCase().includes(search.toLowerCase()))
    );

    const itemsPerPage = 10;
    /*Pagination des données*/
    const paginationCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage);

    return (
        <div className="customers-page">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Liste des clients</h1>
                <Link to={'/customers/new'} className={`btn btn-primary`}>Créer un client</Link>
            </div>

            <div className="form-group">
                <input type="text" className="form-control"
                       placeholder="Rechercher avec son nom de famille ou prenom ou email" onChange={handleSearch}/>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th/>
                </tr>
                </thead>
                {!loading && (
                    <tbody>
                    {
                        paginationCustomers.map(customer => {
                            return (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td><Link
                                        to={"/customers/" + customer.id}>{customer.firstName} {customer.lastName}</Link>
                                    </td>
                                    <td>{customer.email}</td>
                                    <td>{customer.company}</td>
                                    <td className="text-center"><span
                                        className="badge badge-primary">{customer.invoices.length}</span>
                                    </td>
                                    <td className="text-center">{customer.totalAmount.toLocaleString()} &euro;</td>
                                    <td>
                                        <button disabled={customer.invoices.length > 0}
                                                onClick={() => handleDelete(customer.id)}
                                                className="btn btn-sm btn-danger">
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                )}
            </table>

            {loading && <TableLoader/>}
            {itemsPerPage < filteredCustomers.length && (
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length}
                            onPageChanged={handlePageChange}/>
            )}

        </div>
    );
};

export default CustomersPage;
