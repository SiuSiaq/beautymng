<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-avatar class="white--text" :color="event.color">{{ event.name[0] }}</v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ event.name }}</v-list-item-title>
          <v-list-item-subtitle>
            {{event.clientName}}
            <br />
            {{event.clientPhone}}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <div class="text-h4 font-weight-light mt-1">{{event.start.slice(11)}}</div>
        </v-list-item-action>
      </v-list-item>
    </template>

    <v-card class="px-5 pb-2">
      <v-card-title>Potwierdzanie wizyty</v-card-title>
      <div class="caption">Telefon</div>
      <div>{{event.clientPhone}}</div>
      <div class="caption">Klient</div>
      <div>{{event.clientName}}</div>
      <div class="caption">Termin</div>
      <div>{{event.start}}</div>
      <div class="caption">Zabieg</div>
      <div>{{event.name}}</div>

      <v-card-actions>
        <v-btn @click="dialog = false" text>anuluj</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" text>usuń</v-btn>
        <v-btn color="success" text :loading="loader" @click="confirmClick">potwierdź</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data: () => ({
    dialog: false,
    loader: false,
  }),
  props: ["event"],
  methods: {
      ...mapActions(['confirmEvent']),
      async confirmClick() {
      this.loader = true;
      await this.confirmEvent(this.event);
      this.loader = false;
      this.dialog = false;
    },
  }
};
</script>
