<template>
  <v-container fluid :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''">
    <v-row no-gutters v-if="!$vuetify.breakpoint.mobile">
      <AddProduct @productAdded="selectedProduct = getAllProducts[0]" />
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
          <v-list three-line style="height:80vh; overflow-y: scroll;">
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
            <div>
              {{ selectedProduct.newAmount }} {{ selectedProduct.unit }}
            </div>
          </v-col>
          <v-col cols="6">
            <div class="caption">Dodano</div>
            <div>{{ registeredText }}</div>
          </v-col>
          <v-col cols="6">
            <div class="caption">Pozostało</div>
            <div>{{ selectedProduct.amount }} {{ selectedProduct.unit }}</div>
          </v-col>
          <v-col cols="6">
            <div class="caption">Pozostanie</div>
            <div>
              {{ selectedProduct.plannedAmount }} {{ selectedProduct.unit }}
            </div>
          </v-col>
          <v-col cols="6">
            <div class="caption">Użyto</div>
            <div>
              {{ selectedProduct.used }}
              {{ selectedProduct.used === 1 ? "raz" : "razy" }}
            </div>
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
                    >Obecnie: {{ product.amount }} {{ product.unit }}<br />
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
          <AddProduct @productAdded="selectedProduct = getAllProducts[0]" />
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
              <div>
                {{ selectedProduct.newAmount }} {{ selectedProduct.unit }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Dodano</div>
              <div>{{ registeredText }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Pozostało</div>
              <div>{{ selectedProduct.amount }} {{ selectedProduct.unit }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Pozostanie</div>
              <div>
                {{ selectedProduct.plannedAmount }} {{ selectedProduct.unit }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Użyto</div>
              <div>
                {{ selectedProduct.used }}
                {{ selectedProduct.used === 1 ? "raz" : "razy" }}
              </div>
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
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
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
