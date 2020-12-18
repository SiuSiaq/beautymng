<script>
import { Bar } from "vue-chartjs";
import { mapGetters } from "vuex";
export default {
  extends: Bar,
  data: () => ({
    currentMont: new Date().getMonth(),
    labels: [],
    yearlyLabels: [],
    monthlyLabels: [],
    values: [],
    yearlyValues: [],
    monthlyValues: [],
    months: [
      {
        name: "Styczeń",
        days: [],
        value: 0,
      },
      {
        name: "Luty",
        days: [],
        value: 0,
      },
      {
        name: "Marzec",
        days: [],
        value: 0,
      },
      {
        name: "Kwiecień",
        days: [],
        value: 0,
      },
      {
        name: "Maj",
        days: [],
        value: 0,
      },
      {
        name: "Czerwiec",
        days: [],
        value: 0,
      },
      {
        name: "Lipiec",
        days: [],
        value: 0,
      },
      {
        name: "Sierpień",
        days: [],
        value: 0,
      },
      {
        name: "Wrzesień",
        days: [],
        value: 0,
      },
      {
        name: "Październik",
        days: [],
        value: 0,
      },
      {
        name: "Listopad",
        days: [],
        value: 0,
      },
      {
        name: "Grudzień",
        days: [],
        value: 0,
      },
    ],
  }),
  methods: {
    getDaysInMonth(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    },
    setYearView() {
      this.labels = this.yearlyLabels;
      this.values = this.yearlyValues;
      this.loadChart();
    },
    setMonthView(month) {
      this.labels = this.months[month].days.map((v) => v.name);
      this.values = this.months[month].days.map((v) => v.value);
      this.loadChart();
    },
    loadChart() {
        this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            backgroundColor: "#D9486E",
            label: "Przychody ",
            data: this.values,
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
      }
    );
    }
  },
  computed: mapGetters(["getAllEvents", "getStatsType"]),
  mounted() {
    let now = new Date();
    let j = 0;
    this.months.forEach((month) => {
      this.yearlyLabels.push(month.name);
      let i = this.getDaysInMonth(new Date(`${now.getFullYear()}-${j + 1}-1`));
      for (let k = 1; k <= i; k++) {
        this.months[j].days.push({
          name: k < 10 ? `0${k}` : `${k}`,
          value: 0,
        });
      }
      j++;
    });

    this.getAllEvents.forEach((event) => {
      if (!event.startDate.toDate().getFullYear() === now.getFullYear()) return;
      let month = event.startDate.toDate().getMonth();
      let day = event.startDate.toDate().getDate();
      this.months[month].value += event.price;
      this.months[month].days[day - 1].value += event.price;
    });

    this.yearlyValues = this.months.map((v) => v.value);
    this.labels = this.yearlyLabels;
    this.values = this.yearlyValues;

    this.loadChart();
  },
  watch: {
    getStatsType(val) {
      switch (val) {
        case "Rok":
          this.setYearView();
          break;
        case "Miesiąc":
          this.setMonthView(new Date().getMonth());
          break;
        default:
          break;
      }
    },
  },
};
</script>