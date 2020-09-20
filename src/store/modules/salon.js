import store from '../index'

const state = {
    salon: {
        name: '',
        leader: {
            name: '',
            surname: '',
        }
    },
}

const getters = {
    getSalon: state => state.salon,
}

const actions = {
    async fetchSalon({commit}) {
        const doc = await store.state.login.userData.salon.ref.get();
        let salon = doc.data();
        salon.id = doc.id;
        commit('setSalon', salon);
    },
}

const mutations = {
    setSalon: (state, data) => state.salon = data,
}

export default {
    state,
    getters,
    actions,
    mutations,
}