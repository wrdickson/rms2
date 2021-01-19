<template>
  <div>
    <!--
    <v-btn small color="primary" @click="hideRow">hideRow</v-btn>
    <v-btn small color="primary" @click="showRow">showRow</v-btn>
    <v-btn small color="primary" @click="scroll">scroll</v-btn>
    <v-btn small color="primary" @click="scrollTo">scrollTo</v-btn>
    <v-btn small color="primary" @click="getScrollState">getScrollState{{ scrollState }}</v-btn>
    <v-btn small color="primary" @click="gridPaint">paint</v-btn><br/>
    <v-btn small color="warning" @click="gridDestructor">destroy</v-btn><br/>
    scrollPosition: {{ scrollPosition.y }}  {{ scrollPosition.x }}
    -->
    <rangeSelector/>
    <resViewStart/>
    <div id="yearInfo">2020 / 2021</div>
    <div
      id="grid"
      ref="grid"
      class="dhx-container--grid"
      :style="styleText"
    ></div>
  </div>
</template>

<script>
import rangeSelector from '../components/rangeSelector.vue'
import resViewStart from '../components/resViewStart.vue'
import 'dhx-suite/codebase/suite.min.css'
import { Grid as GridDHX } from 'dhx-suite'
export default {
  name: 'DhtmlxGrid',
  components: {
    resViewStart,
    rangeSelector
  },
  computed: {
    styleText: {
      get: function () {
        var t = 'height: ' + (this.windowHeight - 210) + 'px;'
        return (t)
      }
    },
    resViewStart () {
      return this.$store.state.resViewStart
    }
  },
  data: function () {
    return {
      dataset: [
        { id: '1', room: 'Room 1 with a long title that will not fit' },
        { id: '2', room: 'Room 2' },
        { id: '3', room: '<span> Room 3<span style="float: right;" class="cell_html mdi mdi-arrow-down-drop-circle-outline mdi-24px"></span></span>' },
        { id: '4', room: 'Room 4' },
        { id: '5', room: 'Room 5' },
        { id: '6', room: 'Room 6' },
        { id: '7', room: 'Room 7' },
        { id: '8', room: 'Room 8' },
        { id: '9', room: 'Room 9' },
        { id: '10', room: 'Room 10' },
        { id: '11', room: 'Room 11' },
        { id: '12', room: 'Room 12' },
        { id: '13', room: 'Room 13' },
        { id: '14', room: 'Room 14' },
        { id: '15', room: 'Room 15' },
        { id: '16', room: 'Room 16' }
      ],
      grid: null,
      scrollPosition: {
        y: 0,
        x: 0
      },
      scrollState: null,
      windowHeight: window.innerHeight
    }
  },
  methods: {
    hideRow () {
      this.grid.hideRow(3)
    },
    showRow () {
      this.grid.showRow(3)
    },
    scroll () {
      this.grid.scroll(0, 0)
    },
    scrollTo () {
      //  we have to get the dhx id on row, now ours
      const id = this.grid.data.getId('2')
      this.grid.scrollTo(id, '2020-11-02')
    },
    getScrollState () {
      this.scrollState = this.grid.getScrollState()
    },
    gridPaint () {
      this.grid.paint()
    },
    gridDestructor () {
      this.grid.destructor()
    },
    renderGrid () {

    },
    resClick (e) {
      console.log(e)
    }
  },
  mounted () {
    window.onresize = () => {
      console.log('resize', window.innerHeight)
      this.windowHeight = window.innerHeight
    }
    this.grid = new GridDHX(this.$refs.grid, {
      columns: [
        { maxWidth: 140, minWidth: 140, id: 'room', align: 'left', header: [{ text: 'Room', align: 'left' }] },
        { width: 80, id: '2020-11-01', align: 'left', header: [{ text: '11-01', align: 'center' }] },
        { width: 80, id: '2020-11-02', header: [{ text: '11-02', align: 'center' }] },
        { width: 80, id: '2020-11-03', align: 'left', header: [{ text: '11-03', align: 'center' }] },
        { width: 80, id: '2020-11-04', align: 'left', header: [{ text: '11-04', align: 'center' }] },
        { width: 80, id: '2020-11-05', align: 'left', header: [{ text: '11-05', align: 'center' }] },
        { width: 80, id: '2020-11-06', align: 'left', header: [{ text: '11-06', align: 'center' }] },
        { width: 80, id: '2020-11-07', align: 'left', header: [{ text: '11-07', align: 'center' }] },
        { width: 80, id: '2020-11-08', align: 'left', header: [{ text: '11-08', align: 'center' }] },
        { width: 80, id: '2020-11-09', align: 'left', header: [{ text: '11-09', align: 'center' }] },
        { width: 80, id: '2020-11-10', align: 'left', header: [{ text: '11-10', align: 'center' }] },
        { width: 80, id: '2020-11-11', align: 'left', header: [{ text: '11-11', align: 'center' }] }
      ],
      spans: [
        { row: '1', column: '2020-11-03', colspan: 4, text: '<div data-space-id="7" data-res-id="345" class="cell__html resActive">Horizon has a very very very very very very very long bit of stuff to look at</div>' },
        { row: '3', column: '2020-11-05', colspan: 2, text: '<div data-space-id="55" data-res-id="123" class="cell__html resActive">Blister</div>' }
      ],
      data: this.dataset,
      htmlEnable: true,
      adjust: false,
      autoWidth: true,
      autoEmptyRow: true,
      rowHeight: 32,
      headerRowHeight: 32,
      sortable: false,
      leftSplit: 1,
      height: this.windowHeight - 180,
      eventHandlers: {
        //  this fires when a cell with class 'cell_html' is clicked
        onclick: {
          cell__html: function (event, data) {
            console.log(data)
            console.log(event)
            console.log(event.originalTarget.dataset)
          }
        }
      }
    })
    //  this fires on empty cells
    this.grid.events.on('CellClick', function (row, column, e) {
      console.log('CellClick')
      console.log('row', row)
      console.log('column', column)
      console.log('e', e)
    })
    this.grid.events.on('scroll', (position) => {
      console.log(position)
      this.scrollPosition.y = position.y
      this.scrollPosition.x = position.x
    })
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
  z-index: 100;
}
.resActive{
  background-color: #ccc;
  padding-left: 2px;
  margin-bottom: 2px;
}
#yearInfo{
  width: 100%;
  height: 32px;
  background-color: #eee;
  color: #121212;
  display: flex;
  justify-content: center;
}
</style>
