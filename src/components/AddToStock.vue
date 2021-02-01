<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mobile"
    max-width="600"
    :hide-overlay="$vuetify.breakpoint.mobile"
    :transition="
      $vuetify.breakpoint.mobile
        ? 'dialog-bottom-transition'
        : 'scale-transition'
    "
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        dodaj do magazynu
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">
        Dodaj {{ product.name.toLowerCase() }} do magazynu
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-tabs v-model="tab" background-color="primary" light grow>
        <v-tab>
          opakowania
        </v-tab>
        <v-tab>
          {{ unitTabName }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-form ref="form" v-model="valid" class="mx-5">
            <v-text-field
              class="mt-4"
              v-model="packageAmount"
              type="number"
              :rules="packageRules"
              label="Ilość opakowań"
              required
            ></v-text-field>
            <div class="caption mt-2">Cena</div>
            <div>
              {{
                packageAmount ? `${packageAmount * product.price} zł` : "Brak"
              }}
            </div>
            <div class="d-flex">
              <v-checkbox
                v-model="isCustomPrice"
                label="Cena niestandardowa"
                class="mr-6"
              ></v-checkbox>
              <v-text-field
                type="number"
                label="Cena niestandardowa"
                v-model="customPrice"
                :disabled="!isCustomPrice"
              >
              </v-text-field>
            </div>
          </v-form>
        </v-tab-item>
        <v-tab-item>
          <v-form ref="form" v-model="valid" class="mx-5">
            <v-text-field
              class="mt-4"
              v-model="unitsAmount"
              type="number"
              :rules="unitsRules"
              :label="unitInputLabel"
              required
            ></v-text-field>
            <div class="caption mt-2">Cena</div>
            <div>
              {{
                unitsAmount
                  ? `${(
                      unitsAmount *
                      (product.price / product.newAmount)
                    ).toFixed(2)} zł`
                  : "Brak"
              }}
            </div>
            <div class="d-flex">
              <v-checkbox
                v-model="isCustomPrice"
                label="Cena niestandardowa"
                class="mr-6"
              ></v-checkbox>
              <v-text-field
                type="number"
                label="Cena niestandardowa"
                v-model="customPrice"
                :disabled="!isCustomPrice"
              >
              </v-text-field>
            </div>
          </v-form>
        </v-tab-item>
      </v-tabs-items>
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

      <div style="max-width: 600px;" class="mx-auto"></div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["product"],
  data: () => ({
    tab: 0,
    loader: false,
    dialog: false,
    valid: true,
    packageAmount: 0,
    packageRules: [
      (v) => !!v || "Ilość opakowań jest wymagana",
      (v) => (v && v > 0) || "Ilość opakowań musi być większa od 0",
    ],
    unitsAmount: 0,
    unitsRules: [
      (v) => !!v || "Ilość jednostek jest wymagana",
      (v) => (v && v > 0) || "Ilość jednostek musi być większa od 0",
    ],
    isCustomPrice: false,
    customPrice: 0,
  }),
  methods: {
    ...mapActions(["addProductToStock"]),
    async submit() {
      if (!this.$refs.form.validate()) return;

      this.loader = true;
      let price;

      if (this.isCustomPrice) {
        price = this.customPrice ? parseFloat(this.customPrice) : 0;
      } else {
        price = (
          this.unitsAmount *
          (this.product.price / this.product.newAmount)
        ).toFixed(2);
      }

      let amount;
      if (this.tab === 0) {
        amount = parseInt(this.packageAmount) * this.product.newAmount;
      } else {
        amount = parseFloat(this.unitsAmount);
      }

      await this.addProductToStock({
        price,
        id: this.product.id,
        amount,
      });

      this.loader = false;
      this.dialog = false;
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
    },
  },
  computed: {
    unitTabName() {
      switch (this.product.unit) {
        case "szt":
          return "sztuki";
        case "mg":
          return "miligramy";
        case "ml":
          return "mililitry";
        case "g":
          return "gramy";
        case "l":
          return "litry";
        case "kg":
          return "kilogramy";
        case "j":
          return "jednostki";
        default:
          return "jednostki";
      }
    },
    unitInputLabel() {
      switch (this.product.unit) {
        case "szt":
          return "Ilość sztuk";
        case "mg":
          return "Ilość miligramów";
        case "ml":
          return "Ilość mililitrów";
        case "g":
          return "Ilość gramów";
        case "l":
          return "Ilość litrów";
        case "kg":
          return "Ilość kilogramów";
        case "j":
          return "Ilość jednostkek";
        default:
          return "Ilość jednostkek";
      }
    },
  },
};
</script>
