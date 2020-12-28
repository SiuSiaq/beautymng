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
        Dodaj zabieg
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <div style="max-width: 600px;" class="mx-auto">
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
              <v-select
                :items="hours"
                label="Godziny"
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
          <v-btn
            text
            color="primary"
            @click="products.push({ id: null, amount: null })"
            class="mb-2"
            >Dodaj produkt</v-btn
          >
          <div v-for="(product, i) in products" :key="i">
            <v-autocomplete
              class="mt-2"
              v-model="products[i].id"
              :items="getAllProducts"
              item-text="name"
              item-value="id"
              label="Produkt"
              no-data-text="Brak produktów"
              required
            ></v-autocomplete>
            <div class="d-flex justify-center align-center">
              <v-text-field
                v-model="product.amount"
                :rules="amountRules"
                label="Ilość wymagana do zabiegu"
                type="number"
                required
              ></v-text-field>
              <v-btn icon class="ml-3"
                ><v-icon color="error" @click="products.splice(i, 1)"
                  >mdi-delete</v-icon
                ></v-btn
              >
            </div>
          </div>
          <div class="caption mb-2">Kolor</div>
          <v-color-picker
            required
            class="ml-5"
            v-model="color"
            hide-inputs
          ></v-color-picker>
        </v-form>

        <v-card-actions>
          <v-btn @click="dialog = false" text>Anuluj</v-btn>
          <v-btn @click="reset" text>resetuj</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :loading="loader"
            :disabled="!valid"
            @click="submit"
            >Dodaj</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AddTreatment",
  data: () => ({
    products: [],
    treatmentDesc: "",
    loader: false,
    dialog: false,
    valid: true,
    hours: [0, 1, 2, 3, 4, 5, 6],
    minutes: [0, 5, 10, 15, 20, 30, 45],
    color: "#D9486E",
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
    amountRules: [
      (v) => !!v || "Cena zabiegu jest wymagana",
      (v) => v > 0 || "Cena zabiegu musi być większa od 0",
    ],
  }),
  methods: {
    ...mapActions(["addTreatment"]),
    async submit() {
      if (!this.$refs.form.validate()) return;
      if (this.timeHour || this.timeMinute) {
        if (!this.timeMinute) this.timeMinute = 0;
        if (!this.timeHour) this.timeHour = 0;

        if (this.products.length > 0) {
          this.products.forEach((p) => {
            const tmp = this.getAllProducts.find((v) => v.id === p.id);
            if (tmp) {
              p.name = tmp.name;
              p.amount = parseFloat(p.amount);
              p.unit = tmp.unit;
              p.ref = this.getUserData.salon.ref
                .collection("products")
                .doc(tmp.id);
              delete p.id;
            }
          });
        }

        const newTreatment = {
          name: this.treatname,
          hours: this.timeHour,
          minutes: this.timeMinute,
          price: parseFloat(this.price),
          products: this.products ? this.products : [],
          color: this.color,
          visits: 0,
          plannedcount: 0,
          description:
            this.treatmentDesc !== undefined ? this.treatmentDesc : "",
        };

        this.loader = true;
        await this.addTreatment(newTreatment);
        this.loader = false;
        this.dialog = false;
        this.reset();
        this.$emit("treatmentAdded");
      } else {
        this.timeError = true;
        return;
      }
    },
    reset() {
      this.$refs.form.reset();
      this.products = [];
    },
  },
  computed: {
    ...mapGetters(["getAllProducts", "getUserData"]),
  },
};
</script>
