import store from '../index';

const state = {
    clients: [],
};

const getters = {
    getAllClients: state => state.clients,
};

const actions = {
    async fetchClients({ commit, dispatch }) {
        let clients = [];
        store.state.login.userData.salon.ref.collection('clients').get()
            .then(res => {
                res.forEach(doc => {
                    let client = doc.data();
                    client.id = doc.id;
                    clients.push(client);
                });
                commit('setClients', clients);
            }).catch((err) => {
                console.error(err.error);
                dispatch('showAlert', {
                    text: 'Nie udało się pobrać bazy danych klientów',
                    success: false,
                });
            });
    },
    async addClient({ commit, dispatch }, newClient) {
        try {
            let res = await store.state.login.userData.salon.ref.collection("clients").add(newClient);
            newClient.id = res.id;
            commit('clientAdded', newClient);
            dispatch('showAlert', {
                text: 'Pomyślnie dodano klienta',
                success: true,
            });
        } catch (err) {
            console.error(err.error);
            dispatch('showAlert', {
                text: 'Nie udało się dodać klienta',
                success: false,
            });
        }
        return;
    },
    async removeClient({ commit, dispatch }, id) {
        try {
            await store.state.login.userData.salon.ref.collection('clients').doc(id).delete();
            commit('clientRemoved', id);
            dispatch('showAlert', {
                text: 'Pomyślnie usunięto klienta',
                success: true,
            });
        } catch (error) {
            console.error(error);
            dispatch('showAlert', {
                text: 'Nie udało się usunąć klienta',
                success: false,
            });
        }
        return;
    },
    async updateClient({ commit, dispatch }, updatedClient) {
        try {
            await store.state.login.userData.salon.ref.collection('clients').doc(updatedClient.id).set(updatedClient);
            let result = state.clients.map(obj => obj.id === updatedClient.id ? updatedClient : obj);
            commit('setClients', result);
            dispatch('showAlert', {
                text: 'Pomyślnie zaktualizowano klienta',
                success: true,
            });
        } catch (error) {
            console.error(error);
            dispatch('showAlert', {
                text: 'Nie udało się zaktualizować klienta',
                success: false,
            });
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