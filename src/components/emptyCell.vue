<template>
  <span>
      <v-btn @click="btnClickedHandler()">Click me!</v-btn>
  </span>
</template>

<script>
export default {
  methods: {
    btnClickedHandler () {
      console.log('clicked')
    }
  }
}
</script>
