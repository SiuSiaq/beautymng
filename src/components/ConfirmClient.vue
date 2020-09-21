<template>
  <v-dialog v-model="dialog" max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-icon large class="mr-4" color="secondary" v-bind="attrs" v-on="on">mdi-phone</v-icon>
    </template>
    <v-card class="px-5 pb-2">
      <v-card-title>Potwierdzanie wizyty</v-card-title>
      <div class="caption">Telefon</div>
      <div><a :href="`tel:${event.clientPhone}`">{{ event.clientPhone }}</a></div>
      <div class="caption">Klient</div>
      <div>{{event.clientName}}</div>
      <div class="caption">Termin</div>
      <div>{{event.start}}</div>
      <div class="caption">Zabieg</div>
      <div>{{event.name}}</div>

      <v-card-actions>
        <v-btn color="error" text>usuń</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" text :loading="loader" @click="confirmClick">potwierdź</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: "ConfirmClient",
  props: ['event'],
  data: () => ({
    dialog: false,
    loader: false,
  }),
  methods: {
    ...mapActions(['confirmEvent', 'fetchEvents', 'todayEvents']),
    async confirmClick() {
      this.loader = true;
      await this.confirmEvent(this.event);
      this.loader = false;
      this.dialog = false;
      await this.fetchEvents();
      this.todayEvents();
    }
  }
};
</script>
