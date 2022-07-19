<template>
  <v-row>
    <v-col cols="12">
      <account-component-vue />
    </v-col>
  </v-row>
</template>

<script>
import AccountComponentVue from '../components/AccountComponent.vue'
export default {
  name: 'AccountPage',
  components: {
    AccountComponentVue,
  },
  middleware: 'auth-admin',
  data() {
    return {}
  },

  computed: {},

  beforeCreate() {},
}
</script>

<style lang="scss" scoped></style>
