import axios from 'axios';
import {INVOICES_API} from "../config";

function findAll() {
    return axios.get(INVOICES_API).then(res => res.data['hydra:member']);
}

function findById(id) {
    return axios.get(INVOICES_API + "/" + id).then(res => res.data);
}

function create(invoice) {
    axios.post(INVOICES_API, {...invoice, customer: `/api/customers/${invoice.customer}`})
}

function update(id, invoice) {
    return axios.put(INVOICES_API + "/" + id, {...invoice, customer: `/api/customers/${invoice.customer}`});
}

function deleteById(id) {
    return axios.delete(INVOICES_API + "/" + id)
}


export default {
    findAll,
    findById,
    create,
    update,
    deleteById
}
