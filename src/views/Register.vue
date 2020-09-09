<template>
  <v-container>
    <v-card max-width="600px" class="mt-5 mx-auto">
      <v-stepper v-model="el">
        <v-stepper-header>
          <v-stepper-step :complete="el > 1" step="1">Rejestracja</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="el > 2" step="2">Wybierz salon</v-stepper-step>

          <v-divider></v-divider>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
              <v-text-field
                v-model="password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="show ? 'text' : 'password'"
                label="Hasło"
                hint="Conajmniej 6 znaków"
                counter
                @click:append="show = !show"
              ></v-text-field>
            </v-form>
            <div class="d-inline">
              <v-btn @click="reset" text>resetuj</v-btn>
              <v-btn
                color="primary"
                text
                :loading="loader"
                :disabled="!valid"
                @click="register"
              >zarejestruj</v-btn>
            </div>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-row>
              <v-col cols="9">
                <v-text-field 
                  placeholder="ACFXYY" 
                  label="Klucz salonu"
                  v-model="salon_key"
                  :rules="salon_keyRules">
                </v-text-field>
              </v-col>
              <v-col cols="3">
                <v-btn color="primary" @click.prevent="joinSalonClick" :loading="joinLoader" class="mt-3">Dołącz</v-btn>
              </v-col>
              <v-col cols="12">
                <div class="text-h5 grey--text text-center">lub</div>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-btn color="primary">Stwórz swój salon</v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    el: 1,
    show: false,
    loader: false,
    joinLoader: false,
    valid: true,
    email: "",
    emailRules: [
      (v) => !!v || "E-mail jest wymagany",
      (v) => /.+@.+\..+/.test(v) || "E-mail musi być poprawny",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Hasło jest wymagane",
      (v) => v.length >= 6 || "Conajmniej 6 znaków",
    ],
    salon_key: "",
    salon_keyRules: [
      (v) => !!v || "Klucz salonu jest wymagany",
      (v) => v.length === 6 || "Klucz musi składać się z 6 znaków",
    ],
  }),
  methods: {
    ...mapActions(["registerUser", 'joinSalon']),
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async register() {
      if (!this.$refs.form.validate()) return;

      this.loader = true;
      let userData = {
        email: this.email,
        password: this.password,
      };
      await this.registerUser(userData);
      this.loader = false;
      this.el = 2;
    },
    async joinSalonClick() {
      this.joinLoader = true;
      await this.joinSalon(this.salon_key);
      this.joinLoader = false;
      this.$router.push("/");
    },
  },
};
</script>
