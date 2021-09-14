<template>
  <div>
  CreateReservation
    <v-row>
      <v-col>
        <resStart
          :checkin="checkin"
        />
      </v-col>
      <v-col>
        <resEnd/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-form>
          <v-text-field
            dense
            label="value1"
          />
          <v-text-field
            dense
            label="value2"
          />
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-icon>mdi-home</v-icon>this is home<v-btn>Button</v-btn>
      </v-col>
    </v-row>
  </div>
 </template>

<script>
import resStart from '../components/resStart.vue'
import resEnd from '../components/resEnd.vue'
export default {
  name: 'CreateReservation',
  components: {
    resStart, resEnd
  },
  props: {
    checkin: String
  }
}
</script>
