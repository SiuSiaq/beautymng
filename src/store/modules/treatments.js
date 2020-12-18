const state = {
    treatments: [],
};

const getters = {
    getAllTreatments: state => state.treatments,
};

const actions = {
    async fetchTreatments({ commit, rootState }) {
        rootState.login.userData.salon.ref.collection('treatments')
            .onSnapshot(querySnapshot => {
                querySnapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        commit('treatmentAdded', {
                            ...change.doc.data(),
                            id: change.doc.id,
                        })
                    }
                    if (change.type === 'modified') {
                        commit('treatmentUpdated', {
                            ...change.doc.data(),
                            id: change.doc.id,
                        })
                    }
                    if (change.type === 'removed') {
                        commit('treatmentRemoved', change.doc.id)
                    }
                });
            });
    },
    async addTreatment({ dispatch, rootState }, newTreatment) {
        try {
            await rootState.login.userData.salon.ref.collection('treatments').add(newTreatment);
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
    async removeTreatment({ dispatch, rootState }, id) {
        try {
            await rootState.login.userData.salon.ref.collection('treatments').doc(id).delete();
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
    async updateTreatment({ dispatch, rootState }, updatedTreatment) {
        try {
            let ref = rootState.login.userData.salon.ref.collection('treatments').doc(updatedTreatment.id);
            delete updatedTreatment.id;
            await ref.set(updatedTreatment);
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
    },
    async fetchTreatmentVisits({ rootState }, id) {
        let plannedvisits = [], pastvisits = [];
        const resPlanned = await rootState.login.userData.salon.ref.collection('treatments').doc(id).collection('plannedvisits').get();
        resPlanned.forEach(doc => {
            plannedvisits.push({
                ...doc.data(),
                id: doc.id,
            })
        })

        const resPast = await rootState.login.userData.salon.ref.collection('treatments').doc(id).collection('pastvisits').get();
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
    setTreatments: (state, data) => state.treatments = data,
    treatmentAdded: (state, newTreatment) => state.treatments.unshift(newTreatment),
    treatmentRemoved: (state, id) => state.treatments = state.treatments.filter(v => v.id !== id),
    treatmentUpdated: (state, data) => state.treatments = state.treatments.map(obj => obj.id === data.id ? data : obj),
};

export default {
    state,
    getters,
    actions,
    mutations
}