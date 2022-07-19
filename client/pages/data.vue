<template>
  <v-row>
    <v-col cols="12">
      <v-tabs v-model="tab" fixed-tabs dark>
        <v-tab> THỐNG KÊ THÁNG </v-tab>
        <v-tab> THỐNG KÊ QUÝ </v-tab>
        <!-- <v-tab> THỐNG KÊ NĂM </v-tab> -->
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <statis-month-component-vue />
        </v-tab-item>
        <v-tab-item>
          <statis-quarter-component-vue />
        </v-tab-item>
        <!-- <v-tab-item>
          <statis-year-component-vue />
        </v-tab-item> -->
      </v-tabs-items>
    </v-col>
    <!-- amination -->
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-snackbar v-model="snackbarSuccess" color="success" outlined>
      Thao tác thành công!
      <template #action="{ attrs }">
        <v-btn
          color="gray"
          text
          v-bind="attrs"
          @click="snackbarSuccess = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarFail" color="error" outlined>
      {{ error }}
      <template #action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click=";(snackbarFail = false), (error = '')"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
import StatisMonthComponentVue from '../components/StatisMonthComponent.vue'
import StatisQuarterComponentVue from '../components/StatisQuarterComponent.vue'
// import StatisYearComponentVue from '../components/StatisYearComponent.vue'
export default {
  name: 'DataPage',
  components: {
    StatisMonthComponentVue,
    StatisQuarterComponentVue,
    // StatisYearComponentVue,
  },
  data() {
    return {
      // amination
      dialog: false,
      loading: false,
      error: '',
      snackbarFail: false,
      snackbarSuccess: false,

      tab: 0,
    }
  },

  computed: {},

  watch: {},

  beforeCreate() {},

  methods: {},
}
</script>
