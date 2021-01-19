<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      :clipped="false"
      mobile-breakpoint="960"
      width="180"
      @transitionend="transitionEnd"
    >
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>fa-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="account.id < 1"
          to="/login"
        >
          <v-list-item-action>
            <v-icon>fa-sign-in</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/ag-grid"
        >
          <v-list-item-action>
            <v-icon>fa-calendar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Ag-Grid</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="account.id > 0"
          to="/logoff"
        >
          <v-list-item-action>
            <v-icon>fa-sign-out</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logoff</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="account.id > 0"
          to="/res-view"
        >
          <v-list-item-action>
            <v-icon>fa-calendar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Reservation View</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="account.id > 0"
          to="/dhtmlx"
        >
          <v-list-item-action>
            <v-icon>fa-calendar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>dhtmlx</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="account.id > 0"
          to="/resview"
        >
          <v-list-item-action>
            <v-icon>fa-calendar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>ResView</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="account.id > 0"
          to="/rootspaceedit"
        >
          <v-list-item-action>
            <v-icon>fa-calendar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>root space edit</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="#363636"
      dark
      dense
      flat
      hide-on-scroll
    >
      <v-app-bar-nav-icon @click.stop="navIconClick"></v-app-bar-nav-icon>
      <v-toolbar-title>TrekBill.com</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'MainNav',
  components: {
  },
  data: () => {
    return {
      drawer: null
    }
  },
  computed: {
    showAppBar () {
      return this.$store.state.showAppBar
    },
    account: {
      get: function () { return this.$store.state.account }
    },
    jwt: function () { return this.$store.state.jwt }
  },
  methods: {
    navIconClick () {
      this.drawer = !this.drawer
    },
    transitionEnd () {
      console.log('drawer transitionend')
    }
  }
}
</script>

<style scoped>
  .v-navigation-drawer{
    z-index: 1200;
  }
</style>
