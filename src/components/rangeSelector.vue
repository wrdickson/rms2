<template>
  <div class="range-picker" style="width: 240px;">
      <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :return-value.sync="dateRange"
      transition="scale-transition"
      style="z-index: 2000;"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateRangeFormatted"
          label="Select dates"
          prepend-icon="mdi mdi-calendar-range"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="dateRange"
        range
        no-title
        @input="validateDates"
      >
        <v-spacer></v-spacer>
        <div v-if="showReverseError === true" style="color: #ff6398;"><small>No reverse ranges</small></div>
        <v-spacer></v-spacer>
          <!-- range picker will allow reverse ranges . . . we can't, so validate -->
          <v-btn text color="primary" @click="validateBeforeClosing">Cancel</v-btn>
          <v-btn text color="primary" :disabled="okDisabled" @click="$refs.menu.save(dateRange)">OK</v-btn>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'rangeSelector',
  data: function () {
    return {
      dateRange: [
        dayjs().format('YYYY-MM-DD'),
        dayjs().add(1, 'day').format('YYYY-MM-DD')
      ],
      menu: false,
      okDisabled: true,
      showReverseError: false
    }
  },
  computed: {
    dateRangeFormatted () {
      return dayjs(this.dateRange[0]).format('MMM DD, YYYY') + ' - ' + dayjs(this.dateRange[1]).format('MMM DD, YYYY')
    }
  },
  methods: {
    validateBeforeClosing () {
      this.menu = false
    },
    //  ensure that it's not a reverse range
    validateDates () {
      const diff = dayjs(this.dateRange[1]).diff(dayjs(this.dateRange[0]))
      if (diff < 0) {
        this.okDisabled = true
        this.showReverseError = true
      } else {
        this.okDisabled = false
        this.showReverseError = false
      }
    }
  }
}
</script>

<style>
.v-text-field__details {
  display: none;
}
.range-picker {
  border-radius: 4px;
  border: 1px solid #0000aa;
}

</style>
