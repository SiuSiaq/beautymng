import { db, increment, decrement, storageRef } from '@/main';
import store from '../index';

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
    async fetchEvents({ commit, dispatch }) {
        try {
            let events = [];
            const res = await store.state.login.userData.salon.ref.collection('events').get();
            res.forEach(doc => {
                let event = doc.data();
                event.id = doc.id;
                events.push(event);
            });
            commit('setEvents', events);
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
                    && tempDate.getDate() === today.getDate() && today < tempDate;
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
    async addEvent({ commit, dispatch }, newEvent) {
        try {
            let res = await store.state.login.userData.salon.ref.collection('events').add(newEvent);
            newEvent.id = res.id;
            const newItem = {
                name: newEvent.name,
                eventRef: store.state.login.userData.salon.ref.collection('events').doc(newEvent.id),
                confirmed: false,
                start: newEvent.start,
                clientName: newEvent.clientName,
            }
            const doc1 = await newEvent.treatmentRef.get();
            let newTreatment = doc1.data();
            newTreatment.plannedvisits.push(newItem);

            const doc2 = await newEvent.clientRef.get();
            let newClient = doc2.data();
            newClient.plannedvisits.push(newItem);

            const batch = db.batch();

            batch.update(newEvent.treatmentRef, {
                plannedcount: increment,
                plannedvisits: newTreatment.plannedvisits,
            });

            batch.update(newEvent.clientRef, {
                plannedcount: increment,
                plannedvisits: newClient.plannedvisits,
            });

            await batch.commit();
            commit('eventAdded', newEvent);
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
    async removeEvent({ commit, dispatch }, event, client, treatment) {
        try {
            const batch = db.batch();
            if (client === null || client === undefined) {
                let clientDoc = await event.clientRef.get();
                client = clientDoc.data();
                client.id = clientDoc.id;
            }
            if (treatment === null || treatment === undefined) {
                let treatmentDoc = await event.treatmentRef.get();
                treatment = treatmentDoc.data();
                treatment.id = treatmentDoc.id;
            }

            client.plannedvisits = client.plannedvisits.filter(v => v.eventRef.id !== event.id);
            treatment.plannedvisits = treatment.plannedvisits.filter(v => v.eventRef.id !== event.id);

            batch.update(event.clientRef, {
                plannedvisits: client.plannedvisits,
                plannedcount: decrement,
            });

            batch.update(event.treatmentRef, {
                plannedvisits: treatment.plannedvisits,
                plannedcount: decrement,
            });

            batch.delete(store.state.login.userData.salon.ref.collection('events').doc(event.id));

            await batch.commit();
            commit('eventRemoved', event.id);
            dispatch('showAlert', {
                text: 'Pomyślnie usunięto wizytę',
                success: true,
            });

        } catch (error) {
            console.error(error);
            dispatch('showAlert', {
                text: 'Nie udało się dodać wizyty',
                success: false,
            });
        }
        return;
    },
    async editEvent({ commit, dispatch }, event) {
        try {
            const batch = db.batch();
            let
                clientDoc = await event.clientRef.get(),
                treatmentDoc = await event.treatmentRef.get();
            let client = clientDoc.data();
            client.id = clientDoc.id;
            let treatment = treatmentDoc.data();
            treatment.id = treatmentDoc.id;

            client.plannedvisits = client.plannedvisits.map(obj => obj.eventRef.id === event.id ? {
                name: obj.name,
                eventRef: obj.eventRef,
                confirmed: obj.confirmed,
                clientName: obj.clientName,
                start: event.start,
                end: event.end
            } : obj);

            treatment.plannedvisits = treatment.plannedvisits.map(obj => obj.eventRef.id === event.id ? {
                name: obj.name,
                eventRef: obj.eventRef,
                confirmed: obj.confirmed,
                clientName: obj.clientName,
                start: event.start,
                end: event.end
            } : obj);

            batch.update(event.clientRef, {
                plannedvisits: client.plannedvisits,
            });

            batch.update(event.treatmentRef, {
                plannedvisits: treatment.plannedvisits,
            });

            batch.update(store.state.login.userData.salon.ref.collection('events').doc(event.id), {
                start: event.start,
                end: event.end,
            });

            await batch.commit();
            commit('eventUpdated', event);
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
    async confirmEvent({ commit, dispatch }, event) {
        try {
            const batch = db.batch();
            let
                clientDoc = await event.clientRef.get(),
                treatmentDoc = await event.treatmentRef.get();
            let client = clientDoc.data();
            client.id = clientDoc.id;
            let treatment = treatmentDoc.data();
            treatment.id = treatmentDoc.id;

            client.plannedvisits.find(v => {
                return v.start === event.start;
            }).confirmed = true;

            treatment.plannedvisits.find(v => {
                return v.start === event.start;
            }).confirmed = true;

            batch.update(store.state.login.userData.salon.ref.collection('events').doc(event.id), {
                confirmed: true,
            });

            batch.update(event.clientRef, {
                plannedvisits: client.plannedvisits,
            });

            batch.update(event.treatmentRef, {
                plannedvisits: treatment.plannedvisits,
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
    async archiveEvent({ commit, dispatch }, event) {
        try {
            const batch = db.batch();
            let
                clientDoc = await event.clientRef.get(),
                treatmentDoc = await event.treatmentRef.get();
            let client = clientDoc.data();
            client.id = clientDoc.id;
            let treatment = treatmentDoc.data();
            treatment.id = treatmentDoc.id;
            const salonId = store.state.login.userData.salon.ref.id;
            let urls = [];
            let i;
            for(i = 0; i < event.images.length; i++) {
                let file = event.images[i];
                let imageRef = storageRef.child(`${salonId}/${event.id}/${file.name}`);
                await imageRef.put(file);
                let url = await imageRef.getDownloadURL();
                urls.push(url);
            }
            event.imageUrls = urls;
            delete event.images;

            const clientEvent = client.plannedvisits.find(v => v.eventRef.id === event.id);
            clientEvent.imageUrls = urls;
            clientEvent.rate = event.rate;
            client.plannedvisits = client.plannedvisits.filter(v => v.eventRef.id !== event.id);
            client.pastvisits.push(clientEvent);

            const treatmentEvent = treatment.plannedvisits.find(v => v.eventRef.id === event.id);
            treatmentEvent.imageUrls = urls;
            treatmentEvent.rate = event.rate;
            treatment.plannedvisits = treatment.plannedvisits.filter(v => v.eventRef.id !== event.id);
            treatment.pastvisits.push(treatmentEvent);

            batch.delete(store.state.login.userData.salon.ref.collection('events').doc(event.id));
            batch.set(store.state.login.userData.salon.ref.collection('archivedevents').doc(event.id), event)

            batch.update(event.clientRef, {
                plannedvisits: client.plannedvisits,
                pastvisits: client.pastvisits,
                plannedcount: decrement,
                visits: increment,
            });

            batch.update(event.treatmentRef, {
                plannedvisits: treatment.plannedvisits,
                pastvisits: treatment.pastvisits,
                plannedcount: decrement,
                visits: increment,
            });

            batch.update(store.state.login.userData.salon.ref,{
                visits: increment,
            });

            await batch.commit();

            commit('setEvents', state.events.filter(v => v.id !== event.id));
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
    async currentEvent({ commit }) {
        const now = new Date();
        const event = state.todayEvents.find(v => {
            const tempStart = new Date(v.start);
            const tempEnd = new Date(v.end);
            return now >= tempStart && now <= tempEnd;
        });
        commit('setCurrentEvent', event);
    }
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
    eventAdded: (state, newEvent) => state.events.unshift(newEvent),
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