<template>
  <div>
    <div
      id="grid"
      ref="grid"
      class="dhx-container--grid"
      style="height: 500px; width: 800px;"
    ></div>
  </div>
</template>

<script>
import 'dhx-suite/codebase/suite.min.css'
//  eslint-disable-next-line
import { Grid as GridDHX } from 'dhx-suite'
import dayjs from 'dayjs'
//  eslint-disable-next-line
import _ from 'lodash'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)
export default {
  name: 'tapeChartGrid',
  props: {
    rootSpaces: Array,
    startDate: String,
    endDate: String
  },
  data: () => {
    return {
      grid: null,
      scrollPosition: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
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
    reservations () {
      return this.$store.state.reservations
    },
    rows () {
      /*
      * iterate through each of the rootSpaces,
      * THEN add the rootSpace to the room column & the toggle button to the toggle column
      * THEN iterate through the reservations that have that spaceId & create
      * a cell with just the resId . . . we'll handle the html in spans()
      */
      var resData = []
      var iData = {} //  the object that makes a row, cells by column id
      var dayBeforeStart = null
      var resesBySpace = []

      _.each(this.rootSpaces, (space) => {
        iData = {
          id: space.id,
          room: space.title,
          toggle: '<span id="toggle' + space.id + '" class="cell__html"><i data-toggleid="' + space.id + '"class="mdi mdi-arrow-right-drop-circle mdi-24px"></i></span>'
        }
        resesBySpace = _.filter(this.reservations, function (o) {
          return o.space_id === space.id
        })
        _.each(resesBySpace, (res) => {
          /* we need to handle the case where the checkin date is BEFORE
          *  start date. In this case, use startDate instead
          *  Sketchy, but it doesn't change the reservation data
          *  which is the authority in generating spans
          */
          dayBeforeStart = dayjs(this.startDate).subtract(1, 'day')
          if (dayjs(res.checkin).isSameOrBefore(dayBeforeStart)) {
            //  assign grid start date rather than the usual checkin
            iData[this.startDate] = res.id
          } else {
            //  this is where we assign resId to that cell in the grid
            //  in spans(), we'll actually make the html
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
    }
  },
  methods: {
    renderGrid () {
      if (this.grid) {
        this.grid.destructor()
      }
      this.grid = new GridDHX(this.$refs.grid, {
        columns: this.columns,
        data: this.rows,
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
              console.log('resId: ', resId)
            }
          }
        }
      })
      //  this fires on empty cells
      this.grid.events.on('CellClick', (row, column, e) => {
        //  send the event to the parent component
        //  this.$emit('cellClick', row.id, column.id)
        const toggleId = event.target.getAttribute('data-toggleid')
        console.log('toggleId', toggleId)
        const selectedSpaceId = row.id
        const selectedColumn = column.id
        console.log('selectedSpaceId: ', selectedSpaceId)
        console.log('selectedColumn: ', selectedColumn)
      })
      this.grid.events.on('scroll', (position) => {
        //  console.log(position)
        this.scrollPosition.y = position.y
        this.scrollPosition.x = position.x
      })
    }
  },
  mounted () {
    this.renderGrid()
  },
  watch: {
    startDate: function (val) {
      this.renderGrid()
    }
  }
}
</script>

<style>
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
