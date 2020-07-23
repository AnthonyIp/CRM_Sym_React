import axios from 'axios';

function findAll() {
    return axios.get('/api/invoices').then(res => res.data['hydra:member']);
}

function findById(id) {
    return axios.get('/api/invoices/' + id).then(res => res.data);
}

function create(invoice) {
    axios.post('/api/invoices', {...invoice, customer: `/api/customers/${invoice.customer}`})
}

function update(id, invoice) {
    return axios.put('/api/invoices/'+ id, {...invoice, customer: `/api/customers/${invoice.customer}`});
}

function deleteById(id) {
    return axios.delete('/api/invoices/' + id)
}


export default {
    findAll,
    findById,
    create,
    update,
    deleteById
}
