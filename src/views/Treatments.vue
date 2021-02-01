<template>
  <v-container fluid :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''">
    <AddTreatment @treatmentAdded="selectedTreatment = getAllTreatments[0]" />
    <v-row no-gutters v-if="!$vuetify.breakpoint.mobile">
      <v-col cols="12" md="3">
        <v-card
          class="px-4 pt-2"
          :rounded="$vuetify.breakpoint.mobile ? 'xl' : ''"
          height="100%"
        >
          <v-autocomplete
            no-data-text="Brak zabiegów"
            @change="searchSelect"
            offset-y
            v-model="searchTreatmentId"
            :items="getAllTreatments"
            item-text="name"
            item-value="id"
            label="Zabieg"
            prepend-icon="mdi-needle"
          ></v-autocomplete>
          <v-list class="treatmentList">
            <v-list-item-group>
              <v-list-item
                @click="selectedTreatment = treatment"
                v-for="treatment in getAllTreatments"
                :key="treatment.id"
              >
                <v-list-item-avatar
                  class="white--text"
                  :color="treatment.color"
                  >{{ treatment.name[0] }}</v-list-item-avatar
                >
                <v-list-item-content>
                  <v-list-item-title>{{ treatment.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
          <TreatmentPreview class="treatmentPreview" :treatment="selectedTreatment" @treatmentRemoved="treatmentRemoved" />
      </v-col>
    </v-row>

    <div v-else style="height: 100%; width: 100%">
      <v-tabs v-model="tab" background-color="primary" color="white" grow>
        <v-tab v-for="item in ['Lista', 'Zabieg']" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item class="pa-4">
          <v-autocomplete
            no-data-text="Brak zabiegów"
            @change="searchSelect"
            offset-y
            v-model="searchTreatmentId"
            :items="getAllTreatments"
            item-text="name"
            item-value="id"
            label="Zabieg"
            prepend-icon="mdi-needle"
          ></v-autocomplete>
          <v-list max-height="100%">
            <v-list-item-group>
              <v-list-item
                @click="selectedTreatment = treatment"
                v-for="treatment in getAllTreatments"
                :key="treatment.id"
              >
                <v-list-item-avatar
                  class="white--text"
                  :color="treatment.color"
                  >{{ treatment.name[0] }}</v-list-item-avatar
                >
                <v-list-item-content>
                  <v-list-item-title>{{ treatment.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-tab-item>

        <v-tab-item>
          <TreatmentPreview :treatment="selectedTreatment" @treatmentRemoved="treatmentRemoved" />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TreatmentPreview from "@/components/TreatmentPreview";
import AddTreatment from "@/components/AddTreatment";

export default {
  components: {
    AddTreatment,
    TreatmentPreview,
  },
  data: () => ({
    first: false,
    tab: 0,
    selectedTreatment: {
      name: "",
      color: "#ffffff",
      count: 0,
      hours: 0,
      minutes: 0,
      price: 0,
      plannedcount: 0,
      surveys: [],
      products: [],
    },
    pastvisits: [],
    plannedvisits: [],
    searchTreatmentId: null,
  }),
  computed: {
    ...mapGetters(["getAllTreatments"]),
  },
  methods: {
    ...mapActions(["removeTreatment", "fetchTreatmentVisits"]),
    getRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
    searchSelect() {
      if (this.searchTreatmentId !== undefined) {
        this.selectedTreatment = this.getAllTreatments.find((v) => {
          return v.id === this.searchTreatmentId;
        });
      }
    },
    treatmentRemoved() {
      this.getAllTreatments.length > 0
        ? (this.selectedTreatment = this.getAllTreatments[1])
        : (this.selectedTreatment = null);
    },
  },
  watch: {
    async selectedTreatment(val) {
      if (val) {
        if (this.first) this.tab = 1;
        else this.first = true;
        this.searchTreatmentId = val.id;
      }
    },
  },
  mounted() {
    if (this.getAllTreatments.length > 0) {
      this.selectedTreatment = this.getAllTreatments[0];
      this.searchTreatmentId = this.getAllTreatments[0].id;
    }
  },
};
</script>

<style scoped>
.treatmentPreview {
  max-height: 87vh;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.treatmentPreview::-webkit-scrollbar {
  display: none;
}

.treatmentList {
  overflow-y: scroll;
  max-height: 74vh;
  min-height: 74vh;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.treatmentList::-webkit-scrollbar {
  display: none;
}
</style>
