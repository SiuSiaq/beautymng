import { auth, db } from "@/main";

const state = {
    isLoggedIn: false,
    user: null,
    userData: {},
    alert: {
        show: false,
        text: '',
        success: true,
    },
}

const getters = {
    getIsLoggedIn: state => state.isLoggedIn,
    getUser: state => state.user,
    getUserData: state => state.userData,
    getAlert: state => state.alert,
}

const actions = {
    async registerUser({ commit }, userCredentials) {
        try {
            const user = await auth.createUserWithEmailAndPassword(userCredentials.email, userCredentials.password);
            if (user) {
                await user.user.updateProfile({
                    displayName: `${userCredentials.name} ${userCredentials.surname}`
                });
                commit('setIsLoggedIn', true);
                commit('setUser', user.user);
                await db.collection('users').doc(user.user.uid).set({
                    email: userCredentials.email,
                    name: userCredentials.name,
                    surname: userCredentials.surname,
                    phone: userCredentials.phone,
                    doctor: false,
                    registered: new Date().toISOString(),
                });
            }
            else return false;
        } catch (error) {
            console.log(error.code);
            return false;
        }
        return true;
    },
    async logIn({ commit }, userData) {
        try {
            const temp = await auth.signInWithEmailAndPassword(userData.email, userData.password);
            let user = temp.user;
            if (user) {
                commit('setIsLoggedIn', true);
                commit('setUser', user);
                let userDoc = await db.collection('users').doc(user.uid).get();
                let userData = userDoc.data();
                userData.id = userDoc.id;
                commit('setUserData', userData);
            }
            else return false;
        } catch (error) {
            console.log(error.code);
            return false;
        }
        return true;
    },
    async logOut({ commit }) {
        await auth.signOut();
        commit('setIsLoggedIn', false);
        commit('setUser', null);
        console.log("logged out");
        return;
    },
    async joinSalon({ commit, dispatch }, key) {
        const snapshot = await db.collection('salons').where('key', '==', key).get();
        if (snapshot.empty) {
            console.log('Cannot find salon');
            dispatch('showAlert', {
                text: 'Salon o podanym kluczu nie istnieje!',
                success: false,
            })
            return false;
        }
        snapshot.forEach(async doc => {
            let data = doc.data();
            data.id = doc.id;
            await db.collection('users').doc(state.user.uid).update({
                salon: {
                    name: data.name,
                    ref: db.collection('salons').doc(doc.id),
                }
            });
            let userDoc = await db.collection('users').doc(state.user.uid).get();
            let userData = userDoc.data();
            userData.id = userDoc.id;
            commit('setUserData', userData);
            await db.runTransaction(async (t) => {
                let salonRef = db.collection('salons').doc(data.id);
                const salon = await t.get(salonRef);
                let users = salon.data().users;
                users.push({
                    name: state.userData.name,
                    surname: state.userData.surname,
                    fullname: `${userData.name} ${userData.surname}`,
                    id: state.user.uid,
                    doctor: false,
                    visits: 0,
                    ref: db.collection('users').doc(state.user.uid),
                });
                t.update(salonRef, { users: users });
            });
            dispatch('fetchSalon');
        });
        return true;
    },
    async showAlert({ commit }, alert) {
        alert.show = true;
        commit('setAlert', alert);
        setTimeout(() => commit('hideAlert'), 3000);
    },
    authStateChanged({ commit, dispatch }) {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in.
                commit('setIsLoggedIn', true);
                commit('setUser', user);
                let userDoc = await db.collection('users').doc(user.uid).get();
                let userData = userDoc.data();

                if (userData !== undefined) {
                    userData.id = userDoc.id;
                    commit('setUserData', userData);
                    dispatch('fetchSalon');
                }

                if (userData.salon) {
                    dispatch('fetchEvents')
                    dispatch('fetchClients')
                    dispatch('fetchTreatments')
                    dispatch('fetchProducts')
                    dispatch('fetchSurveys')
                }

                /*var email = user.email;
                var uid = user.uid;
                var displayName = user.displayName;
                var emailVerified = user.emailVerified;
                var providerData = user.providerData;*/
            } else {
                // User is signed out.
                console.log("User signed out");
                commit('setIsLoggedIn', false);
                commit('setUser', null);
            }
        });
    },
}

const mutations = {
    setIsLoggedIn: (state, data) => state.isLoggedIn = data,
    setUser: (state, data) => state.user = data,
    setUserData: (state, data) => state.userData = data,
    setAlert: (state, data) => state.alert = data,
    hideAlert: (state) => state.alert.show = false,
}

export default {
    state,
    getters,
    actions,
    mutations
}
