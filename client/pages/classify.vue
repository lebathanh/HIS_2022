<template>
  <v-row>
    <v-col cols="12">
      <v-tabs v-model="tab" fixed-tabs dark>
        <v-tab> NƠI SINH SỐNG </v-tab>
        <v-tab> ĐỐI TƯỢNG </v-tab>
        <v-tab> MỨC HƯỞNG </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item> <place-component-vue /> </v-tab-item>
        <v-tab-item> <object-component-vue /> </v-tab-item>
        <v-tab-item> <benefit-rate-component-vue /> </v-tab-item>
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
import PlaceComponentVue from '../components/PlaceComponent.vue'
import ObjectComponentVue from '../components/ObjectComponent'
import BenefitRateComponentVue from '../components/BenefitRateComponent.vue'
export default {
  name: 'ClassifyPage',
  components: {
    PlaceComponentVue,
    ObjectComponentVue,
    BenefitRateComponentVue,
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
