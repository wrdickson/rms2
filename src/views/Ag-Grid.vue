<template>
  <div id="agWrapper">
    <div>
      <v-btn @click="addReservation">Add Reservation</v-btn>
    </div>
    <ag-grid-vue
        id="resGrid"
        :style="agStyle"
        class="ag-theme-balham-dark"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :trigger="trigger"
        :cellClicked="cellClicked"
        suppressRowTransform="true"
        >
    </ag-grid-vue>
  </div>
</template>

<script>
//  eslint-disable-next-line
import _ from 'lodash'
import moment from 'moment'
//  eslint-disable-next-line
import BtnCellRenderer from '../components/btn-cell-renderer.js'
//  eslint-disable-next-line
import api from '../api/api.js'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css'
import { AgGridVue } from 'ag-grid-vue'
export default {
  name: 'App',
  data () {
    return {
      columnDefs: null,
      mainDivHeight: null,
      reservations: null,
      rowData: null,
      spaces: null,
      trigger: 1
    }
  },
  computed: {
    agStyle () {
      const s = 'width: 100%; height: ' + (this.mainDivHeight - 85) + 'px;'
      return s
    },
    resDateArr () {
      const a = {}
      _.each(this.reservations, (reservation) => {
        if (a[reservation.startDate]) {
          a[reservation.startDate].push(reservation)
        } else {
          a[reservation.startDate] = []
          a[reservation.startDate].push(reservation)
        }
      })
      return a
    }
  },
  components: {
    AgGridVue
  },
  beforeMount () {
    api.engine.getSpaces().then((result) => {
      this.spaces = result.data.spaces
      this.rowData = []
      _.each(this.spaces, (space) => {
        const iSpace = {}
        iSpace.room = space.space_id
        this.rowData.push(iSpace)
      })
    })
    this.columnDefs = [
      {
        headerName: 'Room',
        field: 'room',
        width: 190,
        pinned: 'left',
        cellRenderer: (params) => {
          console.log('params ', params)
          const eGui = document.createElement('div')
          //  eGui.innerHTML = '<span class="gButton">' + params.data.room + '</span>'
          const s = _.find(this.spaces, function (o) {
            if (o.space_id.toString() === params.data.room.toString()) {
              return true
            }
          })
          console.log('s', s)
          eGui.innerHTML = s.description
          eGui.addEventListener('click', function () { console.log(params) })
          return eGui
        }
      },
      {
        headerName: '',
        field: 'foo',
        width: 0,
        pinned: 'left',
        cellRenderer: function (params) {
          const fooDiv = document.createElement('div')
          fooDiv.innerHTML = '>'
          fooDiv.addEventListener('click', function () {
            console.log('fooClick', params.data.room)
          })
          return fooDiv
        }
      }
    ]
    const d = moment('2020-10-25')
    for (let i = 0; i < 32; i++) {
      const iCol = {
        headerName: d.format('YYYY-MM-DD'),
        field: d.format('YYYY-MM-DD'),
        width: 90,
        cellStyle: { border: '1px solid #444' },
        colSpan: (params) => {
          let duration = 1
          const res = _.filter(this.reservations, function (o) {
            return o.startDate === params.colDef.headerName
          })
          if (res.length > 0) {
            _.each(res, (reservation) => {
              if (params.data.room.toString() === reservation.spaceId.toString()) {
                duration = parseInt(reservation.duration)
              }
            })
          }
          return duration
        },
        cellRenderer: (params) => {
          const e = document.createElement('div')
          const res = _.filter(this.reservations, function (o) {
            return o.startDate === params.colDef.headerName
          })
          if (res) {
            //  console.log('res: ', res)
            _.each(res, (reservation) => {
              //  console.log(params.data.room, reservation.spaceId)
              if (params.colDef.field === reservation.startDate && reservation.spaceId.toString() === params.data.room.toString()) {
                //  console.log('got', params)
                e.classList.add('activeRes')
                e.innerHTML = reservation.customer
                e.addEventListener('click', function () {
                  console.log(reservation)
                })
              } else {
                e.innerHTML = 'wha'
                e.addEventListener('click', function () {
                  console.log('click')
                })
              }
            })
          }
          if (res.length === 0) {
            //  console.log('no res', params)
            e.innerHTML = '&nbsp'
            e.addEventListener('click', function (p) {
              console.log('click', p)
            })
          }
          return e
        }
      }
      this.columnDefs.push(iCol)
      d.add(1, 'days')
    }

    this.reservations = [
      { id: '1', customer: 'Horton', startDate: '2020-10-27', endDate: '2020-10-29', duration: '2', spaceId: '1' },
      { id: '2', customer: 'Janice', startDate: '2020-10-28', endDate: '2020-10-30', duration: '3', spaceId: '2' },
      { id: '3', customer: 'Beatrice', startDate: '2020-10-29', endDate: '2020-11-04', duration: '5', spaceId: '3' },
      { id: '4', customer: 'June', startDate: '2020-10-30', endDate: '2020-11-04', duration: '5', spaceId: '1' },
      { id: '5', customer: 'Irwin', startDate: '2020-10-29', endDate: '2020-11-03', duration: '4', spaceId: '4' }
    ]
  },
  methods: {
    addReservation () {
      const n = {
        id: '6',
        customer: 'Angelica',
        startDate: '2020-10-27',
        endDate: '2020-10-28',
        duration: '1',
        spaceId: '5'
      }
      this.reservations.push(n)
      this.trigger += 1
      const resGrid = document.querySelector('#resGrid')
      console.log(resGrid)
      resGrid.api.refreshView()
    },
    cellClicked (params) {
      console.log(params)
    }
  },
  mounted () {
    const h = window.innerHeight
    this.mainDivHeight = h
    window.onresize = () => {
      this.mainDivHeight = document.getElementById('main').offsetHeight
    }
  }
}
</script>

<style>

.activeRes {
  padding-left: 4px;
  color: rgb(51, 41, 199);
  background-color: rgb(207, 207, 207);
  border-radius: 4px;
  max-height: 24px;
}

.gButton {
  background-color: #4CAF50; /* Green */
  border: none;
  color:rgb(88, 65, 214);
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 100%;
}

</style>
