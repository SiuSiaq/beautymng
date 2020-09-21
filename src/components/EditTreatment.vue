<template>
  <v-dialog v-model="dialog" max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">Edytuj</v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">
        Edytuj zabieg
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-form ref="form" v-model="valid" class="mx-5">
        <v-text-field
          class="mt-4"
          v-model="treatment.name"
          :counter="50"
          :rules="nameRules"
          label="Nazwa zabiegu"
          required
        ></v-text-field>
        <h3 class="caption mb-n3 mt-1">Czas zabiegu</h3>
        <v-row>
          <v-col cols="6">
            <v-select :items="hours" label="Godziny" v-model="treatment.hours"></v-select>
          </v-col>
          <v-col cols="6">
            <v-select :items="minutes" label="Minuty" v-model="treatment.minutes"></v-select>
          </v-col>
        </v-row>
        <v-text-field
          v-model="treatment.price"
          :rules="priceRules"
          label="Cena zabiegu"
          type="number"
          required
        ></v-text-field>
        <v-textarea
          rows="1"
          v-model="treatment.description"
          auto-grow
          clearable
          label="Opis"
          >
        </v-textarea>
        <div class="caption mb-2">Kolor</div>
        <v-color-picker required class="ml-5" v-model="treatment.color" hide-inputs></v-color-picker>
      </v-form>

      <v-card-actions>
        <v-btn @click="dialog = false" text>Anuluj</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" text :loading="loader" :disabled="!valid" @click="submit">Zapisz</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "EditTreatment",
  props: ["treatment"],
  data: () => ({
    addSuccess: false,
    timeError: false,
    loader: false,
    dialog: false,
    color: null,
    valid: true,
    hours: [1, 2, 3, 4, 5, 6],
    minutes: [0, 5, 10, 15, 20, 30, 45],
    timeHour: null,
    timeMinute: null,
    treatname: "",
    nameRules: [
      (v) => !!v || "Nazwa zabiegu jest wymagana",
      (v) =>
        (v && v.length <= 50) || "Nazwa zabiegu musi być krótsza niż 50 znaków",
    ],
    price: null,
    priceRules: [
      (v) => !!v || "Cena zabiegu jest wymagana",
      (v) => v > 0 || "Cena zabiegu musi być większa od 0",
    ],
  }),
  methods: {
    ...mapActions(['updateTreatment']),
    async submit() {
      if (!this.$refs.form.validate()) return;
      if (this.treatment.hours || this.treatment.minutes) {
        if (!this.treatment.minutes) this.treatment.minutes = 0;
        if (!this.treatment.hours) this.treatment.hours = 0;

        const newTreatment = {
          id: this.treatment.id,
          name: this.treatment.name,
          hours: this.treatment.hours,
          minutes: this.treatment.minutes,
          price: this.treatment.price,
          color: this.treatment.color,
          visits: this.treatment.visits,
          plannedvisits: this.treatment.plannedvisits,
          pastvisits: this.treatment.pastvisits,
          description: this.treatment.description !== undefined ? this.treatment.description : '',
        };

        this.loader = true;
        await this.updateTreatment(newTreatment);
        this.loader = false;
        this.dialog = false;
        this.reset();
      }
      return;
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
