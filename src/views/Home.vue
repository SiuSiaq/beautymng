<template>
  <v-container class="px-0 mx-0 home" fluid>
    <v-card width="80%" :height="!$vuetify.breakpoint.mobile ? '400' : 'auto'" elevation="24" rounded="xl" :class="!$vuetify.breakpoint.mobile ? 'homeCard' : 'homeCardMobile'">
      <v-card-title class="ml-3 grey--text text-h4">Salon</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <div class="ml-2 ml-md-5">
              <div class="caption">Nazwa salonu</div>
              <div class="black--text text-subtitle-1">{{getSalon.name}}</div>
              <div class="caption mt-1">Właścicel/ka</div>
              <div
                class="black--text text-subtitle-1"
              >{{getSalon.leader.name}} {{getSalon.leader.surname}}</div>
              <div class="caption mt-1">Wykonanych zabiegów</div>
              <div class="black--text text-subtitle-1">{{getSalon.visits}}</div>
              <div class="caption mt-1">Termin wygaśnięcia subskrybcji</div>
              <div class="black--text text-subtitle-1">20.04.2420</div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="caption ml-2">Pracownicy</div>
            <v-list>
              <v-list-item-group>
                <User :user="user" v-for="(user, i) in getSalon.users" :key="i" />
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import User from '@/components/User'
export default {
  data: () => ({}),
  computed: {
    ...mapGetters(["getSalon"]),
  },
  methods: {
    ...mapActions(['fetchSalon']),
  },
  mounted() {
    this.fetchSalon;
  },
  components: {
    User,
  }
};
</script>

<style scoped>
.home {
  height: 100%;
  background: #d984a3; 
}
.homeCard {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  top: 17%;
}

.homeCardMobile {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  top: 17%;
}
</style>
