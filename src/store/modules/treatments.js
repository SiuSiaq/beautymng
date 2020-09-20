import store from '../index';

const state = {
    treatments: [],
};

const getters = {
    getAllTreatments: state => state.treatments,
};

const actions = {
    async fetchTreatments({ commit, dispatch }) {
        let treatments = [];
        store.state.login.userData.salon.ref.collection('treatments').get()
            .then(res => {
                res.forEach(doc => {
                    let treatment = doc.data();
                    treatment.id = doc.id;
                    treatments.push(treatment);
                });
                commit('setTreatments', treatments);
            }).catch((err) => {
                console.error(err);
                dispatch('showAlert', {
                    text: 'Nie udało się zaktualizować bazy danych zabiegów',
                    success: false,
                });
            });
    },
    async addTreatment({ commit, dispatch }, newTreatment) {
        try {
            const res = await store.state.login.userData.salon.ref.collection('treatments').add(newTreatment);
            newTreatment.id = res.id;
            commit('treatmentAdded', newTreatment);
            dispatch('showAlert', {
                text: 'Pomyślnie dodano zabieg',
                success: true,
            });
        } catch (err) {
            console.error(err.error);
            dispatch('showAlert', {
                text: 'Nie udało się dodać zabiegu',
                success: false,
            });
        }
        return;
    },
    async removeTreatment({ commit, dispatch }, id) {
        try {
            await store.state.login.userData.salon.ref.collection('treatments').doc(id).delete();
            commit('treatmentRemoved', id);
            dispatch('showAlert', {
                text: 'Pomyślnie usunięto zabieg',
                success: true,
            });
        } catch (err) {
            console.error(err.error);
            dispatch('showAlert', {
                text: 'Nie udało się dodać zabiegu',
                success: false,
            });
        }
        return;
    },
    async updateTreatment({ commit, dispatch }, updatedTreatment) {
        try {
            let ref = store.state.login.userData.salon.ref.collection('treatments').doc(updatedTreatment.id);
            delete updatedTreatment.id;
            await ref.set(updatedTreatment);
            let result = state.treatments.map(obj => obj.id === updatedTreatment.id ? updatedTreatment : obj);
            commit('setTreatments', result);
            dispatch('showAlert', {
                text: 'Pomyślnie zaktualizowano zabieg',
                success: true,
            });
        } catch (err) {
            console.error(err.error);
            dispatch('showAlert', {
                text: 'Nie udało się zaktualizować zabiegu',
                success: false,
            });
        }
        return;
    }
};

const mutations = {
    setTreatments: (state, data) => state.treatments = data,
    treatmentAdded: (state, newTreatment) => state.treatments.unshift(newTreatment),
    treatmentRemoved: (state, id) => state.treatments = state.treatments.filter(v => v.id !== id),
};

export default {
    state,
    getters,
    actions,
    mutations
}