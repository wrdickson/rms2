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
          label="Select date"
          prepend-icon="mdi mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="date" no-title @input="menu = false"></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'resEnd',
  data: function () {
    return {
      menu: false,
      //  actually, we want a prop here . . . components don't go to $store
      date: this.$store.state.resViewStart
    }
  },
  computed: {
    computedDateFormatted () {
      return dayjs(this.date).format('MMMM DD YYYY')
    }
  },
  methods: {
    dateChange () {
      console.log('dateChange()', this.date)
    }
  },
  watch: {
    date (val, oldVal) {
      this.$emit('resEndChange', this.date)
    }
  }
}
</script>

<style>
.v-text-field__details {
  display: none;
}
</style>
