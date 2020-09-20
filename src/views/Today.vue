<template>
  <div class="today">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col
          cols="12"
          md="6"
          class="pa-5 grey--text"
          :class="$vuetify.breakpoint.mobile ? '' : 'desktop'"
          v-if="getCurrentEvent"
        >
          <div>
            <div class="text-h4 ml-5">Obecnie</div>
            <v-card class="mx-2 mx-md-10">
              <v-row class="ml-8 mt-5">
                <v-col cols="5">
                  <div class="caption">Godzina</div>
                  <div class="text-h4">{{getCurrentEvent.start.slice(11)}}</div>
                  <div class="mt-8 mt-md-7 caption">Status</div>
                  <div v-if="getCurrentEvent.confirmed" class="success--text">Potwierdzony</div>
                  <div v-else class="error--text">Nie potwierdzony</div>
                </v-col>
                <v-col cols="7">
                  <v-row class="pa-0">
                    <v-col cols="12">
                      <div class="caption">Zabieg</div>
                      <div class="text-subtitle-1">{{getCurrentEvent.name}}</div>
                    </v-col>
                    <v-col cols="12">
                      <div class="caption">Klient</div>
                      <div>{{getCurrentEvent.clientName}}</div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <v-stepper v-model="el" class="mx-2 mt-2 mx-md-10">
            <v-stepper-header>
              <v-stepper-step :complete="el > 1" step="1">Zakończ zabieg</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="el > 2" step="2">Ocena zabiegu</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3">Dodaj zdjęcia</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card class="d-flex justify-center">
                  <v-btn text large color="secondary" @click="el = 2">Zakończ zabieg</v-btn>
                </v-card>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-card>
                  <v-row>
                    <v-col class="d-flex justify-center" cols="12">
                      <v-rating
                        large
                        v-model="rating"
                        background-color="secondary"
                        color="secondary"
                      ></v-rating>
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
                    <v-file-input v-model="images" multiple prepend-icon="mdi-camera-burst" label="Dodaj zdjęcia">
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
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="pa-5"
          :class="$vuetify.breakpoint.mobile ? '' : 'desktop'"
          v-else
        >
          <div class="text-h4 ml-5 grey--text">Obecnie</div>
          <div
            v-if="getTodayLeftEvents.length === 0"
            class="mt-10 text-h5 text-center primary--text"
          >Brak zabiegu</div>
          <div v-else class="mt-10 text-h5 text-center primary--text">Przerwa</div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="pa-5 grey--text"
          :class="$vuetify.breakpoint.mobile ? '' : 'desktop_second'"
        >
          <div v-if="getTodayLeftEvents.length > 0">
            <div class="text-h4 ml-5" v-text="`Pozostało: ${getTodayLeftEvents.length}`"></div>
            <v-card v-for="event in getTodayLeftEvents" :key="event.id" class="pa-2 pl-4 mt-2">
              <v-row>
                <v-col cols="4">
                  <div class="caption">Od</div>
                  <div class="text-h5 font-weight-regular">{{event.start.slice(11)}}</div>
                  <br />
                  <div class="caption">Do</div>
                  <div class="text-h5 font-weight-regular">{{event.end.slice(11)}}</div>
                </v-col>
                <v-col cols="8">
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="caption">Klient</div>
                      <div>{{event.clientName}}</div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="caption">Zabieg</div>
                      <div>{{event.name}}</div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="caption">Status</div>
                      <div v-if="event.confirmed" class="success--text">Potwierdzony</div>
                      <div v-else class="error--text">Nie potwierdzony</div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <div v-else>
            <div class="text-h4 ml-5">Brak zabiegów</div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Today",
  data: () => ({
    el: 1,
    rating: 0,
    archiveLoader: false,
    images: [],
  }),
  mounted() {
    this.getData();
    setInterval(() => {
      this.updateTimer();
    }, 30000);
  },
  methods: {
    ...mapActions([
      "todayLeftEvents",
      "currentEvent",
      "todayEvents",
      "fetchEvents",
      "archiveEvent",
    ]),
    async getData() {
      await this.fetchEvents();
      this.todayLeftEvents();
      await this.todayEvents();
      this.currentEvent();
    },
    async archiveClick() {
      this.archiveLoader = true;
      let obj = this.getCurrentEvent;
      obj.images = this.images;
      obj.rate = this.rating;
      await this.archiveEvent(obj);
      this.archiveLoader = false;
      this.todayLeftEvents();
      await this.todayEvents();
      this.currentEvent();
      this.el = 1;
      this.rating = 0;
    },
    async updateTimer() {
      if (this.getCurrentEvent || this.getTodayLeftEvents.length <= 0) return;
      let 
        now = new Date(),
        tempDate = new Date(this.getTodayLeftEvents[0].start);
      if(now.getTime() + 30000 > tempDate.getTime()) {
        this.todayLeftEvents();
        await this.todayEvents();
        this.currentEvent();
      }
    },
  },
  computed: mapGetters(["getTodayLeftEvents", "getCurrentEvent"]),
};
</script>

<style scoped>
.desktop {
  height: 96vh;
}
.desktop_second {
  height: 96vh;
  overflow-y: scroll;
  scrollbar-width: none;
}
</style>



