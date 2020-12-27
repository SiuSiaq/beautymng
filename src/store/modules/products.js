const state = {
    products: [],
};

const getters = {
    getAllProducts: state => state.products,
};

const actions = {
    async fetchProducts({ commit, rootState }) {
        rootState.login.userData.salon.ref.collection('products')
            .onSnapshot(querySnapshot => {
                querySnapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        commit('productAdded', {
                            ...change.doc.data(),
                            id: change.doc.id,
                        })
                    }
                    if (change.type === 'modified') {
                        commit('productUpdated', {
                            ...change.doc.data(),
                            id: change.doc.id,
                        })
                    }
                    if (change.type === 'removed') {
                        commit('productRemoved', change.doc.id)
                    }
                });
            });
    },
    async addProduct({ dispatch, rootState }, newProduct) {
        try {
            await rootState.login.userData.salon.ref.collection("products").add(newProduct);
            dispatch('showAlert', {
                text: 'Pomyślnie dodano produktu',
                success: true,
            });
        } catch (err) {
            console.error(err.error);
            dispatch('showAlert', {
                text: 'Nie udało się dodać produktu',
                success: false,
            });
        }
        return;
    },
    async removeProduct({ dispatch, rootState }, id) {
        try {
            await rootState.login.userData.salon.ref.collection('products').doc(id).delete();
            dispatch('showAlert', {
                text: 'Pomyślnie usunięto produkt',
                success: true,
            });
        } catch (error) {
            console.error(error);
            dispatch('showAlert', {
                text: 'Nie udało się usunąć produkt',
                success: false,
            });
        }
        return;
    },
    async updateProduct({ dispatch, rootState }, updatedProduct) {
        try {
            await rootState.login.userData.salon.ref.collection('products').doc(updatedProduct.id).set(updatedProduct);
            dispatch('showAlert', {
                text: 'Pomyślnie zaktualizowano produkt',
                success: true,
            });
        } catch (error) {
            console.error(error);
            dispatch('showAlert', {
                text: 'Nie udało się zaktualizować produktu',
                success: false,
            });
        }
        return;
    },
};

const mutations = {
    productAdded: (state, data) => state.products.unshift(data),
    productRemoved: (state, id) => state.products = state.products.filter(v => v.id !== id),
    productUpdated: (state, data) => state.products = state.products.map(obj => obj.id === data.id ? data : obj),
};

export default {
    state,
    getters,
    actions,
    mutations
}