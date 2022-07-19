<template>
  <v-row class="body">
    <v-col class="body-error" cols="12">
      <error-component v-if="error.statusCode === 404" />
      <h1 v-else>
        {{ otherError }}
      </h1>
    </v-col>
  </v-row>
</template>

<script>
import ErrorComponent from '@/components/layout/Error.vue'

export default {
  name: 'EmptyLayout',
  components: {
    ErrorComponent,
  },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 20px;
}
.body {
  &-error {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
}
</style>
