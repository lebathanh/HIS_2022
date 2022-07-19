<template>
  <v-row>
    <!-- table -->
    <v-col cols="6" class="cus_table">
      <div class="cus_table--content">
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
            :items="dSKhachHang"
            :search="search"
            @click:row="clickRow"
          >
            <template #[`item.actions`]="{ item }">
              <v-icon small @click="deleteCusDialogOn($event, item)">
                mdi-delete
              </v-icon>
            </template>
            <template #[`item.address_custom`]="{ item }">
              {{
                `${item.address}, ${item.ward.name}, ${item.district.name}, ${item.province.name}`
              }}
            </template>
            <template #[`item.avatar_custom`]="{ item }">
              <v-avatar size="40">
                <img :src="item.avatar.imgUrl" alt="avatar" />
              </v-avatar>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-col>
    <!-- info -->
    <v-col cols="6" class="text-center cus_form">
      <div class="cus_form--content">
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- form -->
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-card class="mx-auto" width="100%" max-height="180px">
                  <v-img
                    height="180px"
                    src="https://picsum.photos/510/300?random"
                    cover
                  >
                    <v-row class="fill-height">
                      <v-col cols="12" class="pb-0">
                        <v-avatar size="140">
                          <v-img :src="getAvatar"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col class="pa-0 mt-0">
                        <v-list-item color="rgba(0, 0, 0, .4)" dark>
                          <v-list-item-content class="pa-0 mt-0">
                            <v-list-item-subtitle>
                              <v-icon @click="onPickImg">
                                mdi-camera-flip
                              </v-icon>
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-col>
                    </v-row>
                  </v-img>
                </v-card>
                <input
                  id="imgInput"
                  ref="imgInput"
                  name="imgInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="OnPickedImg"
                />
              </v-col>
              <!-- ten -->
              <v-col cols="4">
                <v-text-field
                  v-model="formData.fname"
                  label="Họ tên"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>
              <!-- di dong -->
              <v-col cols="4">
                <v-text-field
                  v-model="formData.fphone"
                  label="Số điện thoại di động"
                  required
                  :rules="[requiredRule]"
                ></v-text-field>
              </v-col>
              <!-- email -->
              <v-col cols="4">
                <v-text-field
                  v-model="formData.femail"
                  label="Email"
                  :rules="[emailRule]"
                ></v-text-field>
              </v-col>
              <!-- ngay sinh -->
              <v-col cols="3">
                <v-text-field
                  v-model="formData.fbirth"
                  label="Ngày sinh"
                  :rules="[requiredRule]"
                  type="date"
                  required
                ></v-text-field>
              </v-col>
              <!-- gioi tinh -->
              <v-col cols="3">
                <v-autocomplete
                  v-model="formData.fgender"
                  :items="['Nam', 'Nữ']"
                  label="Giới tính"
                  :rules="[requiredRule]"
                  required
                ></v-autocomplete>
              </v-col>
              <!-- dan toc -->
              <v-col cols="3">
                <v-text-field
                  v-model="formData.fethnic"
                  label="Dân tộc"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>
              <!-- quoc tich -->
              <v-col cols="3">
                <v-text-field
                  v-model="formData.fcitizenship"
                  label="Quốc tịch"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>
              <!-- chung minh -->
              <v-col cols="4">
                <v-text-field
                  v-model="formData.fidCard"
                  label="Số chứng minh thư"
                  :rules="[requiredRule]"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <!-- ngay cap -->
              <v-col cols="4">
                <v-text-field
                  v-model="formData.fdateOfIssue"
                  label="Ngày cấp"
                  :rules="[requiredRule]"
                  type="date"
                  required
                ></v-text-field>
              </v-col>
              <!-- noi cap -->
              <v-col cols="4">
                <v-text-field
                  v-model="formData.fplace"
                  label="Nơi cấp"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>
              <!-- noi dk khai sinh -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.fbirthCertificatePlace"
                  label="Nơi đăng ký khai sinh"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>
              <!-- tinh -->
              <v-col cols="4">
                <v-autocomplete
                  v-model="formData.fprovince"
                  :items="provinces"
                  label="Tỉnh/Thành Phố"
                  :rules="[requiredRule]"
                  required
                  item-text="name"
                  item-value="code"
                ></v-autocomplete>
              </v-col>
              <!-- huyen -->
              <v-col cols="4">
                <v-autocomplete
                  v-model="formData.fdistrict"
                  :items="districts"
                  label="Quận/Huyện"
                  :rules="[requiredRule]"
                  required
                  item-text="name"
                  item-value="code"
                ></v-autocomplete>
              </v-col>
              <!-- xa -->
              <v-col cols="4">
                <v-autocomplete
                  v-model="formData.fward"
                  :items="wards"
                  label="Phường/Xã"
                  :rules="[requiredRule]"
                  required
                  item-text="name"
                  item-value="code"
                ></v-autocomplete>
              </v-col>
              <!-- dia chi -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.faddress"
                  label="Địa chỉ"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>

          <!-- btn -->
          <v-btn class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            :disabled="!valid"
            class="mr-4"
            color="success"
            @click="addCus"
          >
            Thêm khách hàng
          </v-btn>
          <v-btn
            v-if="selectCustomer"
            :disabled="!valid"
            color="warning"
            @click="editCus"
          >
            Sửa
          </v-btn>
        </v-form>
      </div>
    </v-col>

    <!-- delete dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Xóa Khách Hàng </v-card-title>
        <v-card-text>
          Dữ liệu về khách và các thanh toán gia hạn trước đó sẽ bị xóa vĩnh
          viễn. Bạn thật sự muốn xóa?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelDialog">
            Trở lại
          </v-btn>
          <v-btn color="error" text @click="delCus"> Xóa </v-btn>
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
  name: 'CustomerPage',

  data() {
    return {
      // data
      provinces: [],
      districts: [],
      wards: [],
      dSKhachHang: [],
      formData: {
        fname: '',
        fbirth: '',
        fgender: '',
        fcitizenship: '',
        fethnic: '',
        fidCard: '',
        fdateOfIssue: '',
        fplace: '',
        fbirthCertificatePlace: '',
        fphone: '',
        femail: '',
        fprovince: '',
        fdistrict: '',
        fward: '',
        faddress: '',
        favatar: '',
      },
      search: '',
      headers: [
        {
          text: 'Họ và tên',
          align: 'center',
          sortable: true,
          value: 'name',
          width: '150px',
          divider: true,
        },
        {
          text: 'CMND',
          value: 'idCard',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Di động',
          align: 'center',
          sortable: false,
          value: 'phone',
          divider: true,
        },
        {
          text: 'Địa chỉ',
          value: 'address_custom',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Ảnh hồ sơ',
          value: 'avatar_custom',
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
      requiredRule: (v) => !!v || 'Không được bổ trống trường này',
      lengthRule: (v) => (v && v.length <= 10) || 'Số ký tự phải nhỏ hơn 10',
      emailRule: (v) => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ',

      // temp
      selectCustomer: null,

      // amination
      dialog: false,
      loading: false,
      error: '',
      snackbarFail: false,
      snackbarSuccess: false,
    }
  },

  computed: {
    getChoseTinh(ctx) {
      return ctx.formData.fprovince !== ''
        ? ctx.provinces.find((tinh) => tinh.code === ctx.formData.fprovince)
        : null
    },
    getChoseHuyen(ctx) {
      return ctx.formData.fdistrict !== ''
        ? ctx.districts.find((huyen) => huyen.code === ctx.formData.fdistrict)
        : null
    },
    getChoseXa(ctx) {
      return ctx.formData.fward !== ''
        ? ctx.wards.find((xa) => xa.code === ctx.formData.fward)
        : null
    },
    getAvatar(ctx) {
      return ctx.formData.favatar === ''
        ? 'https://res.cloudinary.com/bathanh-tech/image/upload/v1655478482/unknown-512_i4zumg.webp'
        : ctx.formData.favatar
    },
  },

  watch: {
    getChoseTinh(newVal, oldVal) {
      if (newVal) {
        this.districts = newVal.districts
      }
    },
    getChoseHuyen(newVal, oldVal) {
      if (newVal) {
        this.wards = newVal.wards
      }
    },
  },

  beforeCreate() {
    this.$axios.get('/address/getall').then((respone) => {
      try {
        this.provinces = respone.data.elements
      } catch (error) {
        this.provinces = []
      }
    })
    this.$axios.get('/cus/getall/1').then((respone) => {
      try {
        this.dSKhachHang = respone.data.elements.customers
      } catch (error) {
        this.dSKhachHang = []
      }
    })
  },

  methods: {
    onPickImg() {
      this.$refs.imgInput.click()
    },
    OnPickedImg(e) {
      const files = e.target.files
      for (let i = 0; i < files.length; i++) {
        const filename = files[i].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Tệp không hợp lệ')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.formData.favatar = fileReader.result
        })
        fileReader.readAsDataURL(files[i])
      }
    },
    clickRow(data) {
      this.formData = {
        fname: data.name,
        fbirth: new Date(data.birth).toISOString().substring(0, 10),
        fgender: data.gender,
        fcitizenship: data.citizenship,
        fethnic: data.ethnic,
        fidCard: data.idCard,
        fdateOfIssue: new Date(data.dateOfIssue).toISOString().substring(0, 10),
        fplace: data.place,
        fbirthCertificatePlace: data.birthCertificatePlace,
        fphone: data.phone,
        femail: data.email,
        fprovince: data.province.code,
        fdistrict: data.district.code,
        fward: data.ward.code,
        faddress: data.address,
        favatar: data.avatar.imgUrl,
      }
      this.selectCustomer = data
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fname = ''
      this.formData.fbirth = ''
      this.formData.fgender = ''
      this.formData.fcitizenship = ''
      this.formData.fethnic = ''
      this.formData.fidCard = ''
      this.formData.fdateOfIssue = ''
      this.formData.fplace = ''
      this.formData.fbirthCertificatePlace = ''
      this.formData.fphone = ''
      this.formData.femail = ''
      this.formData.fprovince = ''
      this.formData.fdistrict = ''
      this.formData.fward = ''
      this.formData.faddress = ''
      this.formData.favatar = ''
      this.selectCustomer = null
    },
    refreshData() {
      this.$axios.get('/cus/getall/1').then((respone) => {
        try {
          this.dSKhachHang = respone.data.elements.customers
        } catch (error) {
          this.dSKhachHang = []
        }
      })
    },
    deleteCusDialogOn(e, item) {
      this.dialog = true
      this.selectCustomer = item
    },
    closeDelDialog() {
      this.dialog = false
      this.reset()
    },
    async addCus(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          name: this.formData.fname,
          birth: this.formData.fbirth,
          gender: this.formData.fgender,
          citizenship: this.formData.fcitizenship,
          ethnic: this.formData.fethnic,
          idCard: this.formData.fidCard,
          dateOfIssue: this.formData.fdateOfIssue,
          place: this.formData.fplace,
          birthCertificatePlace: this.formData.fbirthCertificatePlace,
          phone: this.formData.fphone,
          email: this.formData.femail,
          province: {
            name: this.getChoseTinh.name,
            code: this.getChoseTinh.code,
          },
          district: {
            name: this.getChoseHuyen.name,
            code: this.getChoseHuyen.code,
          },
          ward: { name: this.getChoseXa.name, code: this.getChoseXa.code },
          address: this.formData.faddress,
          avatar: this.formData.favatar,
        }
        const result = await this.$axios.$post(
          'http://localhost:8080/cus/add',
          data
        )
        switch (result.status) {
          case 'OK':
            this.reset()
            this.loading = false
            this.refreshData()
            this.snackbarSuccess = true
            break
          case 409:
            this.error = 'Số chứng minh thư đã tồn tại'
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
    async editCus(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          _id: this.selectCustomer._id,
          name: this.formData.fname,
          birth: this.formData.fbirth,
          gender: this.formData.fgender,
          citizenship: this.formData.fcitizenship,
          ethnic: this.formData.fethnic,
          idCard: this.formData.fidCard,
          dateOfIssue: this.formData.fdateOfIssue,
          place: this.formData.fplace,
          birthCertificatePlace: this.formData.fbirthCertificatePlace,
          phone: this.formData.fphone,
          email: this.formData.femail,
          province: {
            name: this.getChoseTinh.name,
            code: this.getChoseTinh.code,
          },
          district: {
            name: this.getChoseHuyen.name,
            code: this.getChoseHuyen.code,
          },
          ward: { name: this.getChoseXa.name, code: this.getChoseXa.code },
          address: this.formData.faddress,
          avatar: this.formData.favatar,
        }
        const result = await this.$axios.$patch('/cus/edit', data)
        switch (result.status) {
          case 'OK':
            this.reset()
            this.loading = false
            this.refreshData()
            this.snackbarSuccess = true
            break
          case 409:
            this.error = 'Số chứng minh thư đã tồn tại'
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
    async delCus(e) {
      e.preventDefault()
      this.loading = true
      const result = await this.$axios.$delete(
        `/cus/delete?_id=${this.selectCustomer._id}`
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
