<template>
  <nav>
    <v-app-bar dark color="primary">
      <v-app-bar-nav-icon v-if="getIsLoggedIn" @click="draw = !draw"></v-app-bar-nav-icon>

      <v-toolbar-title class="text-uppercase font-weight-bold white--text">
        Beauty
        <span class="font-weight-light">Mng</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
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
export default {
  data: () => ({
    draw: false,
    items: [
      { icon: "mdi-view-dashboard", text: "Home", route: "/" },
      { icon: "mdi-calendar-text", text: "Kalendarz", route: "/calendar" },
      { icon: "mdi-seal", text: "Dzisiaj", route: "/today" },
      { icon: "mdi-bell-check", text: "Do potwierdzenia", route: "/confirms" },
      { icon: "mdi-account-box-multiple", text: "Klienci", route: "/clients" },
      { icon: "mdi-needle", text: "Zabiegi", route: "/treatments" },
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
    ...mapGetters(['getIsLoggedIn'])
  },
};
</script>
