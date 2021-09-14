<template>
  <v-container>
    <v-row dense>
      <v-col>
        <resViewStart
          @resStartChange="dateChange"
        />
      </v-col>
    </v-row>
    <v-row>
      <tapeChartGrid
        v-if="rootSpaces"
        :rootSpaces="rootSpaces"
        :startDate="startDate"
        :endDate="endDate"
      />
    </v-row>
  </v-container>
</template>

<script>
//  eslint-disable-next-line
import api from '../api/api.js'
import dayjs from 'dayjs'
import resViewStart from '../components/resViewStart.vue'
import tapeChartGrid from '../components/tapeChartGrid.vue'
export default {
  name: 'TapeChartView',
  props: [
  ],
  components: {
    resViewStart,
    tapeChartGrid
  },
  data: function () {
    return {
      account: this.$store.state.account,
      token: this.$store.state.jwt
    }
  },
  computed: {
    endDate () { return this.$store.state.resViewEnd },
    rootSpaces () { return this.$store.state.rootSpaces },
    startDate () { return this.$store.state.resViewStart }
  },
  methods: {
    dateChange (date) {
      console.log('datechange()')
      var endDate = dayjs(date).add(32, 'day').format('YYYY-MM-DD')
      //  here's another component level data call
      api.engine.getReservationsFromStart(this.$store.state.jwt, date, endDate).then((response) => {
        this.$store.commit('setResViewStart', response.data.startDate)
        this.$store.commit('setResViewEnd', response.data.endDate)
        this.$store.commit('setReservations', response.data.reservations)
      })
    }
  },
  created () {
  }
}
</script>

<style scoped>

</style>
