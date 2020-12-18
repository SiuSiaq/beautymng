const state = {
    clients: [],
};

const getters = {
    getAllClients: state => state.clients,
};

const actions = {
    async fetchClients({ commit, rootState }) {
        rootState.login.userData.salon.ref.collection('clients')
            .onSnapshot(querySnapshot => {
                querySnapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        commit('clientAdded', {
                            ...change.doc.data(),
                            id: change.doc.id,
                        })
                    }
                    if (change.type === 'modified') {
                        commit('clientUpdated', {
                            ...change.doc.data(),
                            id: change.doc.id,
                        })
                    }
                    if (change.type === 'removed') {
                        commit('clientRemoved', change.doc.id)
                    }
                });
            });
    },
    async addClient({ dispatch, rootState }, newClient) {
        try {
            await rootState.login.userData.salon.ref.collection("clients").add(newClient);
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
    async removeClient({ dispatch, rootState }, id) {
        try {
            await rootState.login.userData.salon.ref.collection('clients').doc(id).delete();
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
    async updateClient({ dispatch, rootState }, updatedClient) {
        try {
            await rootState.login.userData.salon.ref.collection('clients').doc(updatedClient.id).set(updatedClient);
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
    },
    async fetchClientVisits({ rootState }, id) {
        let plannedvisits = [], pastvisits = [];
        const resPlanned = await rootState.login.userData.salon.ref.collection('clients').doc(id).collection('plannedvisits').get();
        resPlanned.forEach(doc => {
            plannedvisits.push({
                ...doc.data(),
                id: doc.id,
            })
        })

        const resPast = await rootState.login.userData.salon.ref.collection('clients').doc(id).collection('pastvisits').get();
        resPast.forEach(doc => {
            pastvisits.push({
                ...doc.data(),
                id: doc.id,
            })
        })

        return { plannedvisits, pastvisits }
    },
};

const mutations = {
    setClients: (state, data) => state.clients = data,
    clientAdded: (state, newClient) => state.clients.unshift(newClient),
    clientRemoved: (state, id) => state.clients = state.clients.filter(v => v.id !== id),
    clientUpdated: (state, data) => state.clients = state.clients.map(obj => obj.id === data.id ? data : obj),
};

export default {
    state,
    getters,
    actions,
    mutations
}