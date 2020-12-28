<template>
  <v-container
    fluid
    class="testHomeClass"
    :class="$vuetify.breakpoint.mobile ? 'pa-0' : ''"
  >
    <div v-if="$vuetify.breakpoint.mobile" style="height: 100%; width: 100%">
      <v-tabs v-model="tab" background-color="transparent" color="white" grow>
        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card v-if="getUserData.doctor" class="pa-3"
            ><v-sheet height="auto">
              <v-toolbar flat color="white">
                <v-btn
                  outlined
                  class="mr-4"
                  color="grey darken-2"
                  @click="setToday"
                  >Dzisiaj</v-btn
                >
                <v-btn fab text small color="grey darken-2" @click="prev">
                  <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn fab text small color="grey darken-2" @click="next">
                  <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">{{
                  $refs.calendar.title
                }}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </v-sheet>
            <v-sheet height="77.3vh">
              <v-calendar
                locale="pl-PL"
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="getMyEvents"
                :event-color="getEventColor"
                @click:event="showEvent"
                type="day"
              >
                <template #day-body="{ date, week }">
                  <div
                    class="v-current-time"
                    :class="{ first: date === week[0].date }"
                    :style="{ top: nowY }"
                  ></div>
                </template>
              </v-calendar>
              <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
              >
                <v-card color="grey lighten-4" max-width="350" flat>
                  <v-toolbar :color="selectedEvent.color" dark>
                    <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
                  </v-toolbar>
                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-header disable-icon-rotate>
                        Klient: {{ selectedEvent.clientName }}
                        <template v-slot:actions>
                          <v-icon color="primary">mdi-account</v-icon>
                        </template>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-simple-table>
                          <tbody>
                            <tr>
                              <td>Imię</td>
                              <td>{{ selectedClient.name }}</td>
                            </tr>
                            <tr>
                              <td>Nazwisko</td>
                              <td>{{ selectedClient.surname }}</td>
                            </tr>
                            <tr>
                              <td>Telefon</td>
                              <td>
                                <a :href="`tel:${selectedClient.phone}`">{{
                                  selectedClient.phone
                                }}</a>
                              </td>
                            </tr>
                            <tr>
                              <td>Email</td>
                              <td>
                                <a :href="`mailto:${selectedClient.email}`">{{
                                  selectedClient.email
                                }}</a>
                              </td>
                            </tr>
                            <tr>
                              <td>Wizyt</td>
                              <td>{{ selectedClient.visits }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-expansion-panel>
                      <v-expansion-panel-header disable-icon-rotate>
                        Zabieg: {{ selectedTreatment.name }}
                        <template v-slot:actions>
                          <v-icon color="primary">mdi-needle</v-icon>
                        </template>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-simple-table>
                          <tbody>
                            <tr>
                              <td>Zabieg</td>
                              <td>{{ selectedTreatment.name }}</td>
                            </tr>
                            <tr>
                              <td>Czas</td>
                              <td>
                                {{ selectedTreatment.hours }} godziny
                                {{ selectedTreatment.minutes }} minuty
                              </td>
                            </tr>
                            <tr>
                              <td>Cena</td>
                              <td>{{ selectedTreatment.price }}zł</td>
                            </tr>
                            <tr>
                              <td>Wykonano</td>
                              <td>{{ selectedTreatment.visits }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-header disable-icon-rotate>
                        Status:<span
                          class="ml-1"
                          :class="
                            selectedEvent.confirmed
                              ? 'success--text'
                              : 'error--text'
                          "
                        >
                          {{
                            selectedEvent.confirmed
                              ? "Potwierdzono"
                              : "Nie potwierdzono"
                          }}</span
                        >
                        <template v-slot:actions>
                          <v-icon
                            :color="
                              selectedEvent.confirmed ? 'success' : 'error'
                            "
                            >{{
                              selectedEvent.confirmed
                                ? "mdi-check"
                                : "mdi-close-circle"
                            }}</v-icon
                          >
                        </template>
                      </v-expansion-panel-header>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <v-card-actions>
                    <v-btn text color="black" @click="selectedOpen = false"
                      >anuluj</v-btn
                    >
                    <v-spacer></v-spacer>
                    <EventSummary
                      :event="selectedEvent"
                      @archived="selectedOpen = false"
                      v-if="!selectedEvent.archived"
                    />
                  </v-card-actions>
                </v-card>
              </v-menu> </v-sheet
          ></v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card class="pa-3">
            <v-card-title class="text-h4 grey--text text--darken-2"
              >Dzisiaj</v-card-title
            >
            <v-list
              v-if="getTodayNotConfirmedEvents.length > 0"
              style="height: 75.3vh; overflow-y: scroll;"
              three-line
            >
              <v-list-item-group>
                <ConfirmEventItem
                  v-for="event in getTodayNotConfirmedEvents"
                  :key="event.id"
                  :event="event"
                />
              </v-list-item-group>
            </v-list>
            <div v-else style="height: 75.3vh">
              <div class="d-flex">
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
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card class="pa-3">
            <v-card-title class="text-h4 grey--text text--darken-2"
              >Produkty</v-card-title
            >
            <v-list three-line style="height: 75.3vh; overflow-y: scroll;">
              <v-list-item-group>
                <v-list-item
                  v-for="product in getLowProducts"
                  :key="product.id"
                >
                  <v-list-item-avatar
                    class="white--text"
                    :color="product.color"
                    >{{ product.name[0] }}</v-list-item-avatar
                  >
                  <v-list-item-content>
                    <v-list-item-title>{{ product.name }}</v-list-item-title>
                    <v-list-item-subtitle
                      >Obecnie: {{ product.amount }} {{ product.unit }}<br />
                      Pozostanie: {{ product.plannedAmount }}
                      {{ product.unit }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <v-row v-else>
      <v-col cols="12" md="4">
        <v-card
          max-height="84vh"
          v-if="getUserData.doctor"
          elevation="12"
          rounded="lg"
          class="pa-3"
          ><v-sheet height="64">
            <v-toolbar flat color="white">
              <v-btn
                outlined
                class="mr-4"
                color="grey darken-2"
                @click="setToday"
                >Dzisiaj</v-btn
              >
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">{{
                $refs.calendar.title
              }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="490">
            <v-calendar
              locale="pl-PL"
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="getMyEvents"
              :event-color="getEventColor"
              @click:event="showEvent"
              type="day"
            >
              <template #day-body="{ date, week }">
                <div
                  class="v-current-time"
                  :class="{ first: date === week[0].date }"
                  :style="{ top: nowY }"
                ></div>
              </template>
            </v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card color="grey lighten-4" max-width="350" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
                </v-toolbar>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header disable-icon-rotate>
                      Klient: {{ selectedEvent.clientName }}
                      <template v-slot:actions>
                        <v-icon color="primary">mdi-account</v-icon>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-simple-table>
                        <tbody>
                          <tr>
                            <td>Imię</td>
                            <td>{{ selectedClient.name }}</td>
                          </tr>
                          <tr>
                            <td>Nazwisko</td>
                            <td>{{ selectedClient.surname }}</td>
                          </tr>
                          <tr>
                            <td>Telefon</td>
                            <td>
                              <a :href="`tel:${selectedClient.phone}`">{{
                                selectedClient.phone
                              }}</a>
                            </td>
                          </tr>
                          <tr>
                            <td>Email</td>
                            <td>
                              <a :href="`mailto:${selectedClient.email}`">{{
                                selectedClient.email
                              }}</a>
                            </td>
                          </tr>
                          <tr>
                            <td>Wizyt</td>
                            <td>{{ selectedClient.visits }}</td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header disable-icon-rotate>
                      Zabieg: {{ selectedTreatment.name }}
                      <template v-slot:actions>
                        <v-icon color="primary">mdi-needle</v-icon>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-simple-table>
                        <tbody>
                          <tr>
                            <td>Zabieg</td>
                            <td>{{ selectedTreatment.name }}</td>
                          </tr>
                          <tr>
                            <td>Czas</td>
                            <td>
                              {{ selectedTreatment.hours }} godziny
                              {{ selectedTreatment.minutes }} minuty
                            </td>
                          </tr>
                          <tr>
                            <td>Cena</td>
                            <td>{{ selectedTreatment.price }}zł</td>
                          </tr>
                          <tr>
                            <td>Wykonano</td>
                            <td>{{ selectedTreatment.visits }}</td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header disable-icon-rotate>
                      Status:<span
                        class="ml-1"
                        :class="
                          selectedEvent.confirmed
                            ? 'success--text'
                            : 'error--text'
                        "
                      >
                        {{
                          selectedEvent.confirmed
                            ? "Potwierdzono"
                            : "Nie potwierdzono"
                        }}</span
                      >
                      <template v-slot:actions>
                        <v-icon
                          :color="selectedEvent.confirmed ? 'success' : 'error'"
                          >{{
                            selectedEvent.confirmed
                              ? "mdi-check"
                              : "mdi-close-circle"
                          }}</v-icon
                        >
                      </template>
                    </v-expansion-panel-header>
                  </v-expansion-panel>
                </v-expansion-panels>
                <v-card-actions>
                  <v-btn text color="black" @click="selectedOpen = false"
                    >anuluj</v-btn
                  >
                  <v-spacer></v-spacer>
                  <EventSummary
                    :event="selectedEvent"
                    @archived="selectedOpen = false"
                    v-if="!selectedEvent.archived"
                  />
                </v-card-actions>
              </v-card>
            </v-menu> </v-sheet
        ></v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-3" rounded="lg">
          <v-card-title class="text-h4 grey--text text--darken-2"
            >Dzisiaj</v-card-title
          >
          <v-list
            v-if="getTodayNotConfirmedEvents.length > 0"
            :class="!$vuetify.breakpoint.mobile ? 'desktop' : ''"
            three-line
          >
            <v-list-item-group>
              <ConfirmEventItem
                v-for="event in getTodayNotConfirmedEvents"
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
      <v-col cols="12" md="4">
        <v-card class="pa-3" rounded="lg">
          <v-card-title class="text-h4 grey--text text--darken-2"
            >Produkty</v-card-title
          >
          <v-list three-line style="height: 69vh; overflow-y: scroll;">
            <v-list-item-group>
              <v-list-item v-for="product in getLowProducts" :key="product.id">
                <v-list-item-avatar
                  class="white--text"
                  :color="product.color"
                  >{{ product.name[0] }}</v-list-item-avatar
                >
                <v-list-item-content>
                  <v-list-item-title>{{ product.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >Obecnie: {{ product.amount }} {{ product.unit }}<br />
                    Pozostanie:
                    <span
                      :class="
                        product.plannedAmount < product.newAmount
                          ? 'error--text'
                          : ''
                      "
                      >{{ product.plannedAmount }} {{ product.unit }}</span
                    ></v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EventSummary from "@/components/EventSummary";
import ConfirmEventItem from "@/components/ConfirmEventItem";
export default {
  data: () => ({
    focus: "",
    value: "",
    ready: false,
    selectedEvent: {},
    selectedTreatment: {},
    selectedClient: {},
    selectedElement: null,
    selectedOpen: false,
    tab: null,
    items: ["Dzisiaj", "Klientki", "Produkty"],
  }),
  components: {
    EventSummary,
    ConfirmEventItem,
  },
  mounted() {
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
  },
  methods: {
    ...mapActions(["archiveEvent"]),
    getEventColor(event) {
      return !event.archived ? event.color : "#969696";
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);
      if (this.cal) this.cal.scrollToTime(first);
    },
    updateTime() {
      if (this.cal) {
        setInterval(() => this.cal.updateTimes(), 60 * 1000);
      }
    },
    async showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();

      let client = await this.selectedEvent.clientRef.get();
      this.selectedClient = client.data();
      this.selectedClient.id = client.id;

      let treatment = await this.selectedEvent.treatmentRef.get();
      this.selectedTreatment = treatment.data();
      this.selectedTreatment.id = treatment.id;
    },
  },
  computed: {
    ...mapGetters([
      "getAllEvents",
      "getSalon",
      "getUserData",
      "getTodayNotConfirmedEvents",
      "getLowProducts",
    ]),
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
    getMyEvents() {
      return this.getAllEvents.filter(
        (v) =>
          v.category == `${this.getUserData.name} ${this.getUserData.surname}`
      );
    },
  },
};
</script>

<style scoped lang="scss">
.testHomeClass {
  background: #d984a3;
  height: 100%;
}

.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: "";
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>
