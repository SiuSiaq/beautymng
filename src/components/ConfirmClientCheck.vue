<template>
  <v-btn
    icon
    @click="confirmClick(event)"
    :large="!$vuetify.breakpoint.mobile"
    color="secondary"
    :loading="loader"
  >
    <v-icon :large="!$vuetify.breakpoint.mobile" class="mr-4">mdi-check</v-icon>
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: "ConfirmClientCheck",
  props: ['event', 'today'],
  data: () => ({
      loader: false,
  }),
  methods: {
    ...mapActions(['confirmEvent', 'fetchEvents', 'todayEvents']),
    async confirmClick(event) {
        this.loader = true;
        await this.confirmEvent(event);
        this.loader = false;
        if(this.today) {
          await this.fetchEvents();
          this.todayEvents();
        }
    },
  },
};
</script>
