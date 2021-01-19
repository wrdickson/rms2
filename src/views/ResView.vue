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
      <resViewGrid
        :startDate="startDate"
        :endDate="endDate"
        :reservations="reservations"
        :spaces="spaces"
        @resClick="resClick"
        @cellClick="cellClick"
      />
    </v-row>
   </v-container>
</template>

<script>
import api from '../api/api.js'
import resViewStart from '../components/resViewStart.vue'
import resViewGrid from '../components/resViewGrid.vue'
import dayjs from 'dayjs'
export default {
  name: 'ResView',
  components: {
    resViewStart,
    resViewGrid
  },
  computed: {
    reservations () { return this.$store.state.reservations },
    startDate () { return this.$store.state.resViewStart },
    endDate () { return this.$store.state.resViewEnd },
    spaces () { return this.$store.state.spaces }
  },
  methods: {
    cellClick (spaceId, date) {
      console.log(spaceId, date)
    },
    dateChange (date) {
      var endDate = dayjs(date).add(32, 'day').format('YYYY-MM-DD')
      api.engine.getReservationsFromStart(this.$store.state.jwt, date, endDate).then((response) => {
        this.$store.commit('setResViewStart', response.data.startDate)
        this.$store.commit('setResViewEnd', response.data.endDate)
        this.$store.commit('setReservations', response.data.reservations)
      })
    },
    resClick (resId) {
      console.log(resId)
    }
  }
}
</script>
