<template>
  <div class="test">
    <v-container fluid>
      <AddProduct @productAdded="selectedProduct = getAllProducts[0]" />
      <v-row no-gutters>
        <v-col cols="12" md="3">
          <v-card class="px-4 pt-2">
            <v-autocomplete
              no-data-text="Brak produktów"
              @change="searchSelect"
              offset-y
              v-model="searchProductId"
              :items="getAllProducts"
              item-text="name"
              item-value="id"
              label="Produkt"
              prepend-icon="mdi-account-search-outline"
            ></v-autocomplete>
            <v-list
              v-if="!$vuetify.breakpoint.mobile"
              three-line
              style="height:80vh; overflow-y: scroll;"
            >
              <v-list-item-group>
                <v-list-item
                  @click="selectedProduct = product"
                  v-for="product in getAllProducts"
                  :key="product.id"
                >
                  <v-list-item-avatar
                    class="white--text"
                    :color="product.color"
                    >{{ product.name[0] }}</v-list-item-avatar
                  >
                  <v-list-item-content>
                    <v-list-item-title>{{ product.name }}</v-list-item-title>
                    <v-list-item-subtitle
                      >Obecnie: {{ product.amount }} {{ product.unit }}<br />
                      Pozostanie: {{ product.plannedAmount }} {{ product.unit }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="9">
          <v-row class="pa-5">
            <v-col cols="6">
              <div class="caption">Nazwa</div>
              <div>{{ selectedProduct.name }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Producent</div>
              <div>{{ selectedProduct.producer }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Ilość w opakowaniu</div>
              <div>{{ selectedProduct.newAmount }} {{ selectedProduct.unit }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="caption">Pozostało</div>
              <div>{{ selectedProduct.amount }} {{ selectedProduct.unit }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="caption">Pozostanie</div>
              <div>{{ selectedProduct.plannedAmount }} {{ selectedProduct.unit }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="caption">Dodano</div>
              <div>{{ registeredText }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Użyto</div>
              <div>{{ selectedProduct.used }}</div>
            </v-col>
            <v-col cols="12">
              <div class="mt-4">
                <v-btn
                  v-if="selectedProduct.id !== undefined"
                  text
                  color="error"
                  @click="deleteProduct(selectedProduct.id)"
                  >Usuń</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AddProduct from "@/components/AddProduct";

export default {
  name: "Clients",
  components: {
    AddProduct,
  },
  data: () => ({
    selectedProduct: {
      name: "",
      description: "",
      producer: "",
      unit: "",
      price: null,
      amount: null,
      newAmount: null,
      plannedAmount: null,
      used: null,
    },
    searchProductId: null,
  }),
  computed: {
    ...mapGetters(["getAllProducts"]),
    registeredText() {
      if (this.selectedProduct.registered) {
        const date = this.selectedProduct.registered.toDate();
        let dd = String(date.getDate()).padStart(2, "0");
        let mm = String(date.getMonth() + 1).padStart(2, "0");
        let yy = date.getFullYear();
        return `${dd}-${mm}-${yy}`;
      } else {
        return "Brak";
      }
    },
  },
  methods: {
    ...mapActions(["removeProduct"]),
    searchSelect() {
      if (this.searchProductId !== undefined) {
        this.selectedProduct = this.getAllProducts.find((v) => {
          return v.id === this.searchProductId;
        });
      }
    },
    async deleteProduct(id) {
      await this.removeProduct(id);
      this.getAllProducts.length > 0
        ? (this.selectedProduct = this.getAllProducts[0])
        : (this.selectedProduct = null);
    },
  },
  watch: {
    async selectedProduct(val) {
      if (val) {
        this.searchProductId = val.id;
      }
    },
  },
  mounted() {
    if (this.getAllProducts.length > 0) {
      this.selectedProduct = this.getAllProducts[0]
      this.searchProductId = this.getAllProducts[0].id
    }
  },
};
</script>
