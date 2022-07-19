<template>
  <v-card class="mx-auto pa-5" max-width="500">
    <v-avatar size="60">
      <img alt="user" :src="getAvatar" />
    </v-avatar>
    <h3>{{ card ? card.customer.name : `...` }}</h3>
    <v-divider></v-divider>
    <v-row>
      <!-- doi tuong -->
      <v-col cols="4" align="start">
        <b>Mã đối tượng:</b>
      </v-col>
      <v-col cols="2" align="end"> {{ card ? card.obj.id : `...` }} </v-col>
      <!-- nss -->
      <v-col cols="4" align="start">
        <b>Mã NSS:</b>
      </v-col>
      <v-col cols="2" align="end"> {{ card ? card.place.id : `...` }} </v-col>
      <!-- gia tri -->
      <v-col cols="3" align="start">
        <b>Hiệu lực:</b>
      </v-col>
      <v-col cols="3" align="end">{{
        card && card.effectFrom
          ? new Date(card.effectFrom).toISOString().substring(0, 10).toString()
          : `...`
      }}</v-col>
      <!-- het han -->
      <v-col cols="3" align="start">
        <b>Hết hạn:</b>
      </v-col>
      <v-col cols="3" align="end">{{
        card && card.effectTo
          ? new Date(card.effectTo).toISOString().substring(0, 10).toString()
          : `...`
      }}</v-col>
      <!-- hoa don -->
      <v-col cols="12" align="center">
        <v-dialog
          v-model="dialog"
          transition="dialog-top-transition"
          persistent
          max-width="600"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              :disabled="!card"
              color="primary"
              block
              v-bind="attrs"
              v-on="on"
              >Gia hạn</v-btn
            >
          </template>
          <v-card>
            <v-toolbar color="primary" dark>
              <b class="mx-auto">THANH TOÁN GIA HẠN</b>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <!-- form -->
                <v-col cols="12">
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <!-- so nam -->
                      <v-col cols="4">
                        <v-text-field
                          v-model="formData.fquantity"
                          :rules="[requiredRule]"
                          required
                          label="Số năm"
                          type="number"
                          max="5"
                          min="1"
                          :disabled="selectBill ? true : false"
                        ></v-text-field>
                      </v-col>
                      <!-- thanh tien -->
                      <v-col cols="4">
                        <v-text-field
                          v-model="formData.fmoney"
                          :rules="[requiredRule]"
                          label="Thanh toán"
                          required
                          type="number"
                          :disabled="selectBill ? true : false"
                        ></v-text-field>
                      </v-col>
                      <!-- trang thai -->
                      <v-col cols="4">
                        <v-checkbox
                          v-model="formData.fpaid"
                          :label="
                            formData.fpaid ? 'Đã thanh toán' : 'Chưa thanh toán'
                          "
                        ></v-checkbox>
                      </v-col>
                      <!-- nguoi nhan -->
                      <v-col cols="12">
                        <v-text-field
                          v-model="formData.freceiver"
                          label="Người nhận"
                          :disabled="!formData.fpaid"
                        ></v-text-field>
                      </v-col>
                      <!-- ngay nhan -->
                      <v-col cols="12">
                        <v-text-field
                          v-model="formData.fdateOfIssue"
                          label="Ngày nhận"
                          type="date"
                          :disabled="!formData.fpaid"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-col>
                <!-- btn -->
                <v-col cols="12" class="d-flex justify-center align-center">
                  <v-btn class="mr-4" color="gray" @click="reset">Hủy</v-btn>
                  <v-btn
                    v-if="!selectBill"
                    :disabled="!valid"
                    class="mr-4"
                    color="success"
                    @click="addBill"
                    >Thêm</v-btn
                  >
                  <v-btn
                    v-if="selectBill"
                    class="mr-4"
                    color="error"
                    @click="delBill"
                    >Xóa</v-btn
                  >
                  <v-btn
                    v-if="selectBill"
                    :disabled="!valid"
                    class="mr-4"
                    color="warning"
                    @click="editBill"
                    >Lưu</v-btn
                  >
                </v-col>
                <!-- table -->
                <v-col cols="12">
                  <v-data-table
                    :headers="headers"
                    :items="getBills"
                    :search="search"
                    @click:row="clickRow"
                  >
                    <template #[`item.money_custom`]="{ item }">
                      {{ castVND(item.money) }}
                    </template>
                    <template #[`item.paid_custom`]="{ item }">
                      {{ item.paid ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                    </template>
                    <template #[`item.status`]="{ item }">
                      <v-icon
                        :color="
                          item.dateOfIssue && item.receiver
                            ? 'success'
                            : 'error'
                        "
                        >{{
                          item.dateOfIssue && item.receiver
                            ? 'mdi-check-circle'
                            : 'mdi-close-circle'
                        }}</v-icon
                      >
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog = false">Trở lại</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-divider class="mt-4"></v-divider>
      </v-col>
    </v-row>

    <v-card-actions>
      <v-btn color="orange lighten-2" text> Thẻ </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click="disPlay">
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text
          class="d-flex flex-column justify-space-between align-center"
        >
          <print-card-component-vue v-if="show" :card="card" :qr="qrImg" />
        </v-card-text>
      </div>
    </v-expand-transition>

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
  </v-card>
</template>

<script>
import QRCode from 'qrcode'
import PrintCardComponentVue from './PrintCardComponent.vue'
export default {
  components: {
    PrintCardComponentVue,
  },
  props: {
    card: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    show: false,
    qrImg: '',
    dialog: false,
    fee: 400000,
    formData: {
      fquantity: null,
      fmoney: '',
      fpaid: false,
      fdateOfIssue: null,
      freceiver: null,
    },
    search: '',
    headers: [
      {
        text: 'Số năm',
        align: 'center',
        sortable: true,
        value: 'quantity',
        divider: true,
      },
      {
        text: 'Số tiền',
        value: 'money_custom',
        align: 'center',
        sortable: false,
        divider: true,
      },
      {
        text: 'Thanh toán',
        align: 'center',
        value: 'paid_custom',
        divider: true,
        sortable: false,
      },
      {
        text: 'Cấp thẻ',
        align: 'center',
        value: 'status',
        divider: true,
        sortable: false,
      },
    ],
    // validate
    isUpdating: false,
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
    selectBill: null,
  }),
  computed: {
    getAvatar(ctx) {
      if (ctx.card) {
        return ctx.card.customer.avatar
          ? ctx.card.customer.avatar.imgUrl
          : 'https://res.cloudinary.com/bathanh-tech/image/upload/v1655478482/unknown-512_i4zumg.webp'
      } else {
        return 'https://res.cloudinary.com/bathanh-tech/image/upload/v1655478482/unknown-512_i4zumg.webp'
      }
    },
    getBills(ctx) {
      return ctx.card ? ctx.card.bills : []
    },
    checkRe(ctx) {
      if (
        !ctx.formData.fpaid ||
        ctx.formData.freceiver === '' ||
        ctx.formData.freceiver === null ||
        ctx.formData.fdateOfIssue === '' ||
        ctx.formData.fdateOfIssue === null
      ) {
        return false
      } else {
        return true
      }
    },
    getFee(ctx) {
      if (ctx.formData.fquantity && ctx.formData.fquantity !== '') {
        if (
          ctx.card &&
          ctx.card.customer &&
          ctx.card.customer.cusGroups &&
          ctx.card.customer.cusGroups.length > 0
        ) {
          if (ctx.card.customer.cusGroups.length === 1) {
            const fee =
              (ctx.card.customer.cusGroups.joinType === 'GD'
                ? ctx.familyFees(ctx.card.customer.cusGroups[0].members.length)
                : ctx.companyFees(
                    ctx.card.customer.cusGroups[0].members.length
                  )) * parseInt(ctx.formData.fquantity)
            return fee
          } else {
            const feeArrays = ctx.card.customer.cusGroups.map((g) =>
              g.joinType === 'GD'
                ? ctx.familyFees(g.members.length)
                : ctx.companyFees(g.members.length)
            )
            const fee =
              Math.max(...feeArrays) * parseInt(ctx.formData.fquantity)
            return fee
          }
        } else {
          const fee = ctx.fee * parseInt(ctx.formData.fquantity)
          return fee
        }
      } else {
        return 0
      }
    },
    getPaid(ctx) {
      return ctx.formData.fpaid
    },
  },
  watch: {
    card(newVal, oldVal) {
      this.createQR()
      this.show = false
    },
    getFee(newVal, oldVal) {
      this.formData.fmoney = newVal
    },
    getPaid(newVal, oldVal) {
      if (!newVal) {
        this.formData.freceiver = null
        this.formData.fdateOfIssue = null
      }
    },
  },
  mounted() {
    this.createQR()
  },
  methods: {
    familyFees(members) {
      switch (members) {
        case 0:
          return this.fee
        case 1:
          return this.fee * 0.9
        case 2:
          return this.fee * 0.8
        default:
          return this.fee * 0.7
      }
    },
    companyFees(members) {
      if (members >= 0 && members < 10) {
        return this.fee * 0.9
      } else if (members >= 10 && members < 20) {
        return this.fee * 0.8
      } else if (members >= 20 && members < 50) {
        return this.fee * 0.7
      } else if (members >= 50) {
        return this.fee * 0.65
      }
    },
    castVND(data) {
      return parseFloat(data).toLocaleString('it-IT', {
        style: 'currency',
        currency: 'VND',
      })
    },
    async createQR() {
      try {
        if (this.card) {
          this.qrImg = await QRCode.toDataURL(this.card._id)
        } else {
          this.qrImg = ''
        }
      } catch (err) {
        this.qrImg = ''
      }
    },
    clickRow(data) {
      this.formData = {
        fquantity: parseInt(data.quantity),
        fmoney: data.money,
        fpaid: data.paid,
        fdateOfIssue: data.dateOfIssue,
        freceiver: data.receiver,
      }
      this.selectBill = data
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fquantity = null
      this.formData.fmoney = ''
      this.formData.fpaid = false
      this.formData.fdateOfIssue = null
      this.formData.freceiver = null
      this.selectBill = null
    },
    refreshData() {
      this.$emit('refreshData')
    },
    async addBill(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          customer: this.card.customer._id,
          quantity: this.formData.fquantity,
          money: this.formData.fmoney,
          paid: this.formData.fpaid,
          dateOfIssue: this.checkRe ? this.formData.dateOfIssue : null,
          receiver: this.checkRe ? this.formData.freceiver : null,
        }
        const result = await this.$axios.$post('/bill/add', data)
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
            this.error = 'Khách hàng còn hóa đơn chưa thanh toán'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async editBill(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          _id: this.selectBill._id,
          paid: this.formData.fpaid,
          dateOfIssue: this.checkRe ? this.formData.fdateOfIssue : null,
          receiver: this.checkRe ? this.formData.freceiver : null,
        }
        const result = await this.$axios.$patch('/bill/edit', data)
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
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async delBill() {
      this.loading = true
      const result = await this.$axios.$delete(
        `/bill/delete?_id=${this.selectBill._id}`
      )
      switch (result.status) {
        case 'OK':
          this.loading = false
          this.snackbarSuccess = true
          this.refreshData()
          break
        case 400:
          this.loading = false
          this.error = 'Bad request'
          this.snackbarFail = true
          break
        case 403:
          this.loading = false
          this.error = 'Không được phép xóa thanh toán đã hoàn thành'
          this.snackbarFail = true
          break
        default:
          this.error = 'Lỗi server'
          this.loading = false
          this.snackbarFail = true
      }
    },
    disPlay() {
      if (this.show === true) {
        this.show = false
      } else {
        this.show = !this.show
        this.loading = true
        setTimeout(() => {
          this.show = !this.show
        }, 200)
        setTimeout(() => {
          this.show = !this.show
          this.loading = false
        }, 800)
      }
    },
  },
}
</script>

<style></style>
