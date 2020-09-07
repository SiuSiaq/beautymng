<template>
  <v-dialog v-model="dialog" max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">Edytuj</v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">
        Edytuj klienta
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-form ref="form" v-model="valid" class="mx-5">
        <v-text-field
          class="mt-4"
          v-model="client.name"
          :counter="50"
          :rules="nameRules"
          label="Imię"
          required
        ></v-text-field>

        <v-text-field
          v-model="client.surname"
          :counter="50"
          :rules="surnameRules"
          label="Nazwisko"
          required
        ></v-text-field>

        <v-text-field v-model="client.email" :rules="emailRules" label="Email" required></v-text-field>

        <v-text-field v-model="client.phone" :rules="phoneRules" label="Telefon" required></v-text-field>
      </v-form>

      <v-card-actions>
        <v-btn @click="dialog = false" text>Anuluj</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" text :loading="loader" :disabled="!valid" @click="submit">Zapisz</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "EditClient",
  props: ["client"],
  data: () => ({
    addSuccess: false,
    timeError: false,
    loader: false,
    dialog: false,
    valid: true,
    clientName: "",
    clientSurname: "",
    nameRules: [
      (v) => !!v || "Imię jest wymagane",
      (v) => (v && v.length <= 50) || "Imię musi być krótsze niż 50 znaków",
    ],
    surnameRules: [
      (v) => !!v || "Nazwisko jest wymagane",
      (v) => (v && v.length <= 50) || "Nazwisko musi być krótsze niż 50 znaków",
    ],
    clientEmail: "",
    emailRules: [
      (v) => !!v || "Email jest wymagany",
      (v) => /.+@.+/.test(v) || "Nie poprawny email",
    ],
    clientPhone: "",
    phoneRules: [
      (v) => !!v || "Numer telefonu jest wymagany",
      (v) => /^\d{9}$/.test(v) || "Niepoprawny numer telefonu",
    ],
  }),
  methods: {
    ...mapActions(['updateClient']),
    async submit() {
      if (!this.$refs.form.validate()) return;

      this.loader = true;
      const updatedClient = {
        id: this.client.id,
        name: this.client.name,
        surname: this.client.surname,
        email: this.client.email,
        phone: this.client.phone,
        registered: this.client.registered,
        plannedcount: this.client.plannedcount,
        plannedvisits: this.client.plannedvisits,
        pastvisits: this.client.pastvisits,
        visits: this.client.visits,
        color: this.client.color,
        fullname: `${this.client.name} ${this.client.surname}`,
      };

      await this.updateClient(updatedClient);
      this.loader = false;
      this.dialog = false;
    },
  },
};
</script>
