<template>
  <div class="test">
    <v-container fluid>
      <AddTreatment @treatmentAdded="selectedTreatment = getAllTreatments[0]" />
      <v-row no-gutters>
        <v-col cols="12" md="3">
          <v-card
            class="px-4 pt-2"
            :rounded="$vuetify.breakpoint.mobile ? 'xl' : ''"
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
            <v-list
              v-if="!$vuetify.breakpoint.mobile"
              style="height:80vh; overflow-y: scroll;"
            >
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
          <v-row class="pa-5">
            <v-col cols="6">
              <div class="caption">Nazwa zabiegu</div>
              <div>{{ selectedTreatment.name }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Czas zabiegu</div>
              <div>
                {{ selectedTreatment.hours }} godziny
                {{ selectedTreatment.minutes }} minuty
              </div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Cena</div>
              <div>{{ selectedTreatment.price }} zł</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Wykonano</div>
              <div>{{ selectedTreatment.visits }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Zaplanowanych wizyt</div>
              <div>{{ selectedTreatment.plannedcount }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Wymagane produkty</div>
              <div v-for="(product, i) in selectedTreatment.products" :key="i">
                {{product.name}} {{product.amount}} {{product.unit}}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="caption">Opis</div>
              <div>
                {{
                  selectedTreatment.description !== ""
                    ? selectedTreatment.description
                    : "Brak opisu"
                }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="caption">Zaplanowane wizyty</div>
              <div
                v-if="
                  selectedTreatment.plannedcount === 0 ||
                    selectedTreatment.plannedcount === undefined
                "
              >
                Brak zaplanowanych wizyt
              </div>
              <v-row v-else>
                <v-col
                  cols="12"
                  md="3"
                  v-for="plvisit in plannedvisits"
                  :key="plvisit.start"
                >
                  <v-card>
                    <v-card-text>
                      <div
                        v-if="plvisit.confirmed"
                        class="success--text subtitle-1"
                      >
                        Potwierdzono
                      </div>
                      <div v-else class="error--text subtitle-1">
                        Nie potwierdzono
                      </div>
                      <div class="text-h5 text--primary">
                        {{ plvisit.start.slice(0, 10) }}<br />{{
                          plvisit.start.slice(10)
                        }}
                      </div>
                      <div class="text-h6 font-weight-regular">
                        {{ plvisit.clientName }}
                        <br />
                      </div>
                    </v-card-text>
                    <v-card-actions class="mt-n4">
                      <DeleteEvent
                        @eventRemoved="eventDeleted($event)"
                        :eventRef="plvisit.eventRef"
                      />
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-expansion-panels focusable>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    >Wykonane zabiegi</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <v-list>
                      <v-list-item-group>
                        <Visit
                          :event="pastevent"
                          v-for="pastevent in pastvisits"
                          :key="pastevent.id"
                        />
                      </v-list-item-group>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <div class="mt-4" v-if="selectedTreatment.id !== undefined">
                <v-btn
                  text
                  color="error"
                  @click="deleteTreatment(selectedTreatment.id)"
                  >Usuń</v-btn
                >
                <EditTreatment :treatment="selectedTreatment" />
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
import AddTreatment from "@/components/AddTreatment";
import EditTreatment from "@/components/EditTreatment";
import DeleteEvent from "@/components/DeleteEvent";
import Visit from "@/components/Visit";

export default {
  name: "Treatments",
  components: {
    AddTreatment,
    EditTreatment,
    DeleteEvent,
    Visit,
  },
  data: () => ({
    selectedTreatment: {
      name: "",
      color: "#ffffff",
      count: 0,
      hours: 0,
      minutes: 0,
      price: 0,
      plannedcount: 0,
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
    async deleteTreatment(id) {
      await this.removeTreatment(id);
      this.getAllTreatments.length > 0
        ? (this.selectedTreatment = this.getAllTreatments[1])
        : (this.selectedTreatment = null);
    },
    async eventDeleted(event) {
      this.selectedTreatment.plannedvisits = this.selectedTreatment.plannedvisits.filter(
        (v) => v.eventRef.id !== event.id
      );
      this.selectedTreatment.plannedcount--;
    },
  },
  watch: {
    async selectedTreatment(val) {
      if (val) {
        this.searchTreatmentId = val.id;
        let visits = await this.fetchTreatmentVisits(val.id);
        this.plannedvisits = visits.plannedvisits;
        this.pastvisits = visits.pastvisits;
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
