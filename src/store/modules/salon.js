import store from '../index'
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
}

const getters = {
    getSalon: state => state.salon,
    isAdmin: state => state.admin,
}

const actions = {
    async fetchSalon({ commit }) {
        const doc = await store.state.login.userData.salon.ref.get();
        let salon = doc.data();
        salon.id = doc.id;
        // ? CHANGE FOR ARRAY CHECK ?
        if(!state.isAdmin) {
            if(salon.leader.ref.id === store.state.login.user.uid) commit('setAdmin', true);
        }
        commit('setSalon', salon);
    },
    async setDoctor({ dispatch }, obj) {
        try {
            await obj.ref.update({
                doctor: obj.doctor,
            });
            let users = store.state.salon.salon.users;
            users.forEach(user => {
                if(user.ref.id === obj.ref.id) user.doctor = obj.doctor;
            });
            await store.state.login.userData.salon.ref.update({
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
    }
}

const mutations = {
    setSalon: (state, data) => state.salon = data,
    setAdmin: (state, isTrue) => state.admin = isTrue,
}

export default {
    state,
    getters,
    actions,
    mutations,
}