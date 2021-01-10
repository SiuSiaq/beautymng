<template>
  <v-container fluid :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''">
    <AddClient @clientAdded="selectedClient = getAllClients[0]" />
    <v-row no-gutters v-if="!$vuetify.breakpoint.mobile">
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
          <v-list three-line style="height:80vh; overflow-y: scroll;">
            <v-list-item-group>
              <v-list-item
                @click="selectedClient = client"
                v-for="client in getAllClients"
                :key="client.id"
              >
                <v-list-item-avatar class="white--text" :color="client.color">{{
                  client.name[0]
                }}</v-list-item-avatar>
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
            <div v-else>
              <v-list two-line>
                <v-list-item-group>
                  <v-list-item
                    v-for="plvisit in plannedvisits"
                    :key="plvisit.id"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ plvisit.name }}</v-list-item-title>
                      <v-list-item-subtitle
                        >{{ plvisit.start }}<br />Status:
                        <span
                          :class="
                            plvisit.confirmed ? 'success--text' : 'error--text'
                          "
                          >{{
                            plvisit.confirmed
                              ? "Potwierdzono"
                              : "Nie potwierdzono"
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

    <div v-else style="height: 100%; width: 100%">
      <v-tabs v-model="tab" background-color="primary" color="white" grow>
        <v-tab v-for="item in ['Lista', 'Klient']" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item class="pa-4">
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
          <v-list three-line max-height="100%">
            <v-list-item-group>
              <v-list-item
                @click="selectedClient = client"
                v-for="client in getAllClients"
                :key="client.id"
              >
                <v-list-item-avatar class="white--text" :color="client.color">{{
                  client.name[0]
                }}</v-list-item-avatar>
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
        </v-tab-item>
        <v-tab-item>
          <v-row class="pa-5" style="max-width: 100%">
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
            <v-col :cols="selectedClient.email.length < 19 ? '6' : '12'" md="6">
              <div class="caption">Email</div>
              <div>{{ selectedClient.email }}</div>
            </v-col>
            <v-col cols="6">
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
              <div v-else>
                <v-list two-line>
                  <v-list-item-group>
                    <v-list-item
                      v-for="plvisit in plannedvisits"
                      :key="plvisit.id"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{
                          plvisit.name
                        }}</v-list-item-title>
                        <v-list-item-subtitle
                          >{{ plvisit.start }}<br />Status:
                          <span
                            :class="
                              plvisit.confirmed
                                ? 'success--text'
                                : 'error--text'
                            "
                            >{{
                              plvisit.confirmed
                                ? "Potwierdzono"
                                : "Nie potwierdzono"
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
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
  <!-- <DeleteEvent
                      @eventRemoved="eventDeleted($event)"
                      :eventRef="plvisit.eventRef"
                    /> -->
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AddClient from "@/components/AddClient";
import EditClient from "@/components/EditClient";
import Visit from "@/components/Visit";

export default {
  name: "Clients",
  components: {
    AddClient,
    EditClient,
    Visit,
  },
  data: () => ({
    tab: null,
    first: false,
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
        if (this.first) this.tab = 1;
        else this.first = true;
        this.searchClientId = val.id;
        let visits = await this.fetchClientVisits(val.id);
        this.plannedvisits = visits.plannedvisits;
        this.pastvisits = visits.pastvisits;
      }
    },
  },
  mounted() {
    if (this.getAllClients.length > 0) {
      this.selectedClient = this.getAllClients[0];
      this.searchClientId = this.getAllClients[0].id;
    }
  },
};
</script>
