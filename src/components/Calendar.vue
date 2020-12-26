<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday"
            >Dziś</v-btn
          >
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            class="mr-4"
            @click="next"
          >
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">{{
            $refs.calendar.title
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Dzień</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Tydzień</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Miesiąc</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 Dni</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          locale="pl-PL"
          ref="calendar"
          v-model="focus"
          color="primary"
          :weekdays="weekdays"
          :events="getAllEvents"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
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
              <EditEvent
                @eventUpdated="selectedOpen = false"
                v-if="!selectedEvent.archived"
              />
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
                  Wykonawca: {{ selectedEvent.doctorName }}
                  <template v-slot:actions>
                    <v-icon color="primary">mdi-doctor</v-icon>
                  </template>
                </v-expansion-panel-header>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  Status:<span
                    class="ml-1"
                    :class="
                      selectedEvent.confirmed ? 'success--text' : 'error--text'
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
              <v-btn text color="primary" @click="selectedOpen = false"
                >anuluj</v-btn
              >

              <v-btn
                text
                color="primary"
                :loading="deleteLoader"
                @click="deleteClick"
                v-if="!selectedEvent.archived"
                >usuń</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import EditEvent from "@/components/EditEvent";

export default {
  components: {
    EditEvent,
  },
  data: () => ({
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    focus: "",
    type: "week",
    typeToLabel: {
      month: "Miesiąc",
      week: "Tydzień",
      day: "Dzień",
      "4day": "4 Dni",
    },
    ready: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    selectedClient: {},
    selectedTreatment: {},
    deleteLoader: false,
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
    this.$vuetify.breakpoint.mobile ? this.type = "4day" : this.type = "week";
  },
  methods: {
    ...mapActions(["removeEvent", "selectEvent"]),
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
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

      this.selectEvent(event);

      let client = await this.selectedEvent.clientRef.get();
      this.selectedClient = client.data();
      this.selectedClient.id = client.id;

      let treatment = await this.selectedEvent.treatmentRef.get();
      this.selectedTreatment = treatment.data();
      this.selectedTreatment.id = treatment.id;
    },
    async deleteClick() {
      this.deleteLoader = true;
      await this.removeEvent(
        this.selectedEvent,
        this.selectedClient,
        this.selectedTreatment
      );
      this.deleteLoader = false;
      this.selectedOpen = false;
    },
    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);

      this.cal.scrollToTime(first);
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
  },
  computed: {
    ...mapGetters(["getAllEvents"]),
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
  },
};
</script>

<style lang="scss">
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
