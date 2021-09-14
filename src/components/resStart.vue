<template>
  <div style="width: 170px;">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      style="z-index: 2000;"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="computedDateFormatted"
          label="Checkin"
          prepend-icon="mdi mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="checkinLocal" no-title @input="menu = false"></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'resStart',
  data: function () {
    return {
      menu: false,
      checkinLocal: this.checkin.slice()
    }
  },
  props: {
    checkin: String
  },
  computed: {
    computedDateFormatted () {
      return dayjs(this.checkinLocal).format('MMMM DD YYYY')
    }
  },
  methods: {
    dateChange () {
      console.log('dateChange()', this.checkinLocal)
    }
  },
  watch: {
    checkinLocal (val, oldVal) {
      this.$emit('checkinDateChange', this.checkinLocal)
    }
  }
}
</script>

<style>
.v-text-field__details {
  display: none;
}
</style>
