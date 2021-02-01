<template>
  <v-container fluid :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''">
    <AddProduct @productAdded="selectedProduct = getAllProducts[0]" />
    <v-row no-gutters v-if="!$vuetify.breakpoint.mobile">
      <v-col cols="12" md="3">
        <v-card class="px-4 pt-2" height="100%">
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
          <v-list three-line class="productList">
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
                    >Obecnie:
                    <span
                      :class="
                        product.amount < product.newAmount ? 'error--text' : ''
                      "
                      >{{ product.amount }} {{ product.unit }}</span
                    ><br />
                    Pozostanie:
                    <span
                      :class="
                        product.plannedAmount < product.newAmount
                          ? 'error--text'
                          : ''
                      "
                      >{{ product.plannedAmount }} {{ product.unit }}</span
                    ></v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <ProductPreview
          @productRemoved="productRemoved"
          :product="selectedProduct"
          class="productPreview"
        />
      </v-col>
    </v-row>

    <div v-else style="height: 100%; width: 100%">
      <v-tabs v-model="tab" background-color="primary" color="white" grow>
        <v-tab v-for="item in ['Lista', 'Produkt']" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item class="pa-4">
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
          <v-list three-line max-height="100%">
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
                    >Obecnie:
                    <span
                      :class="
                        product.amount < product.newAmount ? 'error--text' : ''
                      "
                      >{{ product.amount }} {{ product.unit }}</span
                    ><br />
                    Pozostanie:
                    <span
                      :class="
                        product.plannedAmount < product.newAmount
                          ? 'error--text'
                          : ''
                      "
                      >{{ product.plannedAmount }} {{ product.unit }}</span
                    ></v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-tab-item>
        <v-tab-item>
          <ProductPreview
            @productRemoved="productRemoved"
            :product="selectedProduct"
          />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AddProduct from "@/components/AddProduct";
import ProductPreview from "@/components/ProductPreview";

export default {
  name: "Clients",
  components: {
    AddProduct,
    ProductPreview,
  },
  data: () => ({
    tab: 0,
    first: false,
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
        return `${dd}.${mm}.${yy}`;
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
    productRemoved() {
      this.getAllProducts.length > 0
        ? (this.selectedProduct = this.getAllProducts[0])
        : (this.selectedProduct = null);
    },
  },
  watch: {
    async selectedProduct(val) {
      if (val) {
        if (this.first) this.tab = 1;
        else this.first = true;
        this.searchProductId = val.id;
      }
    },
  },
  mounted() {
    if (this.getAllProducts.length > 0) {
      this.selectedProduct = this.getAllProducts[0];
      this.searchProductId = this.getAllProducts[0].id;
    }
  },
};
</script>

<style scoped>
.productPreview {
  max-height: 87vh;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.productPreview::-webkit-scrollbar {
  display: none;
}

.productList {
  overflow-y: scroll;
  max-height: 74vh;
  min-height: 74vh;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.productList::-webkit-scrollbar {
  display: none;
}
</style>
