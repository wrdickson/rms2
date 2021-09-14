<template v-slot:cell(id)="data">
  <div>
    <router-link :to="`https://twitter.com/all/status/${data.value}`">{{ data.value }}
    </router-link>
    <v-container>
      <v-row>
        <v-col>
        </v-col>
      </v-row>
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
  </div>
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
  data: function () {
    return {
      data: {
        value: '123456'
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
