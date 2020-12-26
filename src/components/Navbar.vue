<template>
  <nav>
    <v-app-bar flat dark color="primary">
      <v-app-bar-nav-icon v-if="getIsLoggedIn" @click="draw = !draw"></v-app-bar-nav-icon>

      <v-toolbar-title class="text-uppercase font-weight-bold white--text">
        Beauty
        <span class="font-weight-light">Mng</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu
      transition="slide-y-transition"
      close-on-content-click
      bottom
      left
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <AddClientVisit />
      </v-list>
    </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="draw" color="secondary" app temporary>
      <v-list nav>
        <v-list-item-group>
          <v-list-item v-for="item in items" :key="item.text" router :to="item.route">
            <v-list-item-icon>
              <v-icon class="white--text">{{item.icon}}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="white--text" v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item >
          <v-list-item v-if="isAdmin" :to="settings">
            <v-list-item-icon>
              <v-icon class="white--text">mdi-cog</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="white--text">Ustawienia salonu</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logOutClick">
            <v-list-item-icon>
              <v-icon class="white--text">mdi-logout-variant</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="white--text">Wyloguj</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AddClientVisit from '@/components/AddClientVisit'
export default {
  components: {
    AddClientVisit
  },
  data: () => ({
    draw: false,
    settings: '/settings',
    items: [
      { icon: "mdi-view-dashboard", text: "Home", route: "/" },
      { icon: "mdi-test-tube", text: "Home", route: "/test" },
      { icon: "mdi-calendar-text", text: "Kalendarz", route: "/calendar" },
      { icon: "mdi-seal", text: "Dzisiaj", route: "/today" },
      { icon: "mdi-bell-check", text: "Do potwierdzenia", route: "/confirms" },
      { icon: "mdi-account-box-multiple", text: "Klienci", route: "/clients" },
      { icon: "mdi-needle", text: "Zabiegi", route: "/treatments" },
      { icon: "mdi-finance", text: "Statystyki", route: "/statistics" },
    ],
    options: [
      {icon: 'mdi-account-arrow-left', text: 'Umów nowego klienta'},
      {icon: 'mdi-account', text: 'Umów istniejącego klienta'},
    ],
  }),
  methods: {
    ...mapActions(['logOut']),
    async logOutClick() {
      await this.logOut();
      this.$router.go('/login');
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn', 'isAdmin'])
  },
};
</script>
