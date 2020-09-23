<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-content>
          <v-list-item-title>{{user.name}} {{user.surname}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-card>
      <v-card-title>{{user.name}} {{user.surname}}</v-card-title>

      <v-card-text>
        <div class="caption">Imię i nazwisko</div>
        <div class="text-subtitle-1 black--text">{{user.name}} {{user.surname}}</div>
        <div v-if="user.doctor">
          <div class="caption">Wykonanych wizyt</div>
          <div class="text-subtitle-1 black--text">{{user.visits}}</div>
        </div>
        <div v-else>
          <div class="caption">Rola</div>
          <div class="text-subtitle-1 black--text">Menedżer</div>
        </div>
      </v-card-text>

      <v-card-actions>
          <v-btn v-if="!user.doctor" color="primary" text @click="roleClick">ustaw jako doktora</v-btn>
          <v-btn v-else color="primary" text @click="roleClick">ustaw jako menadżera</v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">anuluj</v-btn>
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
  props: ["user"],
  methods: {
      ...mapActions(['setDoctor']),
      async roleClick() {
          this.loader = true;
          let obj = {};
          obj.doctor = !this.user.doctor;
          obj.ref = this.user.ref;
          await this.setDoctor(obj);
          this.loader = false;
          this.dialog = false;
      }
  }
};
</script>