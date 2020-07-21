import React, {useEffect, useState} from 'react';
import axios from "axios";
import Pagination from "../components/pagination/pagination.component";

const CustomersPageWithPagination = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0)
    const [loading, setLoading] = useState(true)
    const itemsPerPage = 10;

    useEffect(() => {
        axios
            .get(`/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(res => {
                setCustomers(res.data['hydra:member']);
                setTotalItems(res.data['hydra:totalItems']);
                setLoading(false);
            })
            .catch(error => console.log(error.response));
    }, [currentPage]);

    const handleDelete = (id) => {
        /*Copie de la liste original*/
        const originalCustomers = [...customers];
        /*On enlève la ligne a supprimée */
        setCustomers(customers.filter(customer => customer.id !== id));
        /*On supprime depuis la bdd et si il y a une erreur on remet l'ancienne liste*/
        axios
            .delete('http://localhost:8000/api/customers/' + id)
            .then((res) => console.log('ok'))
            .catch(error => {
                setCustomers(originalCustomers);
                console.log(error.response)
            });

    }

    const handlePageChange = (page) => {
        setLoading(true);
        setCurrentPage(page);
    }

    return (
        <div className="customers-page-with-pagination">
            <h1>Liste des clients (pagination)</h1>
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
                    loading && (
                        <tr>
                            <td>Chargement...</td>
                        </tr>
                    )
                }
                {
                    !loading && customers.map(customer => {
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

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} onPageChanged={handlePageChange}/>
        </div>
    );
};

export default CustomersPageWithPagination;
