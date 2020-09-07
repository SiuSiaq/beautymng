<template>
  <v-dialog v-model="dialog" max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">
        Edytuj termin zabiegu
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-form ref="form" v-model="valid" class="mx-5">
        <div class="caption mt-4">Poprzedni termin</div>
        <div class="mb-5">{{getSelectedEvent.start}}</div>

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
        <v-spacer></v-spacer>
        <v-btn color="primary" text :loading="loader" :disabled="!valid" @click="submit">zapisz</v-btn>
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
    selectedDate: null,
    hours: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    minutes: [0, 10, 15, 20, 30, 40, 45, 50],
    timeHour: null,
    timeMinute: null,
  }),
  methods: {
    ...mapActions(["editEvent"]),
    async submit() {
      if (!this.$refs.form.validate() || !this.timeHour) return;
      if (!this.timeMinute) this.timeMinute = 0;

      let finalHour, finalMinute;

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
          this.getSelectedEvent.time * 60 * 1000
      );

      this.getSelectedEvent.start = `${startDate.getFullYear()}-${
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
        }`;

        this.getSelectedEvent.end = `${endDate.getFullYear()}-${
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
        }`;

      this.loader = true;
      await this.editEvent(this.getSelectedEvent);
      this.loader = false;
      this.dialog = false;
      this.reset();
      this.$emit('eventUpdated');
    },
    reset() {
      this.$refs.form.reset();
      this.date = new Date().toISOString().substr(0, 10);
    },
    formatDate(date) {
      if (!date) return null;

      const year = date.slice(0, 4),
        month = date.slice(5, 7),
        day = date.slice(8, 10);
      return `${year}-${month}-${day}`;
    },
  },
  computed: {
    ...mapGetters(["getSelectedEvent"]),
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

