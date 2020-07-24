import axios from 'axios';
import {CUSTOMERS_API} from "../config";
import Cache from './cache';

async function findAll() {
    const cachedCustomers = await Cache.get("customers");
    if (cachedCustomers) return cachedCustomers;

    return axios
        .get(CUSTOMERS_API)
        .then(res => {
            const customers = res.data["hydra:member"];
            Cache.set("customers", customers);
            return customers;
        });
}

async function findById(id) {
    const cachedCustomer = await Cache.get("customers." + id);
    if (cachedCustomer) return cachedCustomer;

    return axios.get(CUSTOMERS_API + "/" + id).then(res => {
        const customer = res.data;
        Cache.set("customers." + id, customer);
        return customer;
    });
}

function create(customer) {
    axios.post(CUSTOMERS_API, customer).then(async res => {
        const cachedCustomers = await Cache.get("customers");
        if (cachedCustomers) {
            Cache.set("customers", [...cachedCustomers, res.data]);
        }
        return res;
    });
}

function edit(id, customer) {
    return axios.put(CUSTOMERS_API + "/" + id, customer).then(async res => {
        const cachedCustomers = await Cache.get("customers");
        const cachedCustomer = await Cache.get("customers." + id);

        if (cachedCustomer) {
            Cache.set(CUSTOMERS_API + "/" + id, res.data);
        }
        if (cachedCustomers) {
            const index = cachedCustomers.findIndex(c => c.id === +id);
            cachedCustomers[index] = res.data;
        }
        return res;
    });
}

function deleteById(id) {
    return axios.delete(CUSTOMERS_API + "/" + id).then(async res => {
        const cachedCustomers = await Cache.get("customers");
        if (cachedCustomers) {
            Cache.set("customers", cachedCustomers.filter(c => c.id !== id));
        }
        return res;
    });
}


export default {
    findAll,
    findById,
    create,
    edit,
    deleteById,
}
