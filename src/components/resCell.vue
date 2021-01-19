<template>
  <div>
    <v-btn
      @click="resCellClick"
      tile
      depressed
      x-small
      block
      color="indigo lighten-2"
      style="margin-top: 1px"
    >
      {{ resId }}
    </v-btn>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'resCell',
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  computed: {
    resId: {
      get () {
        let resI
        _.each(this.rowData, (value, index) => {
          if (index === this.field) {
            resI = value
          }
        })
        return resI
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    resCellClick: function () {
      console.log('id: ', this.resId)
    }
  }
}
</script>
