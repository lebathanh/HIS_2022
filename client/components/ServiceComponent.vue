<template>
  <v-row>
    <!-- table -->
    <v-col cols="7" class="service_table">
      <div class="service_table--content">
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Tìm kiếm"
              class="elevation-1"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>

          <!-- table -->
          <v-data-table
            :headers="headers"
            :items="services"
            :search="search"
            @click:row="clickRow"
          >
            <template #[`item.actions`]="{ item }">
              <v-icon small @click="deleteDialogOn($event, item)">
                mdi-delete
              </v-icon>
            </template>
            <template #[`item.prices_custom`]="{ item }">
              {{ castVND(item.prices) }}
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-col>
    <!-- info -->
    <v-col cols="5" class="text-center service_form">
      <div class="service_form--content">
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- form -->
          <v-container>
            <v-row>
              <!-- ten -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.fname"
                  label="Tên vật tư - dịch vụ"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>
              <!-- dv tinh -->
              <v-col cols="6">
                <v-select
                  v-model="formData.fcalculationUnit"
                  label="Đơn vị tính"
                  :items="calcUs"
                  :rules="[requiredRule]"
                  required
                ></v-select>
              </v-col>
              <!-- don gia -->
              <v-col cols="6">
                <v-text-field
                  v-model="formData.fprices"
                  label="Đơn giá"
                  :rules="[requiredRule]"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <!-- doi tuong -->
              <v-col cols="12">
                <v-autocomplete
                  v-model="formData.fobjects"
                  :items="objs"
                  chips
                  small-chips
                  label="Đối tượng"
                  item-text="id"
                  item-value="_id"
                  multiple
                ></v-autocomplete>
              </v-col>
              <!-- ghi chu -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.fdescriptions"
                  label="Ghi chú"
                  :rules="[requiredRule]"
                  auto-grow
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>

          <!-- btn -->
          <v-btn v-if="!selectService" class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="!selectService"
            :disabled="!valid"
            color="success"
            @click="addService"
          >
            Thêm DV-T-HC
          </v-btn>
          <v-btn v-if="selectService" class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="selectService"
            :disabled="!valid"
            color="warning"
            @click="editService"
          >
            Sửa
          </v-btn>
        </v-form>
      </div>
    </v-col>
    <!-- delete dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Xóa DV-T-HC </v-card-title>
        <v-card-text>
          Dữ liệu về VT-T-HC này sẽ bị xóa vĩnh viễn. Bạn thật sự muốn xóa?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelDialog">
            Trở lại
          </v-btn>
          <v-btn color="error" text @click="delService"> Xóa </v-btn>
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
      // data
      calcUs: [
        'Mẫu',
        'Liều',
        'Viên',
        'Lần',
        'Viên',
        'Hộp',
        'Gói',
        'Chai',
        'Gói',
        'Típ',
        'Đơn vị khác',
      ],
      objs: [],
      services: [],
      formData: {
        fname: '',
        fcalculationUnit: '',
        fprices: '',
        fobjects: [],
        fdescriptions: '',
      },
      search: '',
      headers: [
        {
          text: 'Tên DV-T-HC',
          align: 'center',
          sortable: true,
          value: 'name',
          divider: true,
        },
        {
          text: 'Đơn vị tính',
          value: 'calculationUnit',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Đơn giá',
          value: 'prices_custom',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Ghi chú',
          value: 'descriptions',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Thao tác',
          align: 'center',
          value: 'actions',
          sortable: false,
        },
      ],
      dialog: false,

      // validate form
      valid: true,
      requiredRule: (v) => !!v || 'Không được bổ trống trường này',
      lengthRule: (v) => (v && v.length <= 10) || 'Số ký tự phải nhỏ hơn 10',
      emailRule: (v) => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ',

      // amination
      loading: false,
      error: '',
      snackbarFail: false,
      snackbarSuccess: false,

      // temp
      selectService: null,
    }
  },

  computed: {},

  watch: {},

  beforeCreate() {
    this.$axios.get('/ms/getall').then((respone) => {
      try {
        this.services = respone.data.elements.MedicalSs
      } catch (error) {
        this.services = []
      }
    })
    this.$axios.get('/obj/getall').then((respone) => {
      try {
        this.objs = respone.data.elements.Objects
      } catch (error) {
        this.objs = []
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
    clickRow(data) {
      this.formData = {
        fname: data.name,
        fcalculationUnit: data.calculationUnit,
        fprices: data.prices,
        fobjects: data.objects,
        fdescriptions: data.descriptions,
      }
      this.selectService = data
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fname = ''
      this.formData.fcalculationUnit = ''
      this.formData.fprices = ''
      this.formData.fobjects = []
      this.formData.fdescriptions = ''
      this.selectService = null
    },
    refreshData() {
      this.$axios.get('/ms/getall').then((respone) => {
        try {
          this.services = respone.data.elements.MedicalSs
        } catch (error) {
          this.services = []
        }
      })
    },
    deleteDialogOn(e, item) {
      this.dialog = true
      this.selectService = item
    },
    closeDelDialog() {
      this.dialog = false
      this.reset()
    },
    async addService(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          name: this.formData.fname,
          calculationUnit: this.formData.fcalculationUnit,
          prices: this.formData.fprices,
          objects: this.formData.fobjects,
          descriptions: this.formData.fdescriptions,
        }
        const result = await this.$axios.$post('/ms/add', data)
        switch (result.status) {
          case 'OK':
            this.reset()
            this.loading = false
            this.refreshData()
            this.snackbarSuccess = true
            break
          case 404:
            this.loading = false
            this.error = 'Bad request'
            this.snackbarFail = true
            break
          case 409:
            this.loading = false
            this.error = 'Dịch vụ - vật tư đã tồn tại'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async editService(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          _id: this.selectService._id,
          name: this.formData.fname,
          calculationUnit: this.formData.fcalculationUnit,
          prices: this.formData.fprices,
          objects: this.formData.fobjects,
          descriptions: this.formData.fdescriptions,
        }
        const result = await this.$axios.$patch('/ms/edit', data)
        switch (result.status) {
          case 'OK':
            this.reset()
            this.loading = false
            this.refreshData()
            this.snackbarSuccess = true
            break
          case 404:
            this.loading = false
            this.error = 'Bad request'
            this.snackbarFail = true
            break
          case 409:
            this.loading = false
            this.error = 'Dịch vụ - vật tư đã tồn tại'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async delService(e) {
      e.preventDefault()
      this.loading = true
      const result = await this.$axios.$delete(
        `/ms/delete?_id=${this.selectService._id}`
      )
      switch (result.status) {
        case 'OK':
          this.closeDelDialog()
          this.loading = false
          this.refreshData()
          this.snackbarSuccess = true
          break
        default:
          this.error = 'Lỗi không xác định vui lòng thử lại sau'
          this.loading = false
          this.snackbarFail = true
      }
    },
  },
}
</script>
