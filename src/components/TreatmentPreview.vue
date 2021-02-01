<template>
  <v-row class="pa-5">
    <v-col cols="6">
      <div class="caption">Nazwa zabiegu</div>
      <div>{{ treatment.name }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Czas zabiegu</div>
      <div>{{ treatment.hours }} godziny {{ treatment.minutes }} minuty</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Cena</div>
      <div>{{ treatment.price }} zł</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Wykonano</div>
      <div>{{ treatment.visits }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Zaplanowanych wizyt</div>
      <div>{{ treatment.plannedcount }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Wymagane produkty</div>
      <div v-if="treatment.products && treatment.products.length == 0">
        Brak wymaganych produktów
      </div>
      <div v-else v-for="(product, i) in treatment.products" :key="i">
        {{ product.name }} {{ product.amount }} {{ product.unit }}
      </div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Ankiety</div>
      <div v-if="treatment.surveys && treatment.surveys.length == 0">
        Brak ankiet
      </div>
      <div v-else v-for="(survey, i) in treatment.surveys" :key="i">
        {{ survey.name }}, {{ survey.recipient }}, <br />{{ survey.timeType }}
      </div>
    </v-col>
    <v-col cols="12">
      <div class="caption">Opis</div>
      <div>
        {{
          treatment.description !== "" ? treatment.description : "Brak opisu"
        }}
      </div>
    </v-col>
    <v-col cols="12">
      <div class="caption">Zaplanowane wizyty</div>
      <div
        v-if="
          treatment.plannedcount === 0 || treatment.plannedcount === undefined
        "
      >
        Brak zaplanowanych wizyt
      </div>
      <div v-else>
        <v-list two-line>
          <v-list-item-group>
            <v-list-item v-for="plvisit in plannedvisits" :key="plvisit.id">
              <v-list-item-avatar>
                <div class="text-subtitle-1">
                  {{ plvisit.start.slice(11) }}
                </div>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ plvisit.clientName }}</v-list-item-title>
                <v-list-item-subtitle
                  >{{ plvisit.start.slice(0, 10) }}<br />Status:
                  <span
                    :class="plvisit.confirmed ? 'success--text' : 'error--text'"
                    >{{
                      plvisit.confirmed ? "Potwierdzono" : "Nie potwierdzono"
                    }}</span
                  ></v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </v-col>
    <v-col cols="12">
      <v-expansion-panels focusable>
        <v-expansion-panel>
          <v-expansion-panel-header>Wykonane zabiegi</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item-group>
                <Visit
                  :treatment="true"
                  :event="pastevent"
                  v-for="pastevent in pastvisits"
                  :key="pastevent.id"
                />
              </v-list-item-group>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="mt-4" v-if="treatment.id !== undefined">
        <v-btn text color="error" @click="deleteTreatment(treatment.id)"
          >Usuń</v-btn
        >
        <EditTreatment :treatment="treatment" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import EditTreatment from "@/components/EditTreatment";
import Visit from "@/components/Visit";

export default {
  props: ["treatment"],
  components: {
    EditTreatment,
    Visit,
  },
  data: () => ({
    plannedvisits: [],
    pastvisits: [],
  }),
  methods: {
    ...mapActions(["fetchTreatmentVisits", "removeTreatment"]),
    async deleteTreatment(id) {
      await this.removeTreatment(id);
      this.$emit("treatmentRemoved");
    },
    async getVisits() {
      if (this.treatment.id) {
        let visits = await this.fetchTreatmentVisits(this.treatment.id);
        this.plannedvisits = [...visits.plannedvisits].sort((a, b) => {
          return b.startDate.toDate() - a.startDate.toDate();
        });
        this.pastvisits = [...visits.pastvisits].sort((a, b) => {
          return b.startDate.toDate() - a.startDate.toDate();
        });
      }
    },
  },
  watch: {
    async treatment(val) {
      if (val) {
        let visits = await this.fetchTreatmentVisits(val.id);
        this.plannedvisits = [...visits.plannedvisits].sort((a, b) => {
          return b.startDate.toDate() - a.startDate.toDate();
        });
        this.pastvisits = [...visits.pastvisits].sort((a, b) => {
          return b.startDate.toDate() - a.startDate.toDate();
        });
      }
    },
  },
  mounted() {
      this.getVisits()
  },
};
</script>

<style></style>
