<template>
  <v-container>
    <v-row>
      <h3>Res-View</h3>
    </v-row>
    <v-row>
      <resTable/>
    </v-row>
  </v-container>
</template>

<script>
import resTable from '../components/resTable.vue'
export default {
  name: 'Res-View',
  components: {
    resTable
  },
  props: [],
  data: () => {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
