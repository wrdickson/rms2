<template>
  <div id='wTreeContainer' class="mContainer"></div>
</template>

<script>
import * as webix from 'webix'
import 'webix/webix.min.css'
export default {
  name: 'WTreetable',
  data: function () {
    return {
      columns: [
        { id: 'country', header: 'Country', width: 100 },
        { id: 'title', header: 'Title', width: 200 },
        { id: 'year', header: 'Year', width: 80 },
        { id: 'votes', header: 'Votes', width: 100 },
        { id: 'rating', header: 'Rating', width: 100 }
      ],
      wData: {
        data: [
          { id: 12, country: 'Moab', title: 'The Shawshank Redemption' },
          { id: 'foo', title: 'Cornholio' },
          { id: 'bar', title: 'Barholio' }
        ],
        spans: [
          [12, 'title', 3, 1],
          ['foo', 'title', 3, 1]
        ]
      },
      grid: null
    }
  },
  methods: {
    render () {
      this.grid = webix.ui({
        view: 'datatable',
        container: 'wTreeContainer',
        columns: this.columns,
        spans: true,
        select: 'cell',
        data: this.wData
      })
      console.log('this.grid', this.grid)
    }
  },
  created () {
    console.log('webix', webix)
  },
  mounted () {
    this.render()
  }
}
</script>

<style>
.mContainer {
  width: 600px;
  height: 400px;
}
.highlight{
  background-color:#edf4f9;
  font-weight:bold;
}
</style>
