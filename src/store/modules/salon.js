import { db } from '@/main' 
const state = {
    salon: {
        name: '',
        leader: {
            name: '',
            surname: '',
        }
    },
    admin: false,
    statsType: 'Rok',
}

const getters = {
    getSalon: state => state.salon,
    isAdmin: state => state.admin,
    getStatsType: state => state.statsType,
}

const actions = {
    async fetchSalon({ commit, rootState }) {
        const doc = await rootState.login.userData.salon.ref.get();
        let salon = doc.data();
        salon.id = doc.id;
        // ? CHANGE FOR ARRAY CHECK ?
        salon.users.forEach(user => {
            if(user.ref.id === rootState.login.user.uid) {
                commit('setAdmin', true);
            }
        })
        commit('setSalon', salon);
    },
    async setDoctor({ dispatch, rootState }, obj) {
        try {
            await obj.ref.update({
                doctor: obj.doctor,
            });
            let users = rootState.salon.salon.users;
            users.forEach(user => {
                if(user.ref.id === obj.ref.id) user.doctor = obj.doctor;
            });
            await rootState.login.userData.salon.ref.update({
                users: users,
            })
            dispatch('fetchSalon');
        } catch (err) {
            console.error(err);
            dispatch('showAlert', {
                text: 'Nie udało się zaktualizować pracownika',
                success: false,
            });
        }
    },
    async setSalonName({commit, dispatch}, name) {
        try {
            await db.collection('salons').doc(state.salon.id).update({
                name: name,
            });
            let salon = state.salon;
            salon.name = name;
            commit('setSalon', salon);
            dispatch('showAlert', {
                text: 'Pomyślnie zaktualizowano nazwę salonu',
                success: true,
            });
        } catch(err) {
            console.error(err);
            dispatch('showAlert', {
                text: 'Nie udało się zaktualizować nazwy salonu',
                success: false,
            });
        }
    },
    setStatsType({commit}, type) {
        commit('statsTypeSet', type);
    },
}

const mutations = {
    setSalon: (state, data) => state.salon = data,
    setAdmin: (state, isTrue) => state.admin = isTrue,
    statsTypeSet: (state, type) => state.statsType = type,
}

export default {
    state,
    getters,
    actions,
    mutations,
}