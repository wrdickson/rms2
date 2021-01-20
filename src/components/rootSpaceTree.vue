<template>
  <div>
    <div
      id="tree"
      ref="tree"
      class="dhx-container--tree"
      style="width: 100%; height: 500px; background-color: #fff;"
    ></div>
  </div>
</template>

<script>
import 'dhx-suite/codebase/suite.min.css'
import { Tree as TreeDHX } from 'dhx-suite'
import _ from 'lodash'
export default {
  name: 'rootSpaceTree',
  props: {
    rootSpaces: Array
  },
  data: () => {
    return {
    }
  },
  computed: {
    cRootSpaces () {
      return JSON.parse(JSON.stringify(this.rootSpaces))
    },
    treeData () {
      // temp
      //  generate json from rootSpaces
      const treeJson = []
      //  use a clone
      _.each(this.cRootSpaces, (iRootSpace) => {
        //  start with the root spaces ie childOf = 0
        if (iRootSpace.childOf === 0) {
          //  generat the root nodes
          var iNode = {
            id: iRootSpace.id,
            value: iRootSpace.title,
            opened: iRootSpace.showChildren,
            items: this.getChildrenArray(iRootSpace.id)
          }
          treeJson.push(iNode)
        }
      })
      return treeJson
    }
  },
  methods: {
    getChildrenArray (spaceId) {
      var childrenArray = []
      _.each(this.cRootSpaces, (iSpace) => {
        if (iSpace.childOf === spaceId) {
          //  RECURSIVE --->
          console.log('hit', iSpace)
          var iChildObj = {
            id: iSpace.id,
            value: iSpace.title + ' [Id:' + iSpace.id + ' CO:' + iSpace.childOf + ' DO:' + iSpace.displayOrder + ' SC:' + iSpace.showChildren + ']',
            opened: iSpace.showChildren,
            items: this.getChildrenArray(iSpace.id)
          }
          childrenArray.push(iChildObj)
        }
      })
      return childrenArray
    },
    renderTree () {
      console.log('renderTree() fires . . .', this.treeData)
      //  destroy the tree if it exists
      if (this.tree) {
        this.tree.destructor()
      }
      this.tree = new TreeDHX(this.$refs.tree, {
        data: this.treeData
      })
    }
  },
  mounted () {
    console.log('this.rootSpaces @ mounted()', this.rootSpaces)
    this.renderTree()
  },
  watch: {
    rootSpaces: function (val) {
      console.log('rootSpaces change @ tree')
      this.renderTree()
    }
  },
  beforeUnmount () {
    if (this.tree) {
      this.tree.destructor()
    }
  }
}
</script>

<style>

</style>
