<template>
  <v-row>
    <v-col no-gutters>
      <v-table
        :height="350"
        :columns="cColumns"
        :table-data="tableData"
        :column-cell-class-name="columnCellClass"
        :cell-merge="cellMerge"
        :row-height="22"
        :is-horizontal-resize="true"
        style="width:100%"
      ></v-table>
    </v-col>
  </v-row>
</template>

<script>
//  notice how vue-easytables, resCell, and freeCell are not imported here.
//  they are registered globally in main.js
//  see the comments in main.js about difficulties when I worked this out
//  in the 'btable' project

// eslint-disable-next-line
import moment from 'moment'
// eslint-disable-next-line
import _ from 'lodash'
export default {
  name: 'resTable',
  props: [
  ],
  computed: {
    cColumns: {
      get () {
        var cols = []
        let i
        var iObj = {}
        // add the space field
        var spaceObj = {
          field: 'space',
          title: 'Space',
          width: 170,
          titleAlign: 'center',
          columnAlign: 'left',
          isFrozen: true
        }
        cols.push(spaceObj)
        for (i = 1; i < 31; i++) {
          iObj.i = i
          iObj.field = moment(this.resTableStart).add(i, 'days').format('YYYY-MM-DD')
          iObj.title = moment(this.resTableStart).add(i, 'days').format('YYYY-MM-DD')
          iObj.width = 90
          iObj.titleAlign = 'center'
          iObj.columnAlign = 'center'
          cols.push(iObj)
          iObj = {}
        }
        return cols
      }
    },
    tableData: {
      get () {
        var rows = []
        _.each(this.spaces, (space) => {
          var iObj = {
            space: space.description
          }
          _.each(this.reservations, (reservation) => {
            if (space.space_id === reservation.space_id) {
              iObj[reservation.checkin] = reservation.id
            }
          })
          rows.push(iObj)
        })
        return rows
      }
    },
    reservations () {
      return this.$store.state.reservations
    },
    resViewEnd () {
      return this.$store.state.resViewEnd
    },
    resViewStart () {
      return this.$store.state.resViewStart
    },
    spaces () {
      return this.$store.state.spaces
    }

  },
  data () {
    return {
    }
  },
  methods: {
    cellMerge (rowIndex, rowData, field) {
      let isMatch = false
      let resId = 0
      let reservation, resDays
      _.each(rowData, (value, index) => {
        if (index === field && index !== 'space') {
          isMatch = true
          resId = value
          reservation = _.find(this.reservations, o => {
            return o.id === resId
          })
          resDays = moment.duration(moment(reservation.checkout).diff(moment(reservation.checkin))).asDays()
        }
      })
      // this is where we build the reservation component
      if (isMatch === true) {
        return {
          colSpan: resDays,
          rowSpan: 1,
          componentName: 'resCell'
        }
      // else, we make a component the user can click to make a reservation in that cell
      }
      if (field !== 'space') {
        return {
          colSpan: 1,
          rowSpan: 1,
          componentName: 'freeCell'
        }
      }
    },
    columnCellClass (rowIndex, columnName, rowData) {

    }
  }
}
</script>

<style>
table, td {
  background-color:#dedede;
  border: 1px solid #ababab;
  font-size: 16px;
  color: #121212;
}
</style>
