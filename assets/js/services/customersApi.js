import axios from 'axios';

function findAll() {
    return axios
        .get('/api/customers')
        .then(res => res.data['hydra:member']);
}

function deleteById(id) {
    return axios
        .delete('http://localhost:8000/api/customers/' + id)
}


export default {
    findAll,
    deleteById
}
