import store from '../index';

const state = {
    treatments: [],
};

const getters = {
    getAllTreatments: state => state.treatments,
};

const actions = {
    async fetchTreatments({ commit }) {
        let treatments = [];
        store.state.login.userData.salon.ref.collection('treatments').get()
            .then(res => {
                res.forEach(doc => {
                    let treatment = doc.data();
                    treatment.id = doc.id;
                    treatments.push(treatment);
                });
                commit('setTreatments', treatments);
            }).catch(err => console.error(err));
    },
    async addTreatment({ commit }, newTreatment) {
        const res = await store.state.login.userData.salon.ref.collection('treatments').add(newTreatment);
        newTreatment.id = res.id;
        commit('treatmentAdded', newTreatment);
        return;
    },
    async removeTreatment({ commit }, id) {
        await store.state.login.userData.salon.ref.collection('treatments').doc(id).delete();
        commit('treatmentRemoved', id);
        return;
    },
    async updateTreatment({commit}, updatedTreatment) {
        let ref = store.state.login.userData.salon.ref.collection('treatments').doc(updatedTreatment.id);
        delete updatedTreatment.id;
        await ref.set(updatedTreatment);
        let result = state.treatments.map(obj => obj.id === updatedTreatment.id ? updatedTreatment : obj);
        commit('setTreatments', result);
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