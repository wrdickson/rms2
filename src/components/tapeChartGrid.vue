<template>
  <div id="grid-container">
    <div>
      <v-btn @click="checkAvail">check avail</v-btn>
    </div>

    <div
      v-if="tapeChartGridShowState"
    >
      <div
        id="grid"
        ref="grid"
        class="dhx-container--grid"
      ></div>
    </div>
  </div>
</template>

<script>

import api from '../api/api.js'
import 'dhx-suite/codebase/suite.min.css'
import { Grid as GridDHX, awaitRedraw } from 'dhx-suite'
import _ from 'lodash'
import dayjs from 'dayjs'
//  plugin syntax for dayjs:
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
      loader: true,
      scrollPosition: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    columns () {
      //  generate the columns: basically, we need the room, a child view toggler,
      //  then a month of date columnss
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
    tapeChartGridShowState () { return this.$store.state.tapeChartGridShowState },
    tapeChartScrollPosition () { return this.$store.state.tapeChartScrollPosition },
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
          room: space.title
          //  toggle: '<span id="toggle' + space.id + '" class="cell__html"><i data-toggleid="' + space.id + '"class="mdi mdi-arrow-right-drop-circle mdi-24px"></i></span>'
        }
        //  determine which, if any, toggle button to shoe
        if (this.tapeChartGridShowState[space.id].showChildren === false && this.tapeChartGridShowState[space.id].children.length > 0) {
          iData.toggle = '<span id="toggle' + space.id + '" class="cell__html"><i id="toggleIcon' + space.id + '" data-toggleid="' + space.id + '"class="mdi mdi-arrow-right-drop-circle mdi-24px"></i></span>'
        }
        if (this.tapeChartGridShowState[space.id].showChildren === true && this.tapeChartGridShowState[space.id].children.length > 0) {
          iData.toggle = '<span id="toggle' + space.id + '" class="cell__html"><i data-toggleid="' + space.id + '"class="mdi mdi-arrow-down-drop-circle mdi-24px"></i></span>'
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
      const spans = []
      _.each(this.reservations, (reservation) => {
        const diff = dayjs(reservation.checkout).diff(reservation.checkin, 'day')
        //  iterate thorugh each spaceCode in the reservation, so that we
        //  block out all children, too
        var spaces = reservation.space_code.split(',')
        _.each(spaces, (spaceId) => {
          const iSpan = {}
          iSpan.row = spaceId
          //  we need to check for reservations that start BEFORE visible start date
          //  TODO: AND ALSO AFTER VISIBLE START DATE . . . . NOT PRESENTING WHEN CLIPPED END!!!
          //  and adjust the PRESENTED start date, without fucking up the ACTUAL start date
          const dayBefore = dayjs(this.startDate).subtract(1, 'day')
          if (dayjs(reservation.checkin).isSameOrBefore(dayBefore)) {
            const diffPartial = dayjs(reservation.checkout).diff(this.startDate, 'day')
            iSpan.column = this.startDate
            iSpan.colspan = diffPartial
            //  this is where we are clipping a reservation FROM THE START
            //  so present a visual clue that the reservation has been clipped FROM THE START
            iSpan.text = '<span class="cell__html resActive" data-resid="' + reservation.id + '"><--' + reservation.customer_obj.lastName + '</span>'
          } else {
            iSpan.column = reservation.checkin
            iSpan.colspan = diff
            iSpan.text = '<span class="cell__html resActive" data-resid="' + reservation.id + '">' + reservation.customer_obj.lastName + '</span>'
          }
          spans.push(iSpan)
        })
      })
      return spans
    }
  },
  methods: {
    checkAvail () {
      console.log('checkAvail()')
      const start = '2021-02-02'
      const end = '2021-02-10'
      api.engine.checkAvailabilityByDates(start, end).then((response) => {

      })
    },
    renderGrid () {
      console.log('renderGrid() fires', this.gridWidth)
      //  this.loader = true
      //  please take care of the Zombies . . . please
      if (this.grid) {
        this.grid.destructor()
      }
      this.grid = new GridDHX(this.$refs.grid, {
        columns: this.columns,
        data: this.rows,
        spans: this.spans,
        adjust: false,
        autoWidth: false,
        autoEmptyRow: true,
        rowHeight: 32,
        headerRowHeight: 32,
        sortable: false,
        leftSplit: 2,
        width: 800,
        height: 300,
        eventHandlers: {
          //  this fires when a cell with class 'cell__html' is clicked
          //  in this case, an actual reservation
          onclick: {
            cell__html: (event, data) => {
              const resId = event.target.getAttribute('data-resid')
              //  THIS IS WHERE WE HANDLE RESERVATION SELECTION
              console.log('SELECT RESERVATION:', resId)
            }
          }
        }
      })
      //  this fires on empty cells
      this.grid.events.on('CellClick', (row, column, e) => {
        //  send the event to the parent component
        const toggleId = event.target.getAttribute('data-toggleid')
        const selectedSpaceId = row.id
        const selectedColumn = column.id
        //  look for a toggle SHOW and HIDE events
        if (toggleId) {
          console.log('toggleId', toggleId)
          console.log('before', this.tapeChartGridShowState[toggleId].showChildren)
          console.log('children', this.tapeChartGridShowState[toggleId].children)
          if (this.tapeChartGridShowState[toggleId].showChildren === true) {
            _.each(this.tapeChartGridShowState[toggleId].children, (childId) => {
              this.grid.hideRow(childId)
            })
            this.grid.paint()
          } else {
            _.each(this.tapeChartGridShowState[toggleId].children, (childId) => {
              this.grid.showRow(childId)
            })
            this.grid.paint()
          }
          //  make a clone of tapeChartGridShowState
          const clone = JSON.parse(JSON.stringify(this.tapeChartGridShowState))
          clone[toggleId].showChildren = !clone[toggleId].showChildren
          //  update to store
          //  this will fire the WATCH below, which will fire renderGrid()
          this.$store.commit('setTapeChartGridShowState', clone)
        }
        //  look for an empty cell selection (ie MAKE RESERVATION)
        if (toggleId === null && selectedColumn !== 'room' && selectedColumn !== 'toggle') {
          console.log('create reservation ', selectedSpaceId, ' ', selectedColumn)
          this.$router.push({
            name: 'create-reservation',
            params: { checkin: selectedColumn }
          })
        }
      })

      //  scroll info
      this.grid.events.on('Scroll', (obj) => {
        this.$store.commit('setTapeChartScrollPosition', obj)
      })
      //  scroll
      awaitRedraw().then(() => {
        console.log('awaitRedraw() completes')
        this.grid.scroll(this.tapeChartScrollPosition.x, this.tapeChartScrollPosition.y)

        //  now go through and hide rows as appropriate
        _.each(this.tapeChartGridShowState, (spaceState) => {
          if (spaceState.showChildren === false) {
            _.each(spaceState.children, (childId) => {
              this.grid.hideRow(childId)
            })
          }
        })

        //  this.loader = false
      })
      /*
      setTimeout(() => {
        //  this.grid.scroll(this.tapeChartScrollPosition.x, this.tapeChartScrollPosition.y)
        this.loader = false
      }, 1000)
      */

      /*
      //  now go through and hide rows as appropriate
      _.each(this.tapeChartGridShowState, (spaceState) => {
        if (spaceState.showChildren === false) {
          _.each(spaceState.children, (childId) => {
            this.grid.hideRow(childId)
          })
        }
      })
      */
    }
  },
  beforeUnmount () {
    console.log('beforeUnmount()')
    if (this.grid) {
      this.grid.destructor()
    }
  },
  created () {
  },
  mounted () {
    this.gridWidth = document.getElementById('grid').offsetWidth
    console.log('mounted', this.gridWidth)
    this.renderGrid()
  },
  watch: {
    reservations: function (val) {
      this.renderGrid()
    },
    startDate: function (val) {
      this.renderGrid()
    },
    tapeChartGridShowState: function (val) {
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
.dhx_number-cell{
  text-align: left !important;
}
</style>
