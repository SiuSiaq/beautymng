import store from '../index';

const state = {
    clients: [],
};

const getters = {
    getAllClients: state => state.clients,
};

const actions = {
    async fetchClients({ commit }) {
        let clients = [];
        store.state.login.userData.salon.ref.collection('clients').get()
            .then(res => {
                res.forEach(doc => {
                    let client = doc.data();
                    client.id = doc.id;
                    clients.push(client);
                });
                commit('setClients', clients);
            });
    },
    async addClient({ commit }, newClient) {
        let res = await store.state.login.userData.salon.ref.collection("clients").add(newClient);
        newClient.id = res.id;
        commit('clientAdded', newClient);
        return;
    },
    async removeClient({ commit }, id) {
        try {
            await store.state.login.userData.salon.ref.collection('clients').doc(id).delete();
            commit('clientRemoved', id);
        } catch (error) {
            console.error(error);
        }
        return;
    },
    async updateClient({ commit }, updatedClient) {
        try {
            await store.state.login.userData.salon.ref.collection('clients').doc(updatedClient.id).set(updatedClient);
            let result = state.clients.map(obj => obj.id === updatedClient.id ? updatedClient : obj);
            commit('setClients', result);
        } catch (error) {
            console.error(error);
        }
        return;
    }
};

const mutations = {
    setClients: (state, data) => state.clients = data,
    clientAdded: (state, newClient) => state.clients.unshift(newClient),
    clientRemoved: (state, id) => state.clients = state.clients.filter(v => v.id !== id),
};

export default {
    state,
    getters,
    actions,
    mutations
}