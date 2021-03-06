<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mobile"
    max-width="400"
    :hide-overlay="$vuetify.breakpoint.mobile"
    :transition="
      $vuetify.breakpoint.mobile
        ? 'dialog-bottom-transition'
        : 'scale-transition'
    "
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn fixed bottom right fab color="secondary" v-bind="attrs" v-on="on">
        <v-icon large>mdi-plus-circle</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">
        Dodaj klienta
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <div style="max-width: 600px;" class="mx-auto">
        <v-form ref="form" v-model="valid" class="mx-5">
          <v-text-field
            class="mt-4"
            v-model="clientName"
            :counter="50"
            :rules="nameRules"
            label="Imię"
            required
          ></v-text-field>

          <v-text-field
            v-model="clientSurname"
            :counter="50"
            :rules="surnameRules"
            label="Nazwisko"
            required
          ></v-text-field>

          <v-text-field
            v-model="clientPhone"
            :rules="phoneRules"
            label="Telefon"
            required
          ></v-text-field>
        </v-form>

        <v-card-actions>
          <v-btn @click="dialog = false" text>Anuluj</v-btn>
          <v-btn @click="reset" text>resetuj</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :loading="loader"
            :disabled="!valid"
            @click="submit"
            >Dodaj</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AddClient",
  data: () => ({
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
    ...mapActions(["addClient", "deleteClient"]),
    getRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
    async submit() {
      if (!this.$refs.form.validate()) return;

      const newClient = {
        name: this.clientName,
        surname: this.clientSurname,
        fullname: `${this.clientName} ${this.clientSurname}`,
        phone: this.clientPhone,
        registered: new Date(),
        visits: 0,
        plannedcount: 0,
        color: this.getRandomColor(),
      };

      this.loader = true;
      await this.addClient(newClient);
      this.loader = false;
      this.dialog = false;
      this.reset();
      this.$emit("clientAdded");
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
