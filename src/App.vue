<template>
  <v-app>
    <Navbar/>
    <v-alert transition="slide-y-transition" dense :type="getAlert.success ? 'success' : 'error'" rounded="0" v-model="getAlert.show">
      {{getAlert.text}}
    </v-alert>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

import Navbar from '@/components/Navbar' 
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Navbar
  },
  methods: {
    ...mapActions(['authStateChanged']),
  },
  computed: mapGetters(['getAlert']),
  created() {
    this.authStateChanged();
  }
};
</script>
