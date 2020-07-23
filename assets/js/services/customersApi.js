import axios from 'axios';

function findAll() {
    return axios
        .get('/api/customers')
        .then(res => res.data['hydra:member']);
}

function findById(id) {
    return axios.get("/api/customers/" + id).then(res => res.data);
}

function create(customer) {
    axios.post('/api/customers', customer)
}

function edit(id, customer) {
    return axios.put('/api/customers/' + id, customer);
}

function deleteById(id) {
    return axios
        .delete('http://localhost:8000/api/customers/' + id)
}



export default {
    findAll,
    findById,
    create,
    edit,
    deleteById,
}
