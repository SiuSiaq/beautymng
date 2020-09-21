<template>
  <v-dialog v-model="dialog" max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn fixed bottom right fab color="secondary" v-bind="attrs" v-on="on">
        <v-icon large>mdi-plus-circle</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">
        Dodaj zabieg
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-form ref="form" v-model="valid" class="mx-5">
        <v-text-field
          class="mt-4"
          v-model="treatname"
          :counter="50"
          :rules="nameRules"
          label="Nazwa zabiegu"
          required
        ></v-text-field>
        <h3 class="caption mb-n3 mt-1">Czas zabiegu</h3>
        <v-row>
          <v-col cols="6">
            <v-select :items="hours" label="Godziny" v-model="timeHour"></v-select>
          </v-col>
          <v-col cols="6">
            <v-select :items="minutes" label="Minuty" v-model="timeMinute"></v-select>
          </v-col>
        </v-row>
        <v-text-field
          v-model="price"
          :rules="priceRules"
          label="Cena zabiegu"
          type="number"
          required
        ></v-text-field>
        <v-textarea
          rows="1"
          v-model="treatmentDesc"
          auto-grow
          clearable
          label="Opis"
          >
        </v-textarea>
        <div class="caption mb-2">Kolor</div>
        <v-color-picker required class="ml-5" v-model="color" hide-inputs></v-color-picker>
      </v-form>

      <v-card-actions>
        <v-btn @click="dialog = false" text>Anuluj</v-btn>
        <v-btn @click="reset" text>resetuj</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" text :loading="loader" :disabled="!valid" @click="submit">Dodaj</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "AddTreatment",
  data: () => ({
    treatmentDesc: '',
    loader: false,
    dialog: false,
    valid: true,
    hours: [1, 2, 3, 4, 5, 6],
    minutes: [0, 5, 10, 15, 20, 30, 45],
    color: '#D9486E',
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
    ...mapActions(['addTreatment']),
    async submit() {
      if (!this.$refs.form.validate()) return;
      if (this.timeHour || this.timeMinute) {
        if (!this.timeMinute) this.timeMinute = 0;
        if (!this.timeHour) this.timeHour = 0;

        const newTreatment = {
          name: this.treatname,
          hours: this.timeHour,
          minutes: this.timeMinute,
          price: this.price,
          color: this.color,
          visits: 0,
          plannedcount: 0,
          pastvisits: [],
          plannedvisits: [],
          description: this.treatmentDesc !== undefined ? this.treatmentDesc : '',
        };

        this.loader = true;
        await this.addTreatment(newTreatment);
        this.loader = false;
        this.dialog = false;
        this.reset();
        this.$emit('treatmentAdded');
        
      } else {
        this.timeError = true;
        return;
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
