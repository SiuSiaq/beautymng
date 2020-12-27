<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mobile"
    max-width="400"
    :hide-overlay="$vuetify.breakpoint.mobile"
    :transition="$vuetify.breakpoint.mobile ? 'dialog-bottom-transition': 'scale-transition'"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn fixed bottom right fab color="secondary" v-bind="attrs" v-on="on">
        <v-icon large>mdi-plus-circle</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">
        Dodaj produkt
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-form ref="form" v-model="valid" class="mx-5">
        <v-text-field
          class="mt-4"
          v-model="name"
          :counter="50"
          :rules="nameRules"
          label="Nazwa produktu"
          required
        ></v-text-field>
        <v-text-field
          class="mt-4"
          v-model="producer"
          :counter="50"
          :rules="producerRules"
          label="Nazwa producenta"
        ></v-text-field>
        <v-select
          class="mt-4"
          v-model="unit"
          :rules="unitRules"
          :items="units"
          label="Jednostka ilości"
          required
        ></v-select>
        <v-text-field
          v-model="price"
          :rules="priceRules"
          label="Cena produktu"
          type="number"
          required
        ></v-text-field>
        <v-text-field
          v-model="newAmount"
          :rules="newAmountRules"
          label="Ilość produktu w opkakowaniu"
          type="number"
          required
        ></v-text-field>
        <v-text-field
          v-model="amount"
          :rules="amountRules"
          label="Ilość produktu w magazynie"
          type="number"
        ></v-text-field>
        <v-textarea
          rows="1"
          v-model="productDesc"
          auto-grow
          clearable
          label="Opis"
        >
        </v-textarea>
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
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    productDesc: "",
    loader: false,
    dialog: false,
    valid: true,
    color: "#D9486E",
    name: "",
    nameRules: [
      (v) => !!v || "Nazwa produktu jest wymagana",
      (v) =>
        (v && v.length <= 50) || "Nazwa produktu musi być krótsza niż 50 znaków",
    ],
    producer: "",
    producerRules: [
      (v) =>
        (v && v.length <= 50) || "Nazwa producenta musi być krótsza niż 50 znaków",
    ],
    unit: "",
    unitRules: [
      (v) => !!v || "Jednostka jest wymagana",
    ],
    units: ['szt', 'mg', 'ml', 'g', 'l', 'kg', 'j'],
    amount: null,
    amountRules: [
      (v) => v >= 0 || "Obecna ilość produku musi być większa lub równa 0",
    ],
    newAmount: null,
    newAmountRules: [
      (v) => !!v || "Ilość produktu w nowym opakowaniu jest wymagana",
      (v) => v > 0 || "Ilość produktu w nowym opakowaniu musi być większa od 0",
    ],
    price: null,
    priceRules: [
      (v) => !!v || "Cena produktu jest wymagana",
      (v) => v > 0 || "Cena produktu musi być większa od 0",
    ],
  }),
  methods: {
    ...mapActions(["addProduct"]),
    async submit() {
      if (!this.$refs.form.validate()) return;

        const newProduct = {
          name: this.name,
          producer: this.producer ? this.producer : "Brak producenta",
          amount: this.amount ? parseFloat(this.amount) : 0,
          price: parseFloat(this.price),
          color: this.color,
          description:
            this.productDesc !== undefined ? this.productDesc : "",
          unit: this.unit,
          newAmount: parseFloat(this.newAmount),
          plannedAmount: 0,
          used: 0,
          registered: new Date(),
        };

        this.loader = true;
        await this.addProduct(newProduct);
        this.loader = false;
        this.dialog = false;
        this.reset();
        this.$emit("productAdded");
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
