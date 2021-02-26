<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn dark v-bind="attrs" v-on="on" text color="error">
        usuń
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        Czy napewno chcesz usunąć pacjenta?
      </v-card-title>
      <v-card-text>Pacjent/Pacjentka zostanie trwale usunięta!</v-card-text>
      <v-card-actions>
        <v-btn text @click="dialog = false">
          anuluj
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" :loading="loader" text @click="deleteClient">
          usuń
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["id"],
  data: () => ({
    dialog: false,
    loader: false,
  }),
  methods: {
    ...mapActions(["removeClient"]),
    async deleteClient() {
      this.loader = true;
      await this.removeClient(this.id);
      this.loader = false;
      this.dialog = false;
      this.$emit('clientRemoved')
    },
  },
};
</script>
