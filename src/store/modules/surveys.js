import { db } from '@/main'

const state = {
    surveys: [],
}

const getters = {
    getSurveys: state => state.surveys,
}

const actions = {
    async fetchSurveys({ commit, rootState }) {
        try {
            rootState.login.userData.salon.ref.collection('surveys')
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            commit('surveyAdded', {
                                ...change.doc.data(),
                                id: change.doc.id,
                            });
                        }
                        if (change.type === 'modified') {
                            commit('surveyModified', {
                                ...change.doc.data(),
                                id: change.doc.id,
                            });
                        }
                        if (change.type === 'removed') {
                            commit('surveyRemoved', change.doc.id)
                        }
                    });
                });
        } catch (error) {
            console.error(error)
        }
    },
    async createSurvey({ rootState, dispatch }, survey) {
        try {
            survey.date = new Date().toISOString().slice(0, 10)
            survey.created = new Date()
            survey.author = db.collection('users').doc(rootState.login.user.uid)
            const res = await rootState.login.userData.salon.ref.collection('surveys').add(survey)
            survey.id = res.id
            dispatch('showAlert', {
                text: 'Ankieta utworzona',
                success: true,
            })
        } catch (error) {
            console.error(error)
            dispatch('showAlert', {
                text: 'Nie udało się utworzyć ankiety',
                success: false,
            })
        }
    },
}

const mutations = {
    surveyAdded: (state, data) => state.surveys.unshift(data),
    surveyRemoved: (state, id) => state.surveys = state.surveys.filter(v => v.id !== id),
    surveyModified: (state, data) => state.surveys.map((obj) => obj.id === data.id ? data : obj),
}

export default {
    state,
    getters,
    actions,
    mutations,
}