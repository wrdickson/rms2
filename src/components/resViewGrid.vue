<template>
  <div style="width: 100%; height: 700px;">
    <v-btn @click="hideRow">hiderow</v-btn>
    <v-btn @click="showRow">showrow</v-btn>
    <v-btn @click="editCell">editcell</v-btn>
    <div
      id="grid"
      ref="grid"
      class="dhx-container--grid"
      style="height: 500px;"
    ></div>
  </div>
</template>

<script>
import 'dhx-suite/codebase/suite.min.css'
import { Grid as GridDHX } from 'dhx-suite'
import dayjs from 'dayjs'
import _ from 'lodash'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)
export default {
  name: 'resViewGrid',
  props: [
    'startDate',
    'endDate',
    'reservations',
    'spaces'
  ],
  data: function () {
    return {
      dataset: [
        { room: 'foot', bar: 'bart' },
        { room: 'fooey', bar: 'bartholemew' }
      ],
      grid: null,
      scrollPosition: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    //  grid consumes this to render the columns
    columns () {
      var columns = []
      //  first column - room name
      var roomCol = { minWidth: 160, id: 'room', header: [{ text: 'Room', align: 'left' }] }
      columns.push(roomCol)
      //  toggle expansion column
      var toggleColumn = { minWidth: 40, id: 'toggle', header: [{ text: '', align: 'left' }], htmlEnable: true }
      columns.push(toggleColumn)

      //  iterate through days to create date id'd columns
      var iDate = dayjs(this.startDate)
      do {
        var dateCol = { minWidth: 50, id: iDate.format('YYYY-MM-DD'), header: [{ text: iDate.format('MM-DD'), align: 'left' }] }
        columns.push(dateCol)
        iDate = iDate.add(1, 'day')
      }
      while (iDate.diff(dayjs(this.endDate), 'day') < 0)
      return columns
    },
    resDataSet () {
      var resData = []
      _.each(this.spaces, (space) => {
        var iData = {
          id: space.space_id,
          room: space.description,
          toggle: '<span id="toggle' + space.space_id + '" class="cell__html"><i data-toggleid="' + space.space_id + '"class="mdi mdi-arrow-right-drop-circle mdi-24px"></i></span>'
        }
        var reses = _.filter(this.reservations, function (o) {
          return o.space_id === space.space_id
        })
        _.each(reses, (res) => {
          /* we need to handle the case where the checkin date is BEFORE
          *  start date. In this case, use startDate instead
          *  Sketchy, but it doesn't change the reservation data
          *  which is the authority in generating spans
          */
          var dayBeforeStart = dayjs(this.startDate).subtract(1, 'day')
          if (dayjs(res.checkin).isSameOrBefore(dayBeforeStart)) {
            console.log('got one in resDataSet', res)
            //  assign grid start date rather than the usual checkin
            iData[this.startDate] = res.id
          } else {
            iData[res.checkin] = res.id
          }
        })
        resData.push(iData)
      })
      return resData
    },
    //  grid consumes this to render column spans
    //  we, however, are using it to create a span for each reservation
    //  then using html rendering to show the reservation
    spans () {
      var spans = []
      _.each(this.reservations, (reservation) => {
        var diff = dayjs(reservation.checkout).diff(reservation.checkin, 'day')
        var iSpan = {}
        iSpan.row = reservation.space_id
        //  we need to check for reservations that start BEFORE start date
        var dayBefore = dayjs(this.startDate).subtract(1, 'day')
        if (dayjs(reservation.checkin).isSameOrBefore(dayBefore)) {
          var diffPartial = dayjs(reservation.checkout).diff(this.startDate, 'day')
          iSpan.column = this.startDate
          iSpan.colspan = diffPartial
          iSpan.text = '<span class="cell__html resActive" data-resid="' + reservation.id + '"><--' + reservation.customer_obj.lastName + '</span>'
        } else {
          iSpan.column = reservation.checkin
          iSpan.colspan = diff
          iSpan.text = '<span class="cell__html resActive" data-resid="' + reservation.id + '">' + reservation.customer_obj.lastName + '</span>'
        }
        spans.push(iSpan)
      })
      return spans
    },
    //  this is basically a copy of the 'show_subspaces' property on each
    //  space object.  the stored 'show_subspaces' is basically the initial state
    //  we want the view to be in  . . but there will be lots of hiding and showing
    //  as the user's interaction with the grid continues . . .
    toggleState () {
      var toggleState = []
      _.each(this.spaces, (space) => {
        var obj = {
          space_id: space.space_id,
          show_subspaces: space.show_subspaces
        }
        toggleState.push(obj)
      })
      return toggleState
    }
  },
  methods: {
    hideRow () {
      this.grid.hideRow(204)
    },
    showRow () {
      this.grid.showRow(204)
    },
    editCell () {
      console.log('go')
      this.resDataSet[0].toggle = '<span id="toggle1" class="cell__html"><i data-toggleid="balvatsky"class="mdi mdi-home mdi-24px"></i></span>'
      this.grid.paint()
    },
    renderGrid () {
      if (this.grid) {
        this.grid.destructor()
      }
      this.grid = new GridDHX(this.$refs.grid, {
        columns: this.columns,
        data: this.resDataSet,
        spans: this.spans,
        adjust: false,
        autoWidth: true,
        autoEmptyRow: true,
        rowHeight: 32,
        headerRowHeight: 32,
        sortable: false,
        leftSplit: 2,
        height: this.windowHeight - 180,
        eventHandlers: {
          //  this fires when a cell with class 'cell__html' is clicked
          onclick: {
            cell__html: (event, data) => {
              var resId = event.originalTarget.dataset.resid
              //  send the event to the parent component
              //  this.$emit('resClick', resId)
              console.log('resId: ', resId)
            }
          }
        }
      })
      //  this fires on empty cells
      this.grid.events.on('CellClick', (row, column, e) => {
        //  send the event to the parent component
        //  this.$emit('cellClick', row.id, column.id)
        const selectedSpaceId = row.id
        const selectedDate = column.id
        console.log('selectedSpaceId: ', selectedSpaceId)
        console.log('selectedDate: ', selectedDate)
      })
      this.grid.events.on('scroll', (position) => {
        //  console.log(position)
        this.scrollPosition.y = position.y
        this.scrollPosition.x = position.x
      })
    }
  },
  watch: {
    startDate: function (val) {
      this.renderGrid()
    }
  },
  mounted () {
    this.renderGrid()
  },
  beforeDestroy () {
    if (this.grid) {
      this.grid.destructor()
    }
  }
}
</script>

<style>
#grid{
  width: 100%;
  height: 300px;
  z-index: 100;
}
.resActive{
  background-color: rgb(146, 158, 211);
  padding-left: 2px;
  margin-bottom: 2px;
  width: 100%;
  display: block;
  border-radius: 6px;
  overflow: hidden;
}
</style>
