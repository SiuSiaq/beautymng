<template>
  <v-dialog v-model="dialog" width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on">
        Wyślij klientowi
      </v-btn>
    </template>

    <v-card>
      <v-card-title> Wyślij ankietę klientowi </v-card-title>

      <v-card-text>
        <v-form>
          <v-autocomplete
            outlined
            no-data-text="Brak klientów w bazie"
            label="Klient"
            :rules="[(v) => !!v || `Klient jest wymagany`]"
            :items="getAllClients"
            v-model="patient"
            item-text="fullname"
            item-value="id"
          >
          </v-autocomplete>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" :loading="loader" @click="sendClick">
          Wyślij
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["survey"],
  data: () => ({
    dialog: false,
    patient: null,
    loader: false,
  }),
  computed: mapGetters(["getAllClients"]),
  methods: {
    ...mapActions(["sendSurvey"]),
    async sendClick() {
      if (!this.patient) return;
      this.loader = true;
      await this.sendSurvey({ survey: this.survey, id: this.patient });
      this.loader = false;
      this.dialog = false;
    },
  },
};
</script>
