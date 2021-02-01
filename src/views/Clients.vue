<template>
  <v-container fluid :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''">
    <AddClient @clientAdded="selectedClient = getAllClients[0]" />
    <v-row no-gutters v-if="!$vuetify.breakpoint.mobile">
      <v-col cols="12" md="3">
        <v-card class="px-4 pt-2" height="100%">
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
          <v-list three-line class="clientList">
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
        <ClientPreview
          :client="selectedClient"
          @clientRemoved="clientRemoved"
          class="clientPreview"
        />
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
          <ClientPreview
            :client="selectedClient"
            @clientRemoved="clientRemoved"
          />
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
import ClientPreview from "@/components/ClientPreview";

export default {
  name: "Clients",
  components: {
    ClientPreview,
    AddClient,
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
    deleteEventLoader: false,
  }),
  computed: {
    ...mapGetters(["getAllClients"]),
  },
  methods: {
    ...mapActions(["removeClient", "removeEvent"]),
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
    clientRemoved() {
      this.getAllClients.length > 0
        ? (this.selectedClient = this.getAllClients[0])
        : (this.selectedClient = null);
    },
  },
  watch: {
    async selectedClient(val) {
      if (val) {
        if (this.first) this.tab = 1;
        else this.first = true;
        this.searchClientId = val.id;
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

<style scoped>
.clientPreview {
  max-height: 87vh;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.clientPreview::-webkit-scrollbar {
  display: none;
}

.clientList {
  overflow-y: scroll;
  max-height: 74vh;
  min-height: 74vh;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.clientList::-webkit-scrollbar {
  display: none;
}

</style>
