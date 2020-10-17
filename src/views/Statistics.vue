<template>
  <v-container>
      <div class="text-h4 grey--text mt-2 mb-5" v-text="statsString"></div>
      <v-sheet
      tile
      height="54"
      class="d-flex"
    >
      <v-btn
        v-if="type !== 'Rok'"
        icon
        class="ma-2"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="Typ"
      ></v-select>
      <v-btn
        icon
        class="ma-2"
        v-if="type !== 'Rok'"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
      <IncomeChart/>
  </v-container>
</template>

<script>
import IncomeChart from '@/components/IncomeChart'
import { mapActions } from 'vuex'
export default {
    components: {
        IncomeChart,
    },
    data: () => ({
        type: 'Rok',
        types: ['Rok', 'Miesiąc'],
        month: new Date().getMonth(),
        monthNames: ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień']
    }),
    methods: {
        ...mapActions(['setStatsType']),
    },
    watch: {
        type(val) {
            this.setStatsType(val);
        }
    },
    computed: {
        statsString() {
            if(this.type === 'Rok') {
                return `Statystyki na rok ${new Date().getFullYear()}`;
            } else {
                return `Statyski na ${this.monthNames[this.month]} ${new Date().getFullYear()}`
            }
        }
    }
}
</script>
