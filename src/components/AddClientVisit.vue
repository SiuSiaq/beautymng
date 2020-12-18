<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-icon>
          <v-icon>mdi-account-arrow-left</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Umów nowego klienta</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-card>
      <v-card-title>Umów nowego klienta na wizytę</v-card-title>

      <v-stepper v-model="el">
        <v-stepper-header>
          <v-stepper-step :complete="el > 1" step="1">
            Dodaj klienta
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="el > 2" step="2">
            Umów wizytę
          </v-stepper-step>

          <v-divider></v-divider>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form ref="clientForm" v-model="validClient" class="mx-5">
              <v-text-field
                class="mt-4"
                v-model="clientName"
                :counter="50"
                :rules="nameRules"
                label="Imię"
                required
              ></v-text-field>

              <v-text-field
                v-model="clientSurname"
                :counter="50"
                :rules="surnameRules"
                label="Nazwisko"
                required
              ></v-text-field>

              <v-text-field
                v-model="clientEmail"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="clientPhone"
                :rules="phoneRules"
                label="Telefon"
                required
              ></v-text-field>
            </v-form>
            <v-btn color="primary" @click="clientClick" :loading="clientLoader"
              >Dalej</v-btn
            >
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-form ref="eventForm" v-model="validEvent" class="mx-5">
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
                <v-date-picker
                  v-model="date"
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
            <v-btn color="primary" :loading="eventLoader" @click="eventSubmit">Zapisz</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: (vm) => ({
    dialog: false,
    el: 1,
    clientLoader: false,
    eventLoader: false,
    validClient: true,
    validEvent: false,
    clientName: "",
    clientSurname: "",
    nameRules: [
      (v) => !!v || "Imię jest wymagane",
      (v) => (v && v.length <= 50) || "Imię musi być krótsze niż 50 znaków",
    ],
    surnameRules: [
      (v) => !!v || "Nazwisko jest wymagane",
      (v) => (v && v.length <= 50) || "Nazwisko musi być krótsze niż 50 znaków",
    ],
    clientEmail: "",
    emailRules: [
      (v) => !!v || "Email jest wymagany",
      (v) => /.+@.+/.test(v) || "Nie poprawny email",
    ],
    clientPhone: "",
    phoneRules: [
      (v) => !!v || "Numer telefonu jest wymagany",
      (v) => /^\d{9}$/.test(v) || "Niepoprawny numer telefonu",
    ],
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false,
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
    timeHour: null,
    timeMinute: null,
  }),
  methods: {
    ...mapActions(["addClient", "addEvent", "fetchClients", "fetchTreatments"]),
    async clientClick() {
      if (!this.$refs.clientForm.validate()) return;

      const newClient = {
        name: this.clientName,
        surname: this.clientSurname,
        fullname: `${this.clientName} ${this.clientSurname}`,
        email: this.clientEmail,
        phone: this.clientPhone,
        registered: new Date(),
        visits: 0,
        plannedcount: 0,
        plannedvisits: [],
        pastvisits: [],
        color: this.getRandomColor(),
      };

      this.clientLoader = true;
      await this.addClient(newClient);
      this.clientLoader = false;
      this.el = 2;
    },
    async eventSubmit() {
      if (!this.$refs.eventForm.validate() || !this.timeHour) return;
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
      };

      this.eventLoader = true;
      await this.addEvent(newEvent);
      this.eventLoader = false;
      this.dialog = false;
    },
    getRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
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

      const year = date.slice(0, 4),
        month = date.slice(5, 7),
        day = date.slice(8, 10);
      return `${year}-${month}-${day}`;
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
  mounted() {
    this.fetchClients();
    this.fetchTreatments();
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
};
</script>
