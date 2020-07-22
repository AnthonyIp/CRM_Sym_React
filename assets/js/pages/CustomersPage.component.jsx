import React, {useEffect, useState} from 'react';
import Pagination from "../components/pagination/pagination.component";
import CustomersApi from '../services/customersApi';

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    /*Permet de récupérer la liste des customers*/
    const fetchCustomers = async () => {
        try {
            const data = await CustomersApi.findAll();
            await setCustomers(data);
        } catch (error) {
            console.error(error.response);
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
        } catch (error) {
            setCustomers(originalCustomers);
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
            <h1 className="mb-5">Liste des clients</h1>

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
                <tbody>
                {
                    paginationCustomers.map(customer => {
                        return (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.lastName + ' ' + customer.firstName}</td>
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
            </table>

            {itemsPerPage < filteredCustomers.length && (
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length}
                            onPageChanged={handlePageChange}/>
            )}

        </div>
    );
};

export default CustomersPage;
