<template>
  <v-row>
    <v-col cols="12" class="mt-5" align="center">
      <h2><b>QUYẾT TOÁN CHI PHÍ BỆNH NHÂN KHÁM CHỬA BỆNH TẠI CƠ SỞ Y TẾ</b></h2>
      <v-divider></v-divider>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          THỐNG KÊ THEO QUÝ TRONG NĂM
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
          :items="settles"
          :search="search_"
          height="150px"
          @click:row="clickRow"
        >
          <template #[`item.quarterSum`]="{ item }">
            {{ item.statisticals.length }}
          </template>
          <template #[`item.reUse`]="{ item }">
            {{
              item.statisticals
                .map((t) => t.usedFunds)
                .reduce((a, b) => a + b, 0)
            }}
          </template>
          <template #[`item.reSpend`]="{ item }">
            {{
              item.statisticals
                .map((t) => t.dIPFunds)
                .reduce((a, b) => a + b, 0)
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
              <v-select
                v-model="formData.fmF"
                :items="medicalFs"
                :rules="[requireRules]"
                item-value="_id"
                item-text="name"
                label="Cơ sở y tế"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="formData.fyear"
                label="Năm"
                type="number"
                min="2010"
                :max="new Date().getFullYear()"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-select
                v-model="formData.fquarter"
                :items="[1, 2, 3, 4]"
                :rules="[requireRules]"
                label="Quý"
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="formData.fspend"
                :rules="[requireRules]"
                label="Kinh phí đã cấp"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="formData.fuse"
                :rules="[requireRules]"
                label="CSYT dùng"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-col>
    <v-col cols="6">
      <v-card>
        <v-card-title>
          CÁC KỲ TRONG QUÝ
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Tìm kiếm"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="getStatises" :search="search">
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
    <!-- btn -->
    <v-col cols="12" class="mb-5" align="center">
      <v-btn @click="reset">Hủy</v-btn>
      <v-btn :disabled="!valid" color="primary" @click="addSettle"
        >Xác nhận thống kê</v-btn
      >

      <!-- edit -->

      <v-btn
        v-if="selectSettle"
        :disabled="!valid"
        color="warning"
        @click="editSettle"
        >Sửa</v-btn
      >
      <v-btn
        v-if="selectSettle"
        :disabled="!valid"
        color="error"
        @click="dialog = true"
        >Xóa</v-btn
      >
    </v-col>

    <!-- delete dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Xóa quyết toán </v-card-title>
        <v-card-text>
          Dữ liệu quyết toán sẽ bị xóa vĩnh viễn. Bạn thật sự muốn xóa?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelDialog">
            Trở lại
          </v-btn>
          <v-btn color="error" text @click="delSettle"> Xóa </v-btn>
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
      settles: [],
      selectSettle: null,
      dialog: false,

      // setle
      valid: true,
      search: '',
      search_: '',
      headers_: [
        {
          text: 'Tên cơ sơ',
          align: 'start',
          sortable: true,
          value: 'medicalF.name',
          divider: true,
          width: '200px',
        },
        { text: 'Quý', value: 'quarter', divider: true, sortable: false },
        { text: 'Năm', value: 'year', divider: true, sortable: false },
        { text: 'Số kỳ', value: 'quarterSum', divider: true, sortable: false },
        {
          text: 'Tổng KP SD',
          align: 'center',
          value: 'reUse',
          divider: true,
          sortable: false,
        },
        {
          text: 'Tổng KP đã phát',
          align: 'center',
          value: 'reSpend',
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
      headers: [
        {
          text: 'Tên cơ sở',
          align: 'start',
          sortable: true,
          value: 'medicalF.name',
          divider: true,
        },
        { text: 'Kỳ', value: 'month', divider: true, sortable: false },
        { text: 'Năm', value: 'year', divider: true, sortable: false },
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
      formData: {
        fmF: '',
        fquarter: '',
        fyear: '',
        fuse: '',
        fspend: '',
      },
    }
  },

  computed: {
    getStatises(ctx) {
      const t = ctx.statis.filter((t) => t.medicalF._id === ctx.formData.fmF)
      return t.filter(
        (f) =>
          ctx.getQuater(ctx.formData.fquarter).includes(f.month) &&
          f.year === parseInt(ctx.formData.fyear)
      )
    },
  },

  watch: {
    getStatises(newVal, oldVal) {
      this.formData.fspend = newVal
        .map((t) => t.dIPFunds)
        .reduce((a, b) => a + b, 0)
      this.formData.fuse = newVal
        .map((t) => t.usedFunds)
        .reduce((a, b) => a + b, 0)
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

    this.$axios.get('/settlement/getall').then((respone) => {
      try {
        this.settles = respone.data.elements.Settles
      } catch (error) {
        this.settles = []
      }
    })
  },

  methods: {
    getQuater(quarter) {
      const a = parseInt(quarter)
      switch (a) {
        case 1:
          return [1, 2, 3]
        case 2:
          return [4, 5, 6]
        case 3:
          return [7, 8, 9]
        case 4:
          return [10, 11, 12]
        default:
          return []
      }
    },
    castVND(data) {
      return parseFloat(data).toLocaleString('it-IT', {
        style: 'currency',
        currency: 'VND',
      })
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fmF = ''
      this.formData.fquarter = ''
      this.formData.fyear = ''
      this.formData.fuse = ''
      this.formData.fspend = ''
      this.selectSettle = null
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

      this.$axios.get('/settlement/getall').then((respone) => {
        try {
          this.settles = respone.data.elements.Settles
        } catch (error) {
          this.settles = []
        }
      })
    },
    clickRow(data) {
      this.selectSettle = data
      this.formData.fmF = data.medicalF._id
      this.formData.fquarter = data.quarter
      this.formData.fyear = data.year
    },
    async addSettle(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          medicalF: this.formData.fmF,
          statisticals: this.getStatises.map((s) => s._id),
          quarter: this.formData.fquarter,
          year: this.formData.fyear,
        }
        const result = await this.$axios.$post('/settlement/add', data)
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
    async editSettle(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          _id: this.selectSettle._id,
          medicalF: this.formData.fmF,
          statisticals: this.getStatises.map((s) => s._id),
          quarter: this.formData.fquarter,
          year: this.formData.fyear,
        }
        const result = await this.$axios.$patch('/settlement/edit', data)
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
    async delSettle() {
      try {
        this.loading = true
        const result = await this.$axios.$delete(
          `/settlement/delete?_id=${this.selectSettle._id}`,
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
  },
}
</script>
