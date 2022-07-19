<template>
  <v-row>
    <v-col cols="12" class="mt-5" align="center">
      <h2><b>XUẤT BÁO CÁO</b></h2>
      <v-divider></v-divider>
    </v-col>
    <v-col cols="12" class="mt-5" align="center">
      <v-card>
        <v-card-title justify-space-around>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Tìm kiếm"
                single-line
                hide-details
              ></v-text-field
            ></v-col>
            <v-col cols="2">
              <v-text-field
                v-model="search"
                label="Năm"
                single-line
                hide-details
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-select
                v-model="search"
                label="Tháng"
                type="number"
                single-line
                hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="files"
          :search="search"
        ></v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Cơ sở y tế',
          align: 'start',
          sortable: true,
          value: 'customer.name',
          divider: true,
        },
        {
          text: 'Năm',
          value: 'customer.idCard',
          divider: true,
          sortable: false,
        },
        {
          text: 'Quý',
          width: '100px',
          value: 'therapyFee',
          divider: true,
          sortable: false,
        },
        {
          text: 'Tháng',
          width: '100px',
          value: 'sale',
          divider: true,
          sortable: false,
        },
        {
          text: 'Lượt khám',
          align: 'center',
          value: 'realFee',
          divider: true,
          sortable: false,
        },
        {
          text: 'CSYT thu',
          align: 'center',
          value: 'realFee',
          divider: true,
          sortable: false,
        },
        {
          text: 'CSYT chi',
          align: 'center',
          value: 'status',
          divider: true,
          sortable: false,
        },
        {
          text: 'File',
          align: 'center',
          value: 'status',
          divider: true,
          sortable: false,
        },
      ],
      valid: true,
    }
  },

  methods: {
    createFile() {
      window.open(`http://localhost:8080/statis/file`)
    },
  },
}
</script>
