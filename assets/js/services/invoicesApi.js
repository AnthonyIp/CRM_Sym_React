import axios from 'axios';

function findAll() {
    return axios
        .get('/api/invoices')
        .then(res => res.data['hydra:member']);
}

function deleteById(id) {
    return axios.delete('/api/invoices/' + id)
}


export default {
    findAll,
    deleteById
}
