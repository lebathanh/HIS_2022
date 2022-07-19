<template>
  <v-row>
    <!-- table -->
    <v-col cols="6" class="therepy_table">
      <div class="therepy_table--content">
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
            :items="therepies"
            :search="search"
            @click:row="clickRow"
          >
            <template #[`item.actions`]="{ item }">
              <v-icon small @click="deleteDialogOn($event, item)">
                mdi-delete
              </v-icon>
            </template>
            <template #[`item.therapyFee_custom`]="{ item }">
              {{ castVND(item.therapyFee) }}
            </template>
            <template #[`item.realFee_custom`]="{ item }">
              {{ castVND(item.realFee) }}
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-col>
    <!-- info -->
    <v-col cols="6" class="text-center therepy_form">
      <div class="therepy_form--content">
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- form -->
          <v-container>
            <v-row>
              <!-- khach hang -->
              <v-col cols="12">
                <v-autocomplete
                  v-model="formData.fcustomer"
                  :disabled="isUpdating || selectTherepy !== null"
                  :items="customers"
                  chips
                  label="Khách hàng"
                  :rules="[requiredRule]"
                  item-text="name"
                  item-value="_id"
                >
                  <template #selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      close
                      @click="data.select"
                      @click:close="formData.fcustomer = ''"
                    >
                      <v-avatar left>
                        <v-img :src="data.item.avatar.imgUrl"></v-img>
                      </v-avatar>
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                  <template #item="data">
                    <v-list-item-avatar>
                      <img :src="data.item.avatar.imgUrl" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ data.item.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ data.item.idCard }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- csyt -->
              <v-col cols="6">
                <v-autocomplete
                  v-model="formData.fmedicalF"
                  :items="facilities"
                  :rules="[requiredRule]"
                  :disabled="selectTherepy !== null"
                  label="Cơ sở y tế"
                  item-text="name"
                  item-value="_id"
                >
                </v-autocomplete>
              </v-col>
              <!-- ngay kham -->
              <v-col cols="6">
                <v-text-field
                  v-model="formData.ftime"
                  label="Ngày khám"
                  :disabled="selectTherepy !== null"
                  type="date"
                  :rules="[requiredRule]"
                ></v-text-field>
              </v-col>
              <!-- chi phi -->
              <v-col cols="4">
                <v-text-field
                  v-model="formData.ftherapyFee"
                  label="Chi phí"
                  type="number"
                  disabled
                ></v-text-field>
              </v-col>
              <!-- mien giam -->
              <v-col cols="4">
                <v-text-field
                  v-model="formData.fsale"
                  label="Miễn giảm"
                  type="number"
                  disabled
                ></v-text-field>
              </v-col>
              <!-- thuc thu -->
              <v-col cols="4">
                <v-text-field
                  v-model="formData.frealFee"
                  label="Thực thu"
                  type="number"
                  disabled
                ></v-text-field>
              </v-col>
              <!-- vat tu -->
              <v-col cols="6">
                <v-autocomplete
                  v-model="selectService"
                  :items="services"
                  item-text="name"
                  item-value="_id"
                  label="Dịch vụ - thuốc - hóa chất"
                ></v-autocomplete>
              </v-col>
              <!-- so luong -->
              <v-col cols="3">
                <v-text-field
                  v-model="quantity"
                  min="1"
                  max="100"
                  label="Số lượng"
                  type="number"
                ></v-text-field>
              </v-col>
              <!-- btn -->
              <v-col cols="3">
                <v-btn
                  :disabled="
                    formData.fcustomer === '' ||
                    formData.ftime === '' ||
                    selectService === null ||
                    quantity <= 0
                  "
                  class="mt-4"
                  color="primary"
                  block
                  @click="addService"
                >
                  Thêm
                </v-btn>
              </v-col>
              <!-- table -->
              <v-col cols="12">
                <v-data-table
                  :headers="headers_"
                  :items="getSv"
                  :search="search_"
                >
                  <template #[`item.actions`]="{ item }">
                    <v-icon small @click="deleteService($event, item)">
                      mdi-delete
                    </v-icon>
                  </template>
                  <template #[`item.prices_custom`]="{ item }">
                    {{ castVND(item.prices) }}
                  </template>
                  <template #[`item.realFee_custom`]="{ item }">
                    {{ castVND(item.realFee) }}
                  </template>
                  <template #[`item.sale_custom`]="{ item }">
                    {{ `${item.sale * 100}%` }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>

          <!-- btn -->
          <v-btn class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="!selectTherepy"
            :disabled="!valid"
            color="success"
            @click="addTherapy"
          >
            Thêm khám chữa bệnh
          </v-btn>
          <v-btn
            v-if="selectTherepy"
            :disabled="!valid"
            color="warning"
            @click="editTherapy"
          >
            Sửa
          </v-btn>
        </v-form>
      </div>
    </v-col>

    <!-- delete dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Xóa khám chữa bệnh </v-card-title>
        <v-card-text>
          Dữ liệu về lần khám chữa bệnh này sẽ bị xóa vĩnh viễn. Bạn thật sự
          muốn xóa?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelDialog">
            Trở lại
          </v-btn>
          <v-btn color="error" text @click="delTherapy"> Xóa </v-btn>
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
  name: 'TherapyPage',

  data() {
    return {
      // data
      customers: [],
      therepies: [],
      facilities: [],
      cards: [],
      services: [],
      formData: {
        fcustomer: '',
        fhID: '',
        fservices: [],
        ftime: '',
        fmedicalF: '',
        ftherapyFee: 0,
        frealFee: 0,
        fsale: 0,
        fstatus: false,
      },
      search: '',
      search_: '',
      headers: [
        {
          text: 'Cơ sở KCB',
          align: 'center',
          sortable: true,
          value: 'medicalF.name',
          width: '150px',
          divider: true,
        },
        {
          text: 'Họ tên',
          value: 'customer.name',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'CMND',
          align: 'center',
          sortable: false,
          value: 'customer.idCard',
          divider: true,
        },
        {
          text: 'Chi phí',
          value: 'therapyFee_custom',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Thực thu',
          value: 'realFee_custom',
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
      headers_: [
        {
          text: 'Tên DV-VT',
          align: 'center',
          sortable: true,
          value: 'name',
          divider: true,
        },
        {
          text: 'Số lượng',
          value: 'quantity',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Đơn giá',
          align: 'center',
          sortable: false,
          value: 'prices_custom',
          divider: true,
        },
        {
          text: 'Miễn giảm',
          value: 'sale_custom',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Thành tiền',
          value: 'realFee_custom',
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

      // validate form
      valid: true,
      isUpdating: false,
      requiredRule: (v) => !!v || 'Không được bổ trống trường này',
      lengthRule: (v) => (v && v.length <= 10) || 'Số ký tự phải nhỏ hơn 10',
      emailRule: (v) => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ',

      // temp
      selectTherepy: null,
      selectService: null,
      quantity: 1,

      // amination
      dialog: false,
      loading: false,
      error: '',
      snackbarFail: false,
      snackbarSuccess: false,
    }
  },

  computed: {
    getCustomer(ctx) {
      return ctx.formData.fcustomer
    },
    getSelectServices(ctx) {
      return ctx.formData.fservices
    },
    getSv(ctx) {
      return ctx.formData.fservices
    },
  },

  watch: {
    getCustomer(newVal, oldVal) {
      if (newVal !== '') {
        this.formData.fhID = this.cards.find((c) => c.customer._id === newVal)
      } else {
        this.formData.fhID = ''
      }
    },
    getSelectServices(newVal, oldVal) {
      const fee = newVal.map((s) => s.fee).reduce((a, b) => a + b, 0)
      const realFee = newVal.map((s) => s.realFee).reduce((a, b) => a + b, 0)
      this.formData.ftherapyFee = fee
      this.formData.frealFee = realFee
      this.formData.fsale = fee - realFee
    },
  },

  beforeCreate() {
    this.$axios.get('/therapy/getall').then((respone) => {
      try {
        this.therepies = respone.data.elements.Therapies
      } catch (error) {
        this.therepies = []
      }
    })
    this.$axios.get('/cus/getall/1').then((respone) => {
      try {
        this.customers = respone.data.elements.customers
      } catch (error) {
        this.customers = []
      }
    })
    this.$axios.get('/insurance/getall').then((respone) => {
      try {
        this.cards = respone.data.elements.HIs
      } catch (error) {
        this.cards = []
      }
    })
    this.$axios.get('/mfs/getall').then((respone) => {
      try {
        this.facilities = respone.data.elements.MedicalFs
      } catch (error) {
        this.facilities = []
      }
    })
    this.$axios.get('/ms/getall').then((respone) => {
      try {
        this.services = respone.data.elements.MedicalSs
      } catch (error) {
        this.services = []
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
    getService(_id) {
      return this.services.find((s) => s._id === _id)
    },
    checkSaleObj(_id, service) {
      const isInclude = service.objects.map((ob) => ob._id).includes(_id)
      return isInclude
    },
    checkHIEx(card) {
      if (card.effectTo && card.effectFrom) {
        const a = new Date(card.effectFrom).getTime()
        const b = new Date(this.formData.ftime).getTime()
        const c = new Date(card.effectTo).getTime()
        return b >= a && b <= c
      } else {
        return false
      }
    },
    async addService() {
      const service = this.getService(this.selectService)
      const card = this.formData.fhID
      const isSale = this.checkSaleObj(card.obj._id, service)
      const isEx = this.checkHIEx(card)
      const sale = isSale && isEx ? card.benefitRate.rates : 0
      const data = {
        _id: service._id,
        name: service.name,
        prices: service.prices,
        quantity: this.quantity,
        fee: service.prices * this.quantity,
        sale,
        realFee: service.prices * this.quantity * (1 - sale),
      }
      await this.formData.fservices.push(data)
      this.selectService = null
      this.quantity = 1
    },
    async deleteService(e, item) {
      const index = await this.formData.fservices
        .map((s) => s._id)
        .indexOf(item._id)
      if (index !== -1) {
        this.formData.fservices.splice(index, 1)
      }
    },

    // ----------------

    clickRow(data) {
      this.formData.fcustomer = data.customer._id
      this.formData.fmedicalF = data.medicalF._id
      this.formData.fservices = data.services
      this.formData.ftime = new Date(data.time).toISOString().substring(0, 10)
      this.selectTherepy = data
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fcustomer = ''
      this.formData.fhID = ''
      this.formData.fservices = []
      this.formData.ftime = ''
      this.formData.fmedicalF = ''
      this.formData.ftherapyFee = 0
      this.formData.frealFee = 0
      this.formData.fsale = 0
      this.formData.fstatus = false
      this.selectService = null
      this.quantity = 1
      this.selectTherepy = null
    },
    refreshData() {
      this.$axios.get('/therapy/getall').then((respone) => {
        try {
          this.therepies = respone.data.elements.Therapies
        } catch (error) {
          this.therepies = []
        }
      })
    },
    deleteDialogOn(e, item) {
      this.dialog = true
      this.selectTherepy = item
    },
    closeDelDialog() {
      this.dialog = false
      this.reset()
    },
    async addTherapy(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          customer: this.formData.fcustomer,
          hID: this.formData.fhID._id,
          services: this.formData.fservices,
          time: this.formData.ftime,
          medicalF: this.formData.fmedicalF,
          therapyFee: this.formData.ftherapyFee,
          realFee: this.formData.frealFee,
          status: false,
        }
        const result = await this.$axios.$post('/therapy/add', data)
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
            this.error = 'Trùng lặp'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async editTherapy(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          _id: this.selectTherepy._id,
          customer: this.formData.fcustomer,
          hID: this.formData.fhID._id,
          services: this.formData.fservices,
          time: this.formData.ftime,
          medicalF: this.formData.fmedicalF,
          therapyFee: this.formData.ftherapyFee,
          realFee: this.formData.frealFee,
          status: false,
        }
        const result = await this.$axios.$patch('/therapy/edit', data)
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
            this.error = 'Trùng lặp'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async delTherapy(e) {
      e.preventDefault()
      this.loading = true
      const result = await this.$axios.$delete(
        `/therapy/delete?_id=${this.selectTherepy._id}`
      )
      switch (result.status) {
        case 'OK':
          this.closeDelDialog()
          this.loading = false
          this.refreshData()
          this.snackbarSuccess = true
          break
        case 400:
          this.error = 'KCB không tồn tại'
          this.loading = false
          this.snackbarFail = true
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
