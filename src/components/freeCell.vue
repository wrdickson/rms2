<template>
  <div>
    <v-btn
      @click="freeCellClick"
      tile
      depressed
      x-small
      block
      color="#dedede"
      style="margin-top: 1px"
    ></v-btn>
  </div>
</template>

<script>
export default {
  name: 'freeCell',
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
  data () {
    return {
    }
  },
  methods: {
    freeCellClick () {
      const rDate = this.field
      const spaceId = this.rowData.space
      console.log('spaceId: ', spaceId)
      console.log('rDate: ', rDate)
    }
  }
}
</script>
