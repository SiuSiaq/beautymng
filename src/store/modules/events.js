import { db, increment, decrement, changeValue, storageRef } from '@/main';

const state = {
    events: [],
    selectedEvent: null,
    currentEvent: null,
};

const getters = {
    getAllEvents: state => state.events,
    getTodayNotConfirmedEvents: state => state.events.filter(v => {
        let tempDate = v.startDate.toDate()
        tempDate.setHours(0,0,0,0)
        let today = new Date()
        today.setHours(0,0,0,0)
        return !v.archived && !v.confirmed && today.toISOString() === tempDate.toISOString();
    }).sort((a, b) => {
        let d1 = a.startDate.toDate(),
            d2 = b.startDate.toDate();
        return d1 - d2;
    }),
    getTomorrowNotConfirmedEvents: state => state.events.filter(v => {
        let tempDate = v.startDate.toDate()
        tempDate.setHours(0,0,0,0)
        let today = new Date()
        today.setHours(0,0,0,0)
        today.setDate(today.getDate() + 1)
        return !v.archived && !v.confirmed && today.toISOString() === tempDate.toISOString();
    }).sort((a, b) => {
        let d1 = a.startDate.toDate(),
            d2 = b.startDate.toDate();
        return d1 - d2;
    }),
    getDayAfterNotConfirmedEvents: state => state.events.filter(v => {
        let tempDate = v.startDate.toDate()
        tempDate.setHours(0,0,0,0)
        let today = new Date()
        today.setHours(0,0,0,0)
        today.setDate(today.getDate() + 2)
        return !v.archived && !v.confirmed && today.toISOString() === tempDate.toISOString();
    }).sort((a, b) => {
        let d1 = a.startDate.toDate(),
            d2 = b.startDate.toDate();
        return d1 - d2;
    }),
    getSelectedEvent: state => state.selectedEvent,
    getCurrentEvent: state => state.currentEvent,
};

const actions = {
    async fetchEvents({ commit, dispatch, rootState }) {
        try {
            rootState.login.userData.salon.ref.collection('events')
                .onSnapshot(querySnapshot => {
                    querySnapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            commit('eventAdded', {
                                ...change.doc.data(),
                                id: change.doc.id,
                            })
                        }
                        if (change.type === 'modified') {
                            commit('eventUpdated', {
                                ...change.doc.data(),
                                id: change.doc.id,
                            })
                        }
                        if (change.type === 'removed') {
                            commit('eventRemoved', change.doc.id)
                        }
                    });
                });
            return;
        } catch (error) {
            console.error(error);
            dispatch('showAlert', {
                text: 'Nie udało się pobrać bazy danych wizyt',
                success: false,
            });
        }
    },
    async addEvent({ dispatch, rootState }, newEvent) {
        try {
            let ref = rootState.login.userData.salon.ref.collection('events').doc();
            newEvent.id = ref.id;
            const newItem = {
                name: newEvent.name,
                eventRef: rootState.login.userData.salon.ref.collection('events').doc(newEvent.id),
                confirmed: false,
                start: newEvent.start,
                startDate: newEvent.startDate,
                clientName: newEvent.clientName,
                doctor: newEvent.doctor,
                products: newEvent.products,
            }

            const batch = db.batch();

            batch.set(ref, newEvent);

            batch.set(newEvent.treatmentRef.collection('plannedvisits').doc(newEvent.id), newItem);

            batch.update(newEvent.treatmentRef, {
                plannedcount: increment,
            });

            batch.set(newEvent.clientRef.collection('plannedvisits').doc(newEvent.id), newItem);

            batch.update(newEvent.clientRef, {
                plannedcount: increment,
            });

            batch.update(newEvent.doctor.ref, {
                plannedcount: increment,
            });

            newEvent.products.forEach(product => {
                batch.update(product.ref, {
                    plannedAmount: changeValue(-1 * product.amount)
                });
            })

            await batch.commit();
            dispatch('showAlert', {
                text: 'Pomyślnie dodano wizytę',
                success: true,
            });
        } catch (e) {
            console.log('Batch failure:', e);
            dispatch('showAlert', {
                text: 'Nie udało się dodać wizyty',
                success: false,
            });
        }
        return;
    },
    async removeEvent({ dispatch, rootState }, event) {
        try {
            const batch = db.batch();

            batch.delete(event.clientRef.collection('plannedvisits').doc(event.id));

            batch.update(event.clientRef, {
                plannedcount: decrement,
            });

            batch.delete(event.treatmentRef.collection('plannedvisits').doc(event.id));

            batch.update(event.treatmentRef, {
                plannedcount: decrement,
            });

            batch.update(event.doctor.ref, {
                plannedcount: decrement,
            });

            batch.delete(rootState.login.userData.salon.ref.collection('events').doc(event.id));

            event.products.forEach(product => {
                batch.update(product.ref, {
                    plannedAmount: changeValue(product.amount)
                })
            })

            await batch.commit();
            dispatch('showAlert', {
                text: 'Pomyślnie usunięto wizytę',
                success: true,
            });

        } catch (error) {
            console.error(error);
            dispatch('showAlert', {
                text: 'Nie udało się usunąć wizyty',
                success: false,
            });
        }
        return;
    },
    async editEvent({ dispatch, rootState }, event) {
        try {
            const batch = db.batch();

            batch.update(event.treatmentRef.collection('plannedvisits').doc(event.id), {
                start: event.start,
                end: event.end,
            });

            batch.update(event.clientRef.collection('plannedvisits').doc(event.id), {
                start: event.start,
                end: event.end,
            });

            batch.update(rootState.login.userData.salon.ref.collection('events').doc(event.id), {
                start: event.start,
                end: event.end,
            });

            await batch.commit();
            dispatch('showAlert', {
                text: 'Pomyślnie zaktualizowano wizytę',
                success: true,
            });

        } catch (error) {
            console.error(error);
            dispatch('showAlert', {
                text: 'Nie udało się zaktualizować wizyty',
                success: false,
            });
        }
        return;
    },
    async confirmEvent({ commit, dispatch, rootState }, event) {
        try {
            const batch = db.batch();

            batch.update(rootState.login.userData.salon.ref.collection('events').doc(event.id), {
                confirmed: true,
            });

            batch.update(event.treatmentRef.collection('plannedvisits').doc(event.id), {
                confirmed: true,
            });

            batch.update(event.clientRef.collection('plannedvisits').doc(event.id), {
                confirmed: true,
            });

            await batch.commit();

            let tmpdate = new Date();
            let dd = new Date(event.start);
            if (tmpdate.getDate() === dd.getDate()) {
                commit('eventTodayConfirmed', event.id);
                return;
            }
            tmpdate.setDate(tmpdate.getDate() + 1);
            if (tmpdate.getDate() === dd.getDate())
                commit('eventTomorrowConfirmed', event.id);
            else commit('eventDayAfterConfirmed', event.id);

            dispatch('showAlert', {
                text: 'Pomyślnie potwierdzono wizytę',
                success: true,
            });
        } catch (error) {
            console.error(error);
            dispatch('showAlert', {
                text: 'Nie udało się potwierdzić wizyty',
                success: false,
            });
        }
        return;
    },
    async archiveEvent({ dispatch, rootState }, event) {
        try {
            const batch = db.batch();
            const salonId = rootState.login.userData.salon.ref.id;
            let urls = [];
            let i;
            for (i = 0; i < event.images.length; i++) {
                let file = event.images[i];
                let imageRef = storageRef.child(`${salonId}/${event.id}/${file.name}`);
                await imageRef.put(file);
                let url = await imageRef.getDownloadURL();
                urls.push(url);
            }
            event.imageUrls = urls;
            delete event.images;

            batch.update(rootState.login.userData.salon.ref.collection('events').doc(event.id), {
                archived: true,
                additionalTreatments: event.additionalTreatments.map(v => v.name),
                price: event.price,
            });

            batch.delete(event.treatmentRef.collection('plannedvisits').doc(event.id))

            batch.set(event.treatmentRef.collection('pastvisits').doc(event.id), {
                name: event.name,
                eventRef: rootState.login.userData.salon.ref.collection('events').doc(event.id),
                confirmed: event.confirmed,
                start: event.start,
                startDate: event.startDate,
                clientName: event.clientName,
                doctor: event.doctor,
                imageUrls: urls,
                rate: event.rate,
                price: event.price,
                additionalTreatments: event.additionalTreatments.map(v => v.name),
            })

            batch.update(event.treatmentRef, {
                plannedcount: decrement,
                visits: increment,
            });

            batch.delete(event.clientRef.collection('plannedvisits').doc(event.id))

            batch.set(event.clientRef.collection('pastvisits').doc(event.id), {
                name: event.name,
                eventRef: rootState.login.userData.salon.ref.collection('events').doc(event.id),
                confirmed: event.confirmed,
                start: event.start,
                startDate: event.startDate,
                clientName: event.clientName,
                doctor: event.doctor,
                imageUrls: urls,
                rate: event.rate,
                price: event.price,
                additionalTreatments: event.additionalTreatments.map(v => v.name),
            })

            batch.update(event.clientRef, {
                plannedcount: decrement,
                visits: increment,
            });

            batch.update(rootState.login.userData.salon.ref, {
                visits: increment,
            });

            batch.update(event.doctor.ref, {
                visits: increment,
            });

            event.products.forEach( product => {
                batch.update(product.ref, {
                    amount: changeValue(-1 * product.amount),
                    used: increment,
                })
            })

            event.additionalTreatments.forEach( treatment => {
                batch.update(rootState.login.userData.salon.ref.collection('treatments').doc(treatment.id), {
                    visits: increment,
                })
                treatment.products.forEach( product => {
                    batch.update(product.ref, {
                        amount: changeValue(-1 * product.amount),
                        plannedAmount: changeValue(-1 * product.amount),
                        used: increment,
                    })
                })
            })

            await batch.commit();

            dispatch('showAlert', {
                text: 'Zakończono zabieg',
                success: true,
            });
            dispatch('fetchSalon');
        } catch (error) {
            console.error(error);
            dispatch('showAlert', {
                text: 'Nie udało się zakończyć zabiegu',
                success: false,
            });
        }
        return;
    },
    async selectEvent({ commit }, event) {
        commit('setSelectedEvent', event);
    },
};

const mutations = {
    setSelectedEvent: (state, data) => state.selectedEvent = data,
    setCurrentEvent: (state, data) => state.currentEvent = data,
    eventAdded: (state, newEvent) => state.events.push(newEvent),
    eventRemoved: (state, id) => state.events = state.events.filter(v => v.id !== id),
    eventUpdated: (state, event) => state.events = state.events.map(obj => obj.id === event.id ? event : obj),
    eventTodayConfirmed: (state, id) => state.todayNotConfirmedEvents = state.todayNotConfirmedEvents.filter(v => v.id !== id),
    eventTomorrowConfirmed: (state, id) => state.tomorrowNotConfirmedEvents = state.tomorrowNotConfirmedEvents.filter(v => v.id !== id),
    eventDayAfterConfirmed: (state, id) => state.dayAfterNotConfirmedEvents = state.dayAfterNotConfirmedEvents.filter(v => v.id !== id),
};

export default {
    state,
    getters,
    actions,
    mutations
}