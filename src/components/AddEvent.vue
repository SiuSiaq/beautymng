<template>
  <v-dialog v-model="dialog" max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn fixed bottom right fab color="secondary" v-bind="attrs" v-on="on">
        <v-icon large>mdi-plus-circle</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">
        Nowy zabieg
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-form ref="form" v-model="valid" class="mx-5">
        <v-autocomplete
          @change="treatmentSelected"
          offset-y
          class="mt-4"
          v-model="selectedTreatmentId"
          :items="getAllTreatments"
          item-text="name"
          item-value="id"
          :rules="[v => !!v || 'Zabieg jest wymagany']"
          label="Zabieg"
          required
        ></v-autocomplete>

        <v-autocomplete
          @change="clientSelected"
          offset-y
          v-model="selectedClientId"
          :items="getAllClients"
          item-text="fullname"
          item-value="id"
          :rules="[v => !!v || 'Klient jest wymagany']"
          label="Klient"
          required
        ></v-autocomplete>

        <v-menu
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              required
              v-model="computedDateFormatted"
              label="Data zabiegu"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
        </v-menu>
        <v-row>
          <v-col cols="6">
            <v-select required :items="hours" label="Godzina" v-model="timeHour"></v-select>
          </v-col>
          <v-col cols="6">
            <v-select :items="minutes" label="Minuty" v-model="timeMinute"></v-select>
          </v-col>
        </v-row>
      </v-form>

      <v-card-actions>
        <v-btn @click="dialog = false" text>anuluj</v-btn>
        <v-btn @click="reset" text>resetuj</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" text :loading="loader" :disabled="!valid" @click="submit">dodaj</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AddEvent",
  data: (vm) => ({
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false,
    loader: false,
    dialog: false,
    valid: true,
    selectedTreatmentId: null,
    selectedTreatment: null,
    selectedClientId: null,
    selectedClient: null,
    selectedDate: null,
    hours: [1, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    timeHour: null,
    timeMinute: null,
  }),
  methods: {
    ...mapActions(["addEvent", "fetchClients", "fetchTreatments"]),
    async submit() {
      if (!this.$refs.form.validate() || !this.timeHour) return;
      if (!this.timeMinute) this.timeMinute = 0;

      let finalHour,
        finalMinute,
        treatment = this.selectedTreatment,
        client = this.selectedClient;

      this.timeHour < 10
        ? (finalHour = `0${this.timeHour}`)
        : (finalHour = `${this.timeHour}`);
      this.timeMinute < 10
        ? (finalMinute = `0${this.timeMinute}`)
        : (finalMinute = `${this.timeMinute}`);
      const startDate = new Date(
        `${this.computedDateFormatted} ${finalHour}:${finalMinute}`
      );
      let endDate = new Date(
        `${this.computedDateFormatted} ${finalHour}:${finalMinute}`
      );
      endDate.setTime(
        startDate.getTime() +
          treatment.hours * 60 * 60 * 1000 +
          treatment.minutes * 60 * 1000
      );

      const newEvent = {
        name: treatment.name,
        time: treatment.hours * 60 + treatment.minutes,
        color: treatment.color,
        confirmed: false,
        clientName: `${client.name} ${client.surname}`,
        clientPhone: client.phone,
        clientEmail: client.email,
        clientRef: this.getUserData.salon.ref.collection("clients").doc(client.id),
        treatmentRef: this.getUserData.salon.ref.collection("treatments").doc(treatment.id),
        start: `${startDate.getFullYear()}-${
          startDate.getMonth() + 1 < 10
            ? "0" + (startDate.getMonth() + 1)
            : startDate.getMonth() + 1
        }-${
          startDate.getDate() < 10
            ? "0" + startDate.getDate()
            : startDate.getDate()
        } ${
          startDate.getHours() < 10
            ? "0" + startDate.getHours()
            : startDate.getHours()
        }:${
          startDate.getMinutes() < 10
            ? "0" + startDate.getMinutes()
            : startDate.getMinutes()
        }`,
        end: `${endDate.getFullYear()}-${
          endDate.getMonth() + 1 < 10
            ? "0" + (endDate.getMonth() + 1)
            : endDate.getMonth() + 1
        }-${
          endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate()
        } ${
          endDate.getHours() < 10
            ? "0" + endDate.getHours()
            : endDate.getHours()
        }:${
          endDate.getMinutes() < 10
            ? "0" + endDate.getMinutes()
            : endDate.getMinutes()
        }`,
      };

      this.loader = true;
      await this.addEvent(newEvent);
      this.loader = false;
      this.dialog = false;
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.date = new Date().toISOString().substr(0, 10);
    },
    treatmentSelected() {
      this.selectedTreatment = this.getAllTreatments.find((v) => {
        return v.id === this.selectedTreatmentId;
      });
    },
    clientSelected() {
      this.selectedClient = this.getAllClients.find((v) => {
        return v.id === this.selectedClientId;
      });
    },
    formatDate(date) {
      if (!date) return null;

      const year = date.slice(0, 4),
        month = date.slice(5, 7),
        day = date.slice(8, 10);
      return `${year}-${month}-${day}`;
    },
  },
  mounted() {
    this.fetchClients();
    this.fetchTreatments();
  },
  computed: {
    ...mapGetters(["getAllClients", "getAllTreatments", 'getUserData']),
    computedDateFormatted: {
      get() {
        return this.formatDate(this.date);
      }, set(val) {
        this.date = val;
      }
    },
  },
};
</script>
