<template>
  <div>
    <v-row
      justify="center"
    >
      <v-col
        md="4"
        sm="6"
        xs="9"
      >
        <v-card>
          <form id="login-form">
            <v-card-title primary-title>
               Login
            </v-card-title>
            <v-card-subtitle>
              <span class="info1">{{ loginResponse }}</span>
            </v-card-subtitle>
              <v-card-text>
              <v-text-field
                v-model="username1"
                label="Username"
                autocomplete="username"
              />
              <br>
              <v-text-field
                v-model="password1"
                label="Password"
                type="password"
                autocomplete="current-password"
              />
              <br>
            </v-card-text>
            <v-card-actions>
              <v-btn
                ripple
                color="success"
                @click="loginCheck"
              >
                Login
              </v-btn>
            </v-card-actions>
          </form>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xs="9" sm="6" md="4">
        <v-sheet
          rounded
          elevation="4"
          class="pa-2"
        >
          <v-card-title primary-title>Current Account:</v-card-title>
          <div><b>id: </b>{{ accountId }}</div>
          <div><b>username: </b>{{ username }}</div>
          <div><b>jwt:: </b>{{ jwtShort }}</div>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import api from './../api/api.js'
export default {
  name: 'Login',
  components: {
  },
  data: function () {
    return {
      loginResponse: '',
      username1: '',
      password1: ''
    }
  },
  computed: {
    accountId: function () { return this.$store.state.account.id },
    jwt: function () { return this.$store.state.jwt },
    jwtShort: function () { return this.jwt.substring(0, 12) + '. . .' },
    username: function () { return this.$store.state.account.username }
  },
  methods: {
    loginCheck () {
      api.account.login(this.username1, this.password1).then((response) => {
        //  clear the input variables
        this.loginResponse = ''
        this.username1 = ''
        this.password1 = ''
        //  how did login go?
        if (response.data.pass === true &&
          Number.isInteger(parseInt(response.data.account.id))) {
          //  show the user if the login succeeded
          this.loginResponse = 'Login Succeeded'
          //  load the user to vuex and localstorage
          this.$store.commit('setAccount', response.data.account)
          this.$store.commit('setJwt', response.data.jwt)
        } else {
          //  show user the login has failed
          this.loginResponse = 'Login Failed'
          //  load Guest dummy user to vuex and localstorage
          this.$store.commit('setAccountToGuest')
          this.$store.commit('setJwt', '')
        }
      })
    }
  }
}
</script>

<style>
  .info1{
    color: rgb(15, 119, 29);
  }
</style>
