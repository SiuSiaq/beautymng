import { db, increment, decrement, storageRef } from '@/main';

const state = {
    events: [],
    todayEvents: [],
    todayNotConfirmedEvents: [],
    tomorrowNotConfirmedEvents: [],
    dayAfterNotConfirmedEvents: [],
    tomorrowEvents: [],
    dayAfterEvents: [],
    selectedEvent: null,
    currentEvent: null,
    todayLeftEvents: [],
};

const getters = {
    getAllEvents: state => state.events,
    getTodayEvents: state => state.todayEvents,
    getTomorrowEvents: state => state.todayEvents,
    getDayAfterEvents: state => state.dayAfterEvents,
    getTomorrowNotConfirmedEvents: state => state.tomorrowNotConfirmedEvents,
    getTodayNotConfirmedEvents: state => state.todayNotConfirmedEvents,
    getDayAfterNotConfirmedEvents: state => state.dayAfterNotConfirmedEvents,
    getSelectedEvent: state => state.selectedEvent,
    getCurrentEvent: state => state.currentEvent,
    getTodayLeftEvents: state => state.todayLeftEvents,
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
    async todayEvents({ commit }) {
        try {
            let today = new Date();
            let tdEvents = state.events.filter(v => {
                let tempDate = new Date(v.end);
                return tempDate.getFullYear() === today.getFullYear()
                    && tempDate.getMonth() === today.getMonth()
                    && tempDate.getDate() === today.getDate();
            });
            tdEvents.sort((a, b) => {
                let d1 = new Date(a.start),
                    d2 = new Date(b.start);
                return d1 - d2;
            });
            commit('setTodayEvents', tdEvents);
            return;
        } catch (error) {
            console.error(error)
        }
    },
    async todayNotConfirmedEvents({ commit }) {
        try {
            let today = new Date();
            let tmEvents = state.events.filter(v => {
                let tempDate = new Date(v.start);
                return tempDate.getFullYear() === today.getFullYear()
                    && tempDate.getMonth() === today.getMonth()
                    && tempDate.getDate() === today.getDate() && !v.confirmed && today < tempDate;
            });
            tmEvents.sort((a, b) => {
                let d1 = new Date(a.start),
                    d2 = new Date(b.start);
                return d1 - d2;
            });
            commit('setTodayNotConfirmedEvents', tmEvents);
            return;
        } catch (error) {
            console.error(error)
        }
    },
    async todayLeftEvents({ commit }) {
        try {
            let today = new Date();
            let tdEvents = state.events.filter(v => {
                let tempDate = new Date(v.start);
                return tempDate.getFullYear() === today.getFullYear()
                    && tempDate.getMonth() === today.getMonth()
                    && tempDate.getDate() === today.getDate() && today < tempDate;
            });
            tdEvents.sort((a, b) => {
                let d1 = new Date(a.start),
                    d2 = new Date(b.start);
                return d1 - d2;
            });
            commit('setTodayLeftEvents', tdEvents);
            return;
        } catch (error) {
            console.error(error)
        }
    },
    async tomorrowEvents({ commit }) {
        try {
            let tomorrow = new Date();
            tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000);
            let tmEvents = state.events.filter(v => {
                let tempDate = new Date(v.start);
                return tempDate.getFullYear() === tomorrow.getFullYear()
                    && tempDate.getMonth() === tomorrow.getMonth()
                    && tempDate.getDate() === tomorrow.getDate();
            });
            tmEvents.sort((a, b) => {
                let d1 = new Date(a.start),
                    d2 = new Date(b.start);
                return d1 - d2;
            });
            commit('setTomorrowEvents', tmEvents);
            return;
        } catch (error) {
            console.error(error)
        }
    },
    async tomorrowNotConfirmedEvents({ commit }) {
        try {
            let tomorrow = new Date();
            tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000);
            let tmEvents = state.events.filter(v => {
                let tempDate = new Date(v.start);
                return tempDate.getFullYear() === tomorrow.getFullYear()
                    && tempDate.getMonth() === tomorrow.getMonth()
                    && tempDate.getDate() === tomorrow.getDate() && !v.confirmed;
            });
            tmEvents.sort((a, b) => {
                let d1 = new Date(a.start),
                    d2 = new Date(b.start);
                return d1 - d2;
            });
            commit('setTomorrowNotConfirmedEvents', tmEvents);
            return;
        } catch (error) {
            console.error(error)
        }
    },
    async dayAfterNotConfirmedEvents({ commit }) {
        try {
            let dayAfter = new Date();
            dayAfter.setTime(dayAfter.getTime() + 48 * 60 * 60 * 1000);
            let tmEvents = state.events.filter(v => {
                let tempDate = new Date(v.start);
                return tempDate.getFullYear() === dayAfter.getFullYear()
                    && tempDate.getMonth() === dayAfter.getMonth()
                    && tempDate.getDate() === dayAfter.getDate() && !v.confirmed;
            });
            tmEvents.sort((a, b) => {
                let d1 = new Date(a.start),
                    d2 = new Date(b.start);
                return d1 - d2;
            });
            commit('setDayAfterNotConfirmedEvents', tmEvents);
            return;
        } catch (error) {
            console.error(error)
        }
    },
    async dayAfterEvents({ commit }) {
        try {
            let dayAfter = new Date();
            dayAfter.setTime(dayAfter.getTime() + 48 * 60 * 60 * 1000);
            let tmEvents = state.events.filter(v => {
                let tempDate = new Date(v.start);
                return tempDate.getFullYear() === dayAfter.getFullYear()
                    && tempDate.getMonth() === dayAfter.getMonth()
                    && tempDate.getDate() === dayAfter.getDate();
            });
            tmEvents.sort((a, b) => {
                let d1 = new Date(a.start),
                    d2 = new Date(b.start);
                return d1 - d2;
            });
            commit('setDayAfterEvents', tmEvents);
            return;
        } catch (error) {
            console.error(error)
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
    setEvents: (state, data) => state.events = data,
    setTomorrowEvents: (state, data) => state.tomorrowEvents = data,
    setTomorrowNotConfirmedEvents: (state, data) => state.tomorrowNotConfirmedEvents = data,
    setDayAfterEvents: (state, data) => state.dayAfterEvents = data,
    setTodayEvents: (state, data) => state.todayEvents = data,
    setTodayNotConfirmedEvents: (state, data) => state.todayNotConfirmedEvents = data,
    setDayAfterNotConfirmedEvents: (state, data) => state.dayAfterNotConfirmedEvents = data,
    setTodayLeftEvents: (state, data) => state.todayLeftEvents = data,
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