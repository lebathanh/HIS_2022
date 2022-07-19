<template>
  <v-row>
    <v-col cols="12" class="mt-5" align="center">
      <h2><b>THỐNG KÊ KHÁM CHỮA BỆNH TẠI CƠ SỞ Y TẾ</b></h2>
      <v-divider></v-divider>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          THỐNG KÊ THEO THÁNG(KỲ) TRONG NĂM
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search_"
            append-icon="mdi-magnify"
            label="Tìm kiếm"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers_"
          :items="statis"
          :search="search_"
          @click:row="clickRow"
        >
          <template #[`item.repPRFunds`]="{ item }">
            {{
              item.pPRFunds.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })
            }}
          </template>
          <template #[`item.redIPFunds`]="{ item }">
            {{
              item.dIPFunds.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })
            }}
          </template>
          <template #[`item.reusedFunds`]="{ item }">
            {{
              item.usedFunds.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })
            }}
          </template>
          <template #[`item.renextFunds`]="{ item }">
            {{
              item.nextFunds.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })
            }}
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- form -->
        <v-container>
          <v-row>
            <v-col cols="4">
              <v-autocomplete
                v-model="formData.fmF"
                :items="medicalFs"
                :rules="[requireRules]"
                item-value="_id"
                item-text="name"
                label="Cơ sở y tế"
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="formData.fyear"
                :rules="[requireRules]"
                label="Năm"
                type="number"
                min="2010"
                :max="new Date().getFullYear()"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-select
                v-model="formData.fmonth"
                :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
                :rules="[requireRules]"
                label="Tháng (Kỳ)"
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="formData.fcollect"
                :rules="[requireRules]"
                label="CSYT Thu"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="formData.fspend"
                :rules="[requireRules]"
                label="CSYT Chi"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="formData.fpPRFunds"
                :rules="[requireRules]"
                label="Kinh phí dư kỳ trước"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="formData.fdIPFunds"
                :rules="[requireRules]"
                label="Kinh phí cấp trong kỳ"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="formData.fusedFunds"
                :rules="[requireRules]"
                label="Kinh phí sử dụng trong kỳ"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="formData.fnextFunds"
                :rules="[requireRules]"
                label="Kinh phí phát kỳ sau"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-col>
    <v-col cols="6">
      <v-card>
        <v-card-title>
          KHÁM CHỮA BỆNH TRONG KỲ
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Tìm kiếm"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="getTherapies" :search="search">
          <template #[`item.reTime`]="{ item }">
            {{ new Date(item.time).toISOString().substring(0, 10) }}
          </template>
          <template #[`item.sale`]="{ item }">
            {{ castVND(item.therapyFee - item.realFee) }}
          </template>
          <template #[`item.therapyFee_custom`]="{ item }">
            {{ castVND(item.therapyFee) }}
          </template>
          <template #[`item.realFee_custom`]="{ item }">
            {{ castVND(item.realFee) }}
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <!-- btn -->
    <v-col cols="12" class="mb-5" align="center">
      <v-btn :disabled="!valid" @click="reset">Hủy</v-btn>
      <v-btn :disabled="!valid" color="primary" @click="addStatis"
        >Xác nhận thống kê</v-btn
      >
      <v-btn
        v-if="selectStatis"
        :disabled="!valid"
        color="warning"
        @click="editStatis"
        >Sửa</v-btn
      >
      <v-btn
        v-if="selectStatis"
        :disabled="!valid"
        color="success"
        @click="createFile"
        >Xuất file</v-btn
      >
      <v-btn
        v-if="selectStatis"
        :disabled="!valid"
        color="error"
        @click="dialog = true"
        >Xóa</v-btn
      >
    </v-col>

    <!-- delete dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Xóa thống kê </v-card-title>
        <v-card-text>
          Dữ liệu thống kê sẽ bị xóa vĩnh viễn. Bạn thật sự muốn xóa?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelDialog">
            Trở lại
          </v-btn>
          <v-btn color="error" text @click="delSatis"> Xóa </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
export default {
  data() {
    return {
      // amination
      loading: false,
      error: '',
      snackbarFail: false,
      snackbarSuccess: false,
      requireRules: (v) => !!v || v === 0 || 'Không được bỏ trống ô này',

      // data
      therapies: [],
      medicalFs: [],
      statis: [],
      selectStatis: null,
      dialog: false,

      // statis
      valid: true,
      search: '',
      search_: '',
      formData: {
        fmF: '',
        fyear: '',
        fmonth: '',
        fcollect: '',
        fspend: '',
        fpPRFunds: '',
        fdIPFunds: '',
        fusedFunds: '',
        fnextFunds: '',
      },
      headers: [
        {
          text: 'Khách hàng',
          align: 'start',
          sortable: true,
          value: 'customer.name',
          divider: true,
          width: '200px',
        },
        { text: 'Thời gian', value: 'reTime', divider: true, sortable: false },
        {
          text: 'CMND',
          value: 'customer.idCard',
          divider: true,
          sortable: false,
        },
        {
          text: 'Chi phí',
          width: '100px',
          value: 'therapyFee_custom',
          divider: true,
          sortable: false,
        },
        {
          text: 'Miễn giảm',
          width: '100px',
          value: 'sale',
          divider: true,
          sortable: false,
        },
        {
          text: 'CSYT thu',
          align: 'center',
          value: 'realFee_custom',
          divider: true,
          sortable: false,
        },
      ],
      headers_: [
        {
          text: 'Tên cơ sở',
          align: 'start',
          sortable: true,
          value: 'medicalF.name',
          divider: true,
        },
        { text: 'Năm', value: 'year', divider: true, sortable: false },
        { text: 'Kỳ', value: 'month', divider: true, sortable: false },
        {
          text: 'KP dư kỳ trước',
          value: 'repPRFunds',
          divider: true,
          sortable: false,
        },
        {
          text: 'KP cấp trong kỳ',
          align: 'center',
          value: 'redIPFunds',
          divider: true,
          sortable: false,
        },
        {
          text: 'KP SD trong kỳ',
          align: 'center',
          value: 'reusedFunds',
          divider: true,
          sortable: false,
        },
        {
          text: 'KP phát kỳ sau',
          align: 'center',
          value: 'renextFunds',
          divider: true,
          sortable: false,
        },
        {
          text: 'Trạng thái',
          align: 'center',
          value: 'status',
          divider: true,
          sortable: false,
        },
      ],
    }
  },

  computed: {
    getTherapies(ctx) {
      const t = ctx.therapies.filter((t) => t.medicalF._id === ctx.formData.fmF)
      return t.filter(
        (f) =>
          new Date(f.time).getMonth() + 1 === parseInt(ctx.formData.fmonth) &&
          new Date(f.time).getFullYear() === parseInt(ctx.formData.fyear)
      )
    },
  },

  watch: {
    getTherapies(newVal, oldVal) {
      const fee = newVal.map((t) => t.realFee).reduce((a, b) => a + b, 0)
      const realFee = newVal.map((t) => t.therapyFee).reduce((a, b) => a + b, 0)
      this.formData.fcollect = fee.toFixed()
      this.formData.fspend = realFee
      this.formData.fusedFunds = realFee - fee
    },
  },

  beforeCreate() {
    this.$axios.get('/therapy/getall').then((respone) => {
      try {
        this.therapies = respone.data.elements.Therapies
      } catch (error) {
        this.therapies = []
      }
    })

    this.$axios.get('/mfs/getall').then((respone) => {
      try {
        this.medicalFs = respone.data.elements.MedicalFs
      } catch (error) {
        this.medicalFs = []
      }
    })

    this.$axios.get('/statis/getall').then((respone) => {
      try {
        this.statis = respone.data.elements.Statises
      } catch (error) {
        this.statis = []
      }
    })
  },

  methods: {
    castVND(data) {
      return parseFloat(data).toLocaleString('it-IT', {
        style: 'currency',
        currency: 'VND',
      })
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fmF = ''
      this.formData.fyear = ''
      this.formData.fmonth = ''
      this.formData.fcollect = ''
      this.formData.fspend = ''
      this.formData.fpPRFunds = ''
      this.formData.fdIPFunds = ''
      this.formData.fusedFunds = ''
      this.formData.fnextFunds = ''
      this.selectStatis = null
    },
    refreshData() {
      this.$axios.get('/therapy/getall').then((respone) => {
        try {
          this.therapies = respone.data.elements.Therapies
        } catch (error) {
          this.therapies = []
        }
      })

      this.$axios.get('/statis/getall').then((respone) => {
        try {
          this.statis = respone.data.elements.Statises
        } catch (error) {
          this.statis = []
        }
      })
    },
    clickRow(data) {
      this.selectStatis = data
      this.formData.fmF = data.medicalF._id
      this.formData.fyear = data.year
      this.formData.fmonth = data.month
      this.formData.fcollect = data.medicalFCollect
      this.formData.fspend = data.medicalFSpend
      this.formData.fpPRFunds = data.pPRFunds
      this.formData.fdIPFunds = data.dIPFunds
      this.formData.fusedFunds = data.usedFunds
      this.formData.fnextFunds = data.nextFunds
    },
    async addStatis(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          medicalF: this.formData.fmF,
          month: this.formData.fmonth,
          year: this.formData.fyear,
          therapies: this.getTherapies.map((t) => t._id),
          medicalS: [],
          medicalFCollect: this.formData.fcollect,
          medicalFSpend: this.formData.fspend,
          pPRFunds: this.formData.fpPRFunds,
          dIPFunds: this.formData.fdIPFunds,
          usedFunds: this.formData.fusedFunds,
          nextFunds: this.formData.fnextFunds,
          status: false,
        }
        const result = await this.$axios.$post('/statis/add', data)
        switch (result.status) {
          case 'OK':
            this.reset()
            this.refreshData()
            this.loading = false
            this.snackbarSuccess = true
            break
          case 404:
            this.loading = false
            this.error = 'Bad request'
            this.snackbarFail = true
            break
          case 409:
            this.loading = false
            this.error = 'Trùng lặp'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi server'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async editStatis(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          _id: this.selectStatis._id,
          medicalF: this.formData.fmF,
          month: this.formData.fmonth,
          year: this.formData.fyear,
          therapies: this.getTherapies.map((t) => t._id),
          medicalS: [],
          medicalFCollect: this.formData.fcollect,
          medicalFSpend: this.formData.fspend,
          pPRFunds: this.formData.fpPRFunds,
          dIPFunds: this.formData.fdIPFunds,
          usedFunds: this.formData.fusedFunds,
          nextFunds: this.formData.fnextFunds,
          status: false,
        }
        const result = await this.$axios.$patch('/statis/edit', data)
        switch (result.status) {
          case 'OK':
            this.reset()
            this.refreshData()
            this.loading = false
            this.snackbarSuccess = true
            break
          case 404:
            this.loading = false
            this.error = 'Bad request'
            this.snackbarFail = true
            break
          case 409:
            this.loading = false
            this.error = 'Trùng lặp'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi server'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async delSatis() {
      try {
        this.loading = true
        const result = await this.$axios.$delete(
          `/statis/delete?_id=${this.selectStatis._id}`,
          {}
        )
        if (result.status === 'OK') {
          this.loading = false
          this.snackbarSuccess = true
          this.reset()
          this.refreshData()
          this.dialog = false
        } else {
          switch (result.status) {
            case 400:
              this.error = 'BadRequest'
              this.loading = false
              this.snackbarFail = true
              break
            default:
              this.error = 'Lỗi không xác định'
              this.loading = false
              this.snackbarFail = true
          }
        }
      } catch (error) {
        this.error = 'Lỗi Server'
        this.loading = false
        this.snackbarFail = true
      }
    },
    closeDelDialog() {
      this.dialog = false
    },
    createFile() {
      window.open(
        `http://localhost:8080/statis/file?_id=${this.selectStatis._id}`
      )
    },
  },
}
</script>
