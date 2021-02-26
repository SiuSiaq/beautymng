<template>
  <v-row class="pa-5" style="max-width: 100%">
    <v-col cols="6">
      <div class="caption">Imię</div>
      <div>{{ client.name }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Nazwisko</div>
      <div>{{ client.surname }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Telefon</div>
      <div>{{ client.phone }}</div>
    </v-col>
    <v-col
      v-if="client.email"
      :cols="client.email.length < 19 ? '6' : '12'"
      md="6"
    >
      <div class="caption">Email</div>
      <div>{{ client.email }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Zarejestrowany</div>
      <div>{{ registeredText }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Liczba wizyt</div>
      <div>{{ client.visits }}</div>
    </v-col>
    <v-col cols="6">
      <div class="caption">Zaplanowanych wizyt</div>
      <div>{{ client.plannedcount }}</div>
    </v-col>
    <v-col cols="12">
      <div class="caption">Zaplanowane wizyty</div>
      <div
        v-if="client.plannedcount === 0 || client.plannedcount === undefined"
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
                <v-list-item-title>{{ plvisit.name }}</v-list-item-title>
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
          <v-expansion-panel-header>Wizyty</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item-group>
                <Visit
                  :treatment="false"
                  :event="pastevent"
                  v-for="pastevent in pastvisits"
                  :key="pastevent.id"
                />
              </v-list-item-group>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="mt-4">
        <DeleteClient
          :id="client.id"
          v-if="client.id"
          @clientRemoved="$emit('clientRemoved')"
        />
        <EditClient v-if="client.id" :client="client" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import EditClient from "@/components/EditClient";
import Visit from "@/components/Visit";
import DeleteClient from "@/components/DeleteClient.vue";

export default {
  props: ["client"],
  components: {
    EditClient,
    Visit,
    DeleteClient,
  },
  data: () => ({
    plannedvisits: [],
    pastvisits: [],
  }),
  computed: {
    registeredText() {
      if (this.client.registered) {
        const date = this.client.registered.toDate();
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
    ...mapActions(["fetchClientVisits", "removeClient"]),
    async getVisits() {
      if (this.client.id) {
        let visits = await this.fetchClientVisits(this.client.id);
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
    async client(val) {
      if (val) {
        let visits = await this.fetchClientVisits(val.id);
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
    this.getVisits();
  },
};
</script>
