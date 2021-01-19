<template>
  <v-app>
    <MainNav />
    <v-main id="main">
      <router-view />
    </v-main>
  </v-app>
</template>
<script>

import api from './api/api.js'
import _ from 'lodash'
import MainNav from './components/mainNav.vue'
export default {
  name: 'App',
  components: {
    MainNav
  },
  created () {
    //  set theme to dark
    this.$vuetify.theme.dark = true

    //  check for a user in localstorage
    //  validate account & jwt????
    const account = JSON.parse(localStorage.getItem('account'))
    const jwt = localStorage.getItem('jwt')
    if (account && jwt) {
      //  load the user to vuex and localstorage
      this.$store.commit('setAccount', account)
      this.$store.commit('setJwt', jwt)
    } else {
      this.$store.commit('setAccountToGuest')
      this.$store.commit('setJwt', '')
    }

    //  load initial data
    //  TODO as is, these are not async in the api.  fix.
    const self = this
    api.engine.getSpaces().then(function (response) {
      //  don't know why api returns an object here . .  look at it!!!!
      //  array array array . . . yet we get an object, muthafer!!
      //  lodash to the rescue
      console.log('space response', response.data)
      /* i don't know why i have to do this
      *  i tried to ORDER BY in the sql . . but it doesn't fucking work
      *  i guess there's nothing wrong with ordering it (again)
      */
      var dataOrdered = _.orderBy(response.data.spaces, 'show_order')
      self.$store.commit('setSpaces', _.values(dataOrdered))
    })
    api.engine.getSpaceTypes().then(function (response) {
      self.$store.commit('setSpaceTypes', response.data.space_types)
    })
    api.engine.getSelectGroups().then(function (response) {
      self.$store.commit('setSelectGroups', response.data.selectGroups)
    })
    api.engine.getReservations().then(function (response) {
      self.$store.commit('setReservations', response.data)
    })
  }
}
</script>

<style lang="sass">
  @import '../node_modules/typeface-roboto/index.css'
</style>
