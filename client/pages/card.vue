<template>
  <v-row>
    <!-- table -->
    <v-col cols="7" class="card_table">
      <div class="card_table--content">
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              append-outer-icon="mdi-qrcode-scan"
              label="Tìm kiếm"
              class="elevation-1"
              single-line
              hide-details
              @click:append-outer="qrDialog = true"
            ></v-text-field>
          </v-card-title>

          <!-- table -->
          <v-data-table
            :headers="headers"
            :items="cards"
            :search="search"
            @click:row="clickRow"
          >
            <template #[`item.actions`]="{ item }">
              <v-icon small @click="deleteDialogOn($event, item)">
                mdi-delete
              </v-icon>
            </template>
            <template #[`item.effect_custom`]="{ item }">
              <v-chip>
                {{ datediff(new Date(), item.effectTo) }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-col>
    <!-- info -->
    <v-col cols="5" class="text-center card_form">
      <div class="card_form--content">
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- form -->
          <v-container>
            <v-row>
              <!-- the -->
              <v-col v-if="selectCard" cols="12">
                <card-component-vue
                  :card="getSlCard"
                  @refreshData="refreshBill"
                />
              </v-col>
              <!-- khach hang -->
              <v-col v-if="!selectCard" cols="12">
                <v-autocomplete
                  v-model="formData.fcustomer"
                  :disabled="isUpdating"
                  :items="getCus"
                  :rules="[requiredRule]"
                  chips
                  label="Khách hàng"
                  item-text="name"
                  item-value="_id"
                  required
                >
                  <template #selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      close
                      @click="data.select"
                      @click:close="remove(data.item)"
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
              <!-- noi sinh song -->
              <v-col cols="6">
                <v-autocomplete
                  v-model="formData.fplace"
                  :items="places"
                  item-text="id"
                  item-value="_id"
                  chips
                  :rules="[requiredRule]"
                  small-chips
                  required
                  label="Mã nơi sinh sống"
                ></v-autocomplete>
              </v-col>
              <!-- doi tuong -->
              <v-col cols="6">
                <v-autocomplete
                  v-model="formData.fobj"
                  :items="objects"
                  item-text="id"
                  item-value="_id"
                  chips
                  :rules="[requiredRule]"
                  required
                  small-chips
                  label="Mã đối tượng"
                ></v-autocomplete>
              </v-col>
              <!-- mức hưởng -->
              <v-col cols="6">
                <v-autocomplete
                  v-model="formData.fbenefitRate"
                  :items="brs"
                  item-text="id"
                  item-value="_id"
                  chips
                  small-chips
                  :rules="[requiredRule]"
                  required
                  label="Mã mức hưởng"
                  disabled
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formData.frates"
                  label="Mức hưởng"
                  type="number"
                  :rules="[requiredRule]"
                  required
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>

          <!-- btn -->
          <v-btn v-if="!selectCard" class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="!selectCard"
            :disabled="!valid"
            color="success"
            @click="addCard"
          >
            Thêm thẻ
          </v-btn>
          <v-btn v-if="selectCard" class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="selectCard"
            :disabled="!valid"
            color="warning"
            @click="editCard"
          >
            Sửa
          </v-btn>
        </v-form>
      </div>
    </v-col>

    <!-- delete dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Xóa thẻ </v-card-title>
        <v-card-text>
          Dữ liệu thẻ và các thanh toán trước đó sẽ bị xóa vĩnh viễn. Bạn thật
          sự muốn xóa?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelDialog">
            Trở lại
          </v-btn>
          <v-btn color="error" text @click="delCard"> Xóa </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="qrDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Quét mã QRCode </v-card-title>
        <v-card-text>
          Tính năng sẽ sớm ra mắt. Vui lòng quay trở lại sau!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="qrDialog = false">
            Trở lại
          </v-btn>
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
import CardComponentVue from '../components/CardComponent.vue'
export default {
  name: 'CardPage',
  components: {
    CardComponentVue,
  },
  data() {
    return {
      // data
      places: [],
      objects: [],
      brs: [],
      customers: [],
      cards: [],
      groups: [],
      formData: {
        fcustomer: '',
        fplace: '',
        fobj: '',
        fbenefitRate: '',
        frates: '',
      },
      search: '',
      headers: [
        {
          text: 'Khách hàng',
          align: 'center',
          sortable: true,
          value: 'customer.name',
          divider: true,
        },
        {
          text: 'CMND',
          value: 'customer.idCard',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Trạng thái thẻ',
          align: 'center',
          sortable: false,
          value: 'effect_custom',
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
      isUpdating: false,
      valid: true,
      requiredRule: (v) => !!v || 'Không được bổ trống trường này',
      lengthRule: (v) => (v && v.length <= 10) || 'Số ký tự phải nhỏ hơn 10',
      emailRule: (v) => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ',

      // temp
      selectCard: null,

      // amination
      dialog: false,
      qrDialog: false,
      loading: false,
      error: '',
      snackbarFail: false,
      snackbarSuccess: false,
    }
  },

  computed: {
    getBrs(ctx) {
      return ctx.brs.find((br) =>
        br.objs.map((obj) => obj._id).includes(ctx.formData.fobj)
      )
    },
    getCus(ctx) {
      return ctx.customers.filter(
        (cus) => !ctx.cards.map((card) => card.customer._id).includes(cus._id)
      )
    },
    getSlCard(ctx) {
      return ctx.selectCard
        ? ctx.cards.find((card) => card._id === ctx.selectCard._id)
        : null
    },
  },

  watch: {
    getBrs(newVal, oldVal) {
      if (newVal) {
        this.formData.fbenefitRate = newVal._id
        this.formData.frates = newVal.rates
      }
    },
  },

  beforeCreate() {
    this.$axios.get('/cus/getall/1').then((respone) => {
      try {
        this.customers = respone.data.elements.customers
      } catch (error) {
        this.customers = []
      }
    })
    this.$axios.get('/brs/getall').then((respone) => {
      try {
        this.brs = respone.data.elements.bRs
      } catch (error) {
        this.brs = []
      }
    })
    this.$axios.get('/obj/getall').then((respone) => {
      try {
        this.objects = respone.data.elements.Objects
      } catch (error) {
        this.objects = []
      }
    })
    this.$axios.get('/places/getall').then((respone) => {
      try {
        this.places = respone.data.elements.Places
      } catch (error) {
        this.places = []
      }
    })
    this.$axios.get('/insurance/getall').then((respone) => {
      try {
        this.cards = respone.data.elements.HIs
      } catch (error) {
        this.cards = []
      }
    })
  },

  methods: {
    remove(item) {
      this.formData.fcustomer = ''
    },
    datediff(first, second) {
      if (first && second) {
        return `${Math.round(
          (new Date(second) - new Date(first)) / (1000 * 60 * 60 * 24)
        )} ngày`
      } else {
        return 'Chưa gia hạn'
      }
    },
    clickRow(data) {
      this.formData = {
        fcustomer: data.customer._id,
        fplace: data.place._id,
        fobj: data.obj._id,
        fbenefitRate: data.benefitRate._id,
        frates: data.benefitRate.rates,
      }
      this.selectCard = data
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fcustomer = ''
      this.formData.fplace = ''
      this.formData.fobj = ''
      this.formData.fbenefitRate = ''
      this.formData.frates = ''
      this.selectCard = null
    },
    refreshData() {
      this.$axios.get('/insurance/getall').then((respone) => {
        try {
          this.cards = respone.data.elements.HIs
        } catch (error) {
          this.cards = []
        }
      })
    },
    deleteDialogOn(e, item) {
      this.dialog = true
      this.selectCard = item
    },
    closeDelDialog() {
      this.dialog = false
      this.reset()
    },
    async addCard(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          customer: this.formData.fcustomer,
          benefitRate: this.formData.fbenefitRate,
          place: this.formData.fplace,
          obj: this.formData.fobj,
        }
        const result = await this.$axios.$post('/insurance/add', data)
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
            this.error = 'Khách hàng đã sở hữu bảo hiểm y tế'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async editCard(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          _id: this.selectCard._id,
          // customer: this.formData.fcustomer,
          benefitRate: this.formData.fbenefitRate,
          place: this.formData.fplace,
          obj: this.formData.fobj,
        }
        const result = await this.$axios.$patch('/insurance/edit', data)
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
            this.error = 'Khách hàng đã có BHYT'
            this.loading = false
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async delCard(e) {
      e.preventDefault()
      this.loading = true
      const result = await this.$axios.$delete(
        `/insurance/delete?_id=${this.selectCard._id}`
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
    refreshBill() {
      this.refreshData()
    },
  },
}
</script>
