<template>
  <v-container>
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <div class="text-h4 grey--text mb-5">Ustawienia salonu</div>
        <v-text-field
          v-model="getSalon.name"
          :rules="nameRules"
          label="Nazwa salonu"
          :counter="50"
          required
          :disabled="disableName"
        ></v-text-field>
        <v-btn text class="ml-n3 mt-n3" @click="disableName = false" v-if="disableName">edytuj</v-btn>
        <v-btn text class="ml-n3 mt-n3" :loading="loader" @click="saveClick" v-else>zapisz</v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <div class="text-h4 grey--text">Pracownicy</div>
        <v-list>
          <v-list-item-group>
            <User :user="user" v-for="(user, i) in getSalon.users" :key="i" />
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import User from "@/components/User";
export default {
  data: () => ({
    disableName: true,
    loader: false,
    nameRules: [
      (v) => !!v || "Nazwa salonu jest wymagana",
      (v) => v.length <= 50 || "Nazwa musi być krótsza niż 50 znaków",
    ],
  }),
  computed: {
    ...mapGetters(["getSalon"]),
  },
  components: {
    User,
  },
  methods: {
      ...mapActions(['setSalonName']),
      async saveClick() {
          this.loader = true;
          await this.setSalonName(this.getSalon.name);
          this.loader = false;
          this.disableName = true;
      }
  }
};
</script>
