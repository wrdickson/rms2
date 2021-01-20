<template>
  <v-container>
    <v-row dense>
      <v-col>
        <resViewStart
          @dateChange="dateChange"
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
      //  probably should extract this out to this.$store
      rootSpaces: null,
      token: this.$store.state.jwt
    }
  },
  computed: {
    endDate () { return this.$store.state.resViewEnd },
    startDate () { return this.$store.state.resViewStart }
  },
  methods: {
    dateChange (date) {
      var endDate = dayjs(date).add(32, 'day').format('YYYY-MM-DD')
      api.engine.getReservationsFromStart(this.$store.state.jwt, date, endDate).then((response) => {
        this.$store.commit('setResViewStart', response.data.startDate)
        this.$store.commit('setResViewEnd', response.data.endDate)
        this.$store.commit('setReservations', response.data.reservations)
      })
    }
  },
  created () {
    //  TODO EXTRACT THIS OUT TO VUEX STORE
    //  get the data at load
    api.engine.getRootSpaces(this.token).then((response) => {
      this.rootSpaces = response.data.root_spaces
    })
  }
}
</script>

<style scoped>

</style>
