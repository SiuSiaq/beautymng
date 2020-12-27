<template>
  <div class="test">
    <v-container fluid>
      <AddClient @clientAdded="selectedClient = getAllClients[0]" />
      <v-row no-gutters>
        <v-col cols="12" md="3">
          <v-card class="px-4 pt-2">
            <v-autocomplete
              no-data-text="Brak klientów"
              @change="searchSelect"
              offset-y
              v-model="searchClientId"
              :items="getAllClients"
              item-text="fullname"
              item-value="id"
              label="Klient"
              prepend-icon="mdi-account-search-outline"
            ></v-autocomplete>
            <v-list
              v-if="!$vuetify.breakpoint.mobile"
              three-line
              style="height:80vh; overflow-y: scroll;"
            >
              <v-list-item-group>
                <v-list-item
                  @click="selectedClient = client"
                  v-for="client in getAllClients"
                  :key="client.id"
                >
                  <v-list-item-avatar
                    class="white--text"
                    :color="client.color"
                    >{{ client.name[0] }}</v-list-item-avatar
                  >
                  <v-list-item-content>
                    <v-list-item-title>{{ client.fullname }}</v-list-item-title>
                    <v-list-item-subtitle
                      >{{ client.phone }} <br />
                      {{ client.email }}</v-list-item-subtitle
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
              <div class="caption">Imię</div>
              <div>{{ selectedClient.name }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Nazwisko</div>
              <div>{{ selectedClient.surname }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Telefon</div>
              <div>{{ selectedClient.phone }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="caption">Email</div>
              <div>{{ selectedClient.email }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="caption">Zarejestrowany</div>
              <div>{{ registeredText }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Liczba wizyt</div>
              <div>{{ selectedClient.visits }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption">Zaplanowanych wizyt</div>
              <div>{{ selectedClient.plannedcount }}</div>
            </v-col>
            <v-col cols="12">
              <div class="caption">Zaplanowane wizyty</div>
              <div
                v-if="
                  selectedClient.plannedcount === 0 ||
                    selectedClient.plannedcount === undefined
                "
              >
                Brak zaplanowanych wizyt
              </div>
              <v-row v-else>
                <v-col
                  cols="12"
                  md="3"
                  v-for="plvisit in plannedvisits"
                  :key="plvisit.id"
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
                        {{ plvisit.name }}
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
                  <v-expansion-panel-header>Wizyty</v-expansion-panel-header>
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
              <div class="mt-4">
                <v-btn
                  v-if="selectedClient.id !== undefined"
                  text
                  color="error"
                  @click="deleteClient(selectedClient.id)"
                  >Usuń</v-btn
                >
                <EditClient
                  v-if="selectedClient.id !== undefined"
                  :client="selectedClient"
                />
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
import AddClient from "@/components/AddClient";
import EditClient from "@/components/EditClient";
import DeleteEvent from "@/components/DeleteEvent";
import Visit from "@/components/Visit";

export default {
  name: "Clients",
  components: {
    AddClient,
    EditClient,
    DeleteEvent,
    Visit,
  },
  data: () => ({
    selectedClient: {
      name: "",
      surname: "",
      phone: "",
      email: "",
    },
    searchClientId: null,
    pastvisits: [],
    plannedvisits: [],
    visits: 0,
    planvisits: 0,
    deleteEventLoader: false,
  }),
  computed: {
    ...mapGetters(["getAllClients"]),
    registeredText() {
      if (this.selectedClient.registered) {
        const date = this.selectedClient.registered.toDate();
        let hh = String(date.getHours()).padStart(2, "0");
        let mn = String(date.getMinutes()).padStart(2, "0");
        let dd = String(date.getDate()).padStart(2, "0");
        let mm = String(date.getMonth() + 1).padStart(2, "0");
        let yy = date.getFullYear();
        return `${dd}-${mm}-${yy} ${hh}:${mn}`;
      } else {
        return "Brak";
      }
    },
  },
  methods: {
    ...mapActions(["removeClient", "removeEvent", "fetchClientVisits"]),
    searchSelect() {
      if (this.searchClientId !== undefined) {
        this.selectedClient = this.getAllClients.find((v) => {
          return v.id === this.searchClientId;
        });
      }
    },
    async deleteClient(id) {
      await this.removeClient(id);
      this.getAllClients.length > 0
        ? (this.selectedClient = this.getAllClients[0])
        : (this.selectedClient = null);
    },
    async eventDeleted(event) {
      this.selectedClient.plannedvisits = this.selectedClient.plannedvisits.filter(
        (v) => v.eventRef.id !== event.id
      );
      this.selectedClient.plannedcount--;
    },
  },
  watch: {
    async selectedClient(val) {
      if (val) {
        this.searchClientId = val.id;
        let visits = await this.fetchClientVisits(val.id);
        this.plannedvisits = visits.plannedvisits;
        this.pastvisits = visits.pastvisits;
      }
    },
  },
  mounted() {
    if (this.getAllClients.length > 0) {
      this.selectedClient = this.getAllClients[0]
      this.searchClientId = this.getAllClients[0].id
    }
  },
};
</script>
