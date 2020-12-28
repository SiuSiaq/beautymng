<template>
  <v-container
    fluid
    :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''"
    class="confirms"
  >
    <v-row v-if="!$vuetify.breakpoint.mobile">
      <v-col cols="12" md="4" v-for="day in days" :key="day.name">
        <v-card elevation="12" class="pb-4 px-3">
          <v-card-title class="text-h4 grey--text text--darken-2">{{
            day.name
          }}</v-card-title>
          <v-list v-if="day.list.length > 0" class="desktop" three-line>
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

    <div v-else style="height: 100%; width: 100%">
      <v-tabs v-model="tab" background-color="primary" color="white" grow>
        <v-tab v-for="item in ['Dzisiaj', 'Jutro', 'Pojutrze']" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item class="pa-4" v-for="day in days" :key="day.name"
          ><v-list min-height="83.1vh" max-height="100%" v-if="day.list.length > 0" class="desktop" three-line>
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
          </div></v-tab-item
        ></v-tabs-items
      >
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ConfirmEventItem from "@/components/ConfirmEventItem";
export default {
  data: () => ({
    tab: 0,
  }),
  components: {
    ConfirmEventItem,
  },
  computed: {
    ...mapGetters([
      "getTodayNotConfirmedEvents",
      "getTomorrowNotConfirmedEvents",
      "getDayAfterNotConfirmedEvents",
    ]),
    days() {
      return [
        { name: "Dzisiaj", list: this.getTodayNotConfirmedEvents },
        { name: "Jutro", list: this.getTomorrowNotConfirmedEvents },
        { name: "Pojutrze", list: this.getDayAfterNotConfirmedEvents },
      ];
    },
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
