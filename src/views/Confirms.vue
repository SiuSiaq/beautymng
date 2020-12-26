<template>
  <v-container fluid class="confirms">
    <v-row>
      <v-col cols="12" md="4" v-for="day in days" :key="day.name">
        <v-card
          elevation="12"
          class="pb-4 px-3"
        >
          <v-card-title
            class="text-h4 grey--text text--darken-2"
            >{{ day.name }}</v-card-title
          >
          <v-list
            v-if="day.list.length > 0"
            :class="!$vuetify.breakpoint.mobile ? 'desktop' : ''"
            three-line
          >
            <v-list-item-group>
              <ConfirmEventItem
                v-for="event in day.list"
                :key="event.id"
                :event="event"
              />
            </v-list-item-group>
          </v-list>
            <div v-else class="d-flex">
              <v-icon
                :size="!$vuetify.breakpoint.mobile ? 50 : 30"
                color="success"
                class="fab mr-3"
                >mdi-check-circle</v-icon
              >
              <div
                class="mt-md-2 text-subtitle-1 font-weight-regular text-md-h5 success--text"
              >
                Wszystkie zabiegi potwierdzone
              </div>
            </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ConfirmEventItem from "@/components/ConfirmEventItem";
export default {
  data: () => ({}),
  components: {
    ConfirmEventItem,
  },
  methods: {
    ...mapActions([
      "tomorrowNotConfirmedEvents",
      "todayNotConfirmedEvents",
      "dayAfterNotConfirmedEvents",
    ]),
    async getData() {
      this.tomorrowNotConfirmedEvents();
      this.todayNotConfirmedEvents();
      this.dayAfterNotConfirmedEvents();
    },
  },
  computed: {
    ...mapGetters([
      "getTodayNotConfirmedEvents",
      "getTomorrowNotConfirmedEvents",
      "getDayAfterNotConfirmedEvents",
    ]),
    days: {
      get() {
        return [
          { name: "Dzisiaj", list: this.getTodayNotConfirmedEvents },
          { name: "Jutro", list: this.getTomorrowNotConfirmedEvents },
          { name: "Pojutrze", list: this.getDayAfterNotConfirmedEvents },
        ];
      },
      set() {},
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.desktop {
  max-height: 80vh;
  overflow-y: scroll;
  scrollbar-width: none;
}

.confirms {
  height: 100%;
  background: #d984a3;
}
</style>
