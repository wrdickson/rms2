<template>
  <v-container>
    <v-row justify="center">
      <v-col
        md="4"
        sm="6"
        xs="9"
      >
        <v-btn
          color="warning"
          @click="logoff"
        >
          Logoff
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Logoff',
  computed: {
    account: {
      get: function () {
        return this.$store.state.account
      }
    }
  },
  methods: {
    logoff () {
      this.$store.commit('setAccountToGuest')
      this.$store.commit('setJwt', '')
    }
  }
}
</script>

<style scoped>

</style>
