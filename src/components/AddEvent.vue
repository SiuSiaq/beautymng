<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mobile"
    max-width="400"
    :hide-overlay="$vuetify.breakpoint.mobile"
    :transition="
      $vuetify.breakpoint.mobile
        ? 'dialog-bottom-transition'
        : 'scale-transition'
    "
  >
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
      <div style="max-width: 600px;" class="mx-auto">
        <v-form ref="form" v-model="valid" class="mx-5">
          <v-autocomplete
            @change="treatmentSelected"
            offset-y
            class="mt-4"
            v-model="selectedTreatmentId"
            :items="getAllTreatments"
            item-text="name"
            item-value="id"
            :rules="[(v) => !!v || 'Zabieg jest wymagany']"
            label="Zabieg"
            no-data-text="Brak zabiegu"
            required
          ></v-autocomplete>

          <v-autocomplete
            @change="clientSelected"
            offset-y
            v-model="selectedClientId"
            :items="getAllClients"
            item-text="fullname"
            item-value="id"
            :rules="[(v) => !!v || 'Klient jest wymagany']"
            label="Klient"
            no-data-text="Brak klienta"
            required
          ></v-autocomplete>

          <v-autocomplete
            offset-y
            @change="doctorSelected"
            v-model="selectedDoctorId"
            :items="getSalon.users"
            item-text="fullname"
            item-value="ref.id"
            :rules="[(v) => !!v || 'Wykonawca jest wymagany']"
            label="Wykonawca zabiegu"
            no-data-text="Brak wykonawcy"
            required
          ></v-autocomplete>

          <v-menu
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
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
                :rules="[(v) => !!v || 'Data zabiegu jest wymagana']"
              ></v-text-field>
            </template>
            <v-date-picker
              locale="pl-PL"
              v-model="dateDisplay"
              no-title
              @input="menu1 = false"
            ></v-date-picker>
          </v-menu>
          <v-row>
            <v-col cols="6">
              <v-select
                required
                :items="hours"
                label="Godzina"
                v-model="timeHour"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                :items="minutes"
                label="Minuty"
                v-model="timeMinute"
              ></v-select>
            </v-col>
          </v-row>
        </v-form>

        <v-card-actions>
          <v-btn @click="dialog = false" text>anuluj</v-btn>
          <v-btn @click="reset" text>resetuj</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :loading="loader"
            :disabled="!valid"
            @click="submit"
            >dodaj</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AddEvent",
  data: () => ({
    date: new Date(),
    dateDisplay: new Date().toISOString().slice(0, 10),
    menu1: false,
    loader: false,
    dialog: false,
    valid: true,
    selectedTreatmentId: null,
    selectedTreatment: null,
    selectedClientId: null,
    selectedClient: null,
    selectedDoctorId: null,
    selectedDoctor: null,
    selectedDate: null,
    doctor: null,
    hours: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    timeHour: new Date().getHours(),
    timeMinute: 0,
  }),
  methods: {
    ...mapActions(["addEvent"]),
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
      let startDate = new Date(this.date.getTime());
      startDate.setHours(this.timeHour);
      startDate.setMinutes(this.timeMinute);
      startDate.setSeconds(0);
      let endDate = new Date();
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
        clientRef: this.getUserData.salon.ref
          .collection("clients")
          .doc(client.id),
        treatmentRef: this.getUserData.salon.ref
          .collection("treatments")
          .doc(treatment.id),
        start: `${startDate
          .toISOString()
          .slice(0, 10)} ${finalHour}:${finalMinute}`,
        end: `${endDate
          .toISOString()
          .slice(0, 10)} ${endDate.getHours()}:${endDate.getMinutes()}`,
        startDate: startDate,
        endDate: endDate,
        doctor: this.selectedDoctor,
        doctorName: this.selectedDoctor.fullname,
        archived: false,
        category: this.selectedDoctor.fullname,
        price: treatment.price,
        additionalTreatments: [],
        products: treatment.products,
        surveys: treatment.surveys,
      };

      this.loader = true;
      await this.addEvent(newEvent);
      this.loader = false;
      this.dialog = false;
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.date = new Date();
      this.dateDisplay = new Date().toISOString().slice(0, 10);
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
    doctorSelected() {
      this.selectedDoctor = this.getSalon.users.find((v) => {
        return v.ref.id === this.selectedDoctorId;
      });
    },
    formatDate(date) {
      if (!date) return null;

      const year = date.getFullYear(),
        month = String(date.getDate()).padStart(2, "0"),
        day = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}-${month}-${year}`;
    },
    doctors() {
      let cats = [];
      this.getSalon.users.forEach((user) => {
        if (user.doctor) cats.push(`${user.name} ${user.surname}`);
      });
      console.log(cats);
      return cats;
    },
  },
  computed: {
    ...mapGetters([
      "getAllClients",
      "getAllTreatments",
      "getUserData",
      "getSalon",
    ]),
    computedDateFormatted: {
      get() {
        return this.formatDate(this.date);
      },
      set(val) {
        this.date = val;
      },
    },
  },
  watch: {
    dateDisplay(val) {
      this.date = new Date(Date.parse(val));
    },
  },
};
</script>
