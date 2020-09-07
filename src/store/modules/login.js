import { auth, db } from "@/main";

const state = {
    isLoggedIn: false,
    user: null,
    userData: null,
}

const getters = {
    getIsLoggedIn: state => state.isLoggedIn,
    getUser: state => state.user,
    getUserData: state => state.userData,
}

const actions = {
    async registerUser({ commit }, userCredentials) {
        try {
            let user = await auth.createUserWithEmailAndPassword(userCredentials.email, userCredentials.password);
            if (user) {
                commit('setIsLoggedIn', true);
                commit('setUser', user.user);
                await db.collection('users').doc(user.user.uid).set({
                    email: userCredentials.email,
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
            let user = await auth.signInWithEmailAndPassword(userData.email, userData.password);
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
    async logOut({commit}) {
        await auth.signOut();
        commit('setIsLoggedIn', false);
        commit('setUser', null);
        console.log("logged out");
        return;
    },
    async joinSalon({commit}, key) {
        const snapshot = await db.collection('salons').where('key', '==', key).get();
        if(snapshot.empty) {
            console.log('Cannot find salon');
            console.log(commit);
            return;
        }
        console.log(state.user.uid);
        snapshot.forEach(async doc => {
            await db.collection('users').doc(state.user.uid).update({
                salon: {
                    name: doc.name,
                    ref: db.collection('salons').doc(doc.id),
                }
            })
        });
        return;
    },
    authStateChanged({ commit }) {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in.
                console.log(`User uid: ${user.uid}`);
                commit('setIsLoggedIn', true);
                commit('setUser', user);
                let userDoc = await db.collection('users').doc(user.uid).get();
                let userData = userDoc.data();
                
                if(userData !== undefined) {
                    userData.id = userDoc.id;
                    commit('setUserData', userData);
                }
                  
                /*var email = user.email;
                var uid = user.uid;
                var displayName = user.displayName;
                var emailVerified = user.emailVerified;
                var providerData = user.providerData;*/
            } else {
                // User is signed out.
                console.log("User signed out");
            }
        });
    }
}

const mutations = {
    setIsLoggedIn: (state, data) => state.isLoggedIn = data,
    setUser: (state, data) => state.user = data,
    setUserData: (state, data) => state.userData = data,
}

export default {
    state,
    getters,
    actions,
    mutations
}
