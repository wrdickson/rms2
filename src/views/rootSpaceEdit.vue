<template>

    <v-row no-gutters>
      <v-col sm="7">
        <rootSpaceGrid
          v-if="rootSpaces"
          :rootSpaces="rootSpacesPlus"
          @saveNewRootSpace="saveNewRootSpace"
          @deleteRootSpace="deleteRootSpace"
          @updateRootSpace="updateRootSpace"
        />
      </v-col>
      <v-col sm="5">
        <rootSpaceTree
          v-if="rootSpaces"
          :rootSpaces="rootSpacesPlus"
        />
      </v-col>
    </v-row>

</template>

<script>
import api from '../api/api.js'
import rootSpaceGrid from '../components/rootSpaceGrid.vue'
import rootSpaceTree from '../components/rootSpaceTree.vue'
import _ from 'lodash'
export default {
  name: 'rootSpaceEdit',
  components: {
    rootSpaceGrid,
    rootSpaceTree
  },
  created () {
    console.log('rootSpaceEdit created()')
    //  get the data at load
    api.engine.getRootSpaces(this.token).then((response) => {
      this.rootSpaces = response.data.root_spaces
    })
  },
  data: function () {
    return {
      account: this.$store.state.account,
      /*
      *  rootSpaces is a local property in this version
      *  eventually it will have to be in $store
      *  which will complicate the updates . . .
      */
      rootSpaces: null,
      token: this.$store.state.jwt
    }
  },
  computed: {
    //  all children of an item
    childrenObj () {
      var cRootSpaces = JSON.parse(JSON.stringify(this.rootSpaces))
      var codesArray = {}
      _.each(cRootSpaces, (iSpace) => {
        codesArray[iSpace.id] = this.calculateChildren(iSpace.id)
      })
      return codesArray
    },
    //  add columns to root spaces
    rootSpacesPlus () {
      var rootSpacesPlus = JSON.parse(JSON.stringify(this.rootSpaces))
      _.each(rootSpacesPlus, (iSpace) => {
        iSpace.spaceCode = this.spaceCodeObj[iSpace.id]
        iSpace.children = this.childrenObj[iSpace.id]
      })
      return rootSpacesPlus
    },
    //  all children, including the item itself
    spaceCodeObj () {
      var spaceCodeObj = {}
      //  clone the childrenObj . . .
      var c = JSON.parse(JSON.stringify(this.childrenObj))
      _.each(c, (arr, key) => {
        //  add this id
        arr.push(parseInt(key))
        //  sort ascending
        spaceCodeObj[key] = arr.sort(function (a, b) { return a - b })
      })
      return spaceCodeObj
    }
  },
  methods: {
    calculateChildren (spaceId) {
      //  clone it, don't reference it
      var cRootSpaces = JSON.parse(JSON.stringify(this.rootSpaces))
      var spaceCode = []
      _.each(cRootSpaces, (iSpace) => {
        if (iSpace.childOf === spaceId) {
          //  RECURSIVE --->
          var c = this.calculateChildren(iSpace.id)
          spaceCode.push(iSpace.id)
          spaceCode = spaceCode.concat(c)
        }
      })
      return spaceCode
    },
    deleteRootSpace (rootSpaceId) {
      var jwt = this.$store.state.jwt
      api.engine.deleteRootSpace(jwt, rootSpaceId).then((response) => {
        if (response.data.execute === true) {
          this.rootSpaces = response.data.root_spaces
        }
      })
    },
    saveNewRootSpace (newRootSpace) {
      var jwt = this.$store.state.jwt
      api.engine.createRootSpace(jwt, newRootSpace).then((response) => {
        if (response.data.execute > 0) {
          // when this is in $store, this will have to change
          this.rootSpaces = response.data.root_spaces
        }
      })
    },
    updateRootSpace (updateRootSpace) {
      var jwt = this.$store.state.jwt
      api.engine.updateRootSpace(jwt, updateRootSpace).then((response) => {
        if (response.data.execute > 0) {
          // when this is in $store, this will have to change
          this.rootSpaces = response.data.root_spaces
        }
      })
    }
  }
}
</script>

<style>

</style>
