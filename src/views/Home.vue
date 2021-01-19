<template>
  <v-container fluid>
    <h1>Home</h1>
    <v-btn class="mb-1" color="success" @click="testToken">Test Token</v-btn><br/>
    <v-btn color="warning" @click="ruinToken">Ruin Token</v-btn>
  </v-container>
</template>

<script>
import api from './../api/api.js'
export default {
  components: {
  },
  computed: {
    account: {
      get: function () { return this.$store.state.account }
    },
    jwt: function () { return this.$store.state.jwt }
  },
  methods: {
    ruinToken () {
      //  debug, ruin the token
      this.$store.commit('setJwt', this.jwt + 'a')
    },
    testToken () {
      api.account.testToken(this.jwt).then((response) => {
        console.log(response.data)
      })
    }
  }
}
</script>
