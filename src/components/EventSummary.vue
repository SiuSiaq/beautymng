<template>
  <v-dialog v-model="dialog" width="700" class="px-0">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text color="primary" v-bind="attrs" v-on="on">Podsumuj zabieg</v-btn>
    </template>

    <v-stepper v-model="el">
      <v-stepper-header>
        <v-stepper-step :complete="el > 1" step="1">Zakończ zabieg</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="el > 2" step="2">Ocena zabiegu</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">Dodaj zdjęcia</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="px-2">
            <div class="caption">Klient</div>
            <div class="text-subtitle-1">{{event.clientName}}</div>
            <div class="caption">Zabieg</div>
            <div class="text-subtitle-1">{{event.name}}</div>
            <div class="caption">Dodatkowe zabiegi</div>
            <v-autocomplete
            class="mt-2"
              v-model="additionalTreatments"
              :items="getAllTreatments"
              item-text="name"
              item-value="id"
              dense
              chips
              small-chips
              placeholder="Zabiegi"
              multiple
            ></v-autocomplete>
            <v-divider class="mt-2"></v-divider>
            <div class="d-flex justify-center">
              <v-btn class="mt-2" text large color="secondary" @click="el = 2">Zakończ zabieg</v-btn>
            </div>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card>
            <v-row>
              <v-col class="d-flex justify-center" cols="12">
                <v-rating large v-model="rating" background-color="secondary" color="secondary"></v-rating>
              </v-col>
              <v-col class="d-flex justify-center" cols="12">
                <v-btn x-large color="secondary" text @click="el = 3">Dalej</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-row>
            <v-col cols="12">
              <v-file-input
                v-model="images"
                multiple
                prepend-icon="mdi-camera-burst"
                label="Dodaj zdjęcia"
              >
                <template v-slot:selection="{ text }">
                  <v-chip small label color="primary">{{ text }}</v-chip>
                </template>
              </v-file-input>
            </v-col>
            <v-col class="d-flex justify-center" cols="12">
              <v-btn
                x-large
                color="secondary"
                :loading="archiveLoader"
                text
                @click="archiveClick"
              >Zakończ</v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    el: 1,
    dialog: false,
    archiveLoader: false,
    rating: 0,
    images: [],
    additionalTreatments: [],
  }),
  props: ["event"],
  methods: {
    ...mapActions(["archiveEvent"]),
    async archiveClick() {
      this.archiveLoader = true;
      let obj = this.event;
      obj.images = this.images;
      obj.rate = this.rating === 0 ? 5 : this.rating;
      obj.additionalTreatments = [],
      this.additionalTreatments.forEach((treatmentId) => {
          let temp = this.getAllTreatments.find(v => v.id === treatmentId);
          obj.price += temp.price;
          obj.additionalTreatments.push(temp);
      })
      obj.archived = true;
      await this.archiveEvent(obj);
      this.archiveLoader = false;
      this.el = 1;
      this.rating = 0;
      this.dialog = false;
      this.$emit('archived');
    },
  },
  computed: {
    ...mapGetters(["getAllTreatments"]),
  },
};
</script>