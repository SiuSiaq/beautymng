<template>
  <v-row class="pa-5" style="max-width: 100%">
    <v-col cols="6">
      <div class="caption">Nazwa</div>
      <div>{{ product.name }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Producent</div>
      <div>{{ product.producer }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Ilość w opakowaniu</div>
      <div>{{ product.newAmount }} {{ product.unit }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Dodano</div>
      <div>{{ registeredText }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Pozostało</div>
      <div>{{ product.amount }} {{ product.unit }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Pozostanie</div>
      <div>{{ product.plannedAmount }} {{ product.unit }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Użyto</div>
      <div>
        {{ product.used }}
        {{ product.used === 1 ? "raz" : "razy" }}
      </div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Cena</div>
      <div>{{ product.price }} zł</div>
    </v-col>
    <v-col cols="12">
      <div class="mt-4 d-flex">
        <v-btn
          v-if="product.id"
          text
          color="error"
          @click="deleteProduct(product.id)"
          >Usuń</v-btn
        >
        <v-spacer></v-spacer>
        <AddToStock :product="product" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AddToStock from "@/components/AddToStock";
export default {
  props: ["product"],
  components: {
    AddToStock,
  },
  methods: {
    ...mapActions(["removeProduct"]),
    async deleteProduct(id) {
      await this.removeProduct(id);
      this.$emit("productRemoved");
    },
  },
  computed: {
    ...mapGetters(["getAllProducts"]),
    registeredText() {
      if (this.product.registered) {
        const date = this.product.registered.toDate();
        let dd = String(date.getDate()).padStart(2, "0");
        let mm = String(date.getMonth() + 1).padStart(2, "0");
        let yy = date.getFullYear();
        return `${dd}.${mm}.${yy}`;
      } else {
        return "Brak";
      }
    },
  },
};
</script>
