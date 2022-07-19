<template>
  <v-row>
    <!-- table -->
    <v-col cols="7" class="place_table">
      <div class="place_table--content">
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
            :items="accounts"
            :search="search"
            @click:row="clickRow"
          >
            <template #[`item.actions`]="{ item }">
              <v-icon small @click="deleteDialogOn($event, item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-col>
    <!-- info -->
    <v-col cols="5" class="text-center place_form">
      <div class="place_form--content">
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- form -->
          <v-container>
            <v-row>
              <!-- id -->
              <v-col cols="6">
                <v-text-field
                  v-model="formData.fid"
                  label="Tên đăng nhập"
                  :rules="idRules"
                  :disabled="selectAcc ? true : false"
                  required
                ></v-text-field>
              </v-col>
              <!-- email -->
              <v-col cols="6">
                <v-text-field
                  v-model="formData.femail"
                  label="Email"
                  :rules="[requiredRule, emailRule]"
                  :disabled="selectAcc ? true : false"
                  required
                ></v-text-field>
              </v-col>
              <!-- mat khau -->
              <v-col cols="6">
                <v-text-field
                  v-model="formData.fpassword"
                  :rules="passwordRules"
                  label="Mật khẩu"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  required
                  placeholder="Nhập mật khẩu..."
                  class="auth__form-input"
                  @click:append="show = !show"
                ></v-text-field>
              </v-col>
              <!-- nhap lai -->
              <v-col cols="6">
                <v-text-field
                  v-model="formData.frePassword"
                  :rules="[
                    ...passwordRules,
                    () =>
                      formData.frePassword === formData.fpassword ||
                      'Mật khẩu xác nhận không trùng khớp',
                  ]"
                  label="Xác nhận mật khẩu"
                  :append-icon="show_ ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show_ ? 'text' : 'password'"
                  required
                  placeholder="Nhập lại mật khẩu..."
                  class="auth__form-input"
                  @click:append="show_ = !show_"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>

          <!-- btn -->
          <v-btn class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="!selectAcc"
            :disabled="!valid"
            color="success"
            @click="addAcc"
          >
            Thêm tài khoản
          </v-btn>
          <v-btn
            v-if="selectAcc"
            class="mr-4"
            color="error"
            @click="deleteDialogOn"
          >
            Xóa
          </v-btn>
          <v-btn
            v-if="selectAcc"
            :disabled="!valid"
            color="warning"
            @click="editAcc"
          >
            Sửa
          </v-btn>
        </v-form>
      </div>
    </v-col>
    <!-- delete dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Xóa tài khoản </v-card-title>
        <v-card-text> Bạn thật sự muốn xóa? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelDialog">
            Trở lại
          </v-btn>
          <v-btn color="error" text @click="delAcc"> Xóa </v-btn>
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
      accounts: [],
      formData: {
        fid: '',
        fpassword: '',
        frePassword: '',
        femail: '',
      },
      search: '',
      headers: [
        {
          text: '_id',
          align: 'center',
          sortable: true,
          value: '_id',
          width: '150px',
          divider: true,
        },
        {
          text: 'ID',
          value: 'id',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Email',
          align: 'center',
          value: 'email',
          sortable: false,
          divider: true,
        },
        {
          text: 'Ngày tạo',
          align: 'center',
          value: 'createdAt',
          sortable: false,
          divider: true,
        },
        {
          text: 'Cập nhật lần cuối',
          align: 'center',
          value: 'updatedAt',
          sortable: false,
        },
      ],
      dialog: false,

      // validate form
      valid: true,
      show: false,
      show_: false,
      idRules: [
        (v) => !!v || 'Không được bỏ trống ô này',
        (v) =>
          (v && v.length >= 4 && v.length < 12) ||
          'Số ký tự lớn hơn bằng 4 và nhỏ hơn 12',
      ],
      passwordRules: [
        (v) => !!v || 'Không được bỏ trống ô này',
        (v) =>
          (v && v.length >= 6 && v.length < 18) ||
          'Số ký tự lớn hơn bằng 6 và nhỏ hơn 18',
      ],
      requiredRule: (v) => !!v || 'Không được bổ trống trường này',
      lengthRule: (v) => (v && v.length <= 10) || 'Số ký tự phải nhỏ hơn 10',
      emailRule: (v) => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ',

      // amination
      loading: false,
      error: '',
      snackbarFail: false,
      snackbarSuccess: false,

      // temp
      selectAcc: null,
    }
  },

  computed: {},

  beforeCreate() {
    this.$axios.get('/admin/getall').then((respone) => {
      try {
        this.accounts = respone.data.elements
      } catch (error) {
        this.accounts = []
      }
    })
  },

  methods: {
    clickRow(data) {
      this.formData = {
        fid: data.id,
        fpassword: '',
        frePassword: '',
        femail: data.email,
      }
      this.selectAcc = data
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fid = ''
      this.formData.fpassword = ''
      this.formData.frePassword = ''
      this.formData.femail = ''
      this.selectAcc = null
    },
    // to do
    refreshData() {
      this.$axios.get('/admin/getall').then((respone) => {
        try {
          this.accounts = respone.data.elements
        } catch (error) {
          this.accounts = []
        }
      })
    },
    deleteDialogOn() {
      this.dialog = true
    },
    closeDelDialog() {
      this.dialog = false
      this.reset()
    },
    async addAcc(e) {
      e.preventDefault()
      this.loading = true
      if (this.$refs.form.validate()) {
        const data = {
          id: this.formData.fid,
          email: this.formData.femail,
          password: this.formData.fpassword,
        }
        const result = await this.$axios.$post(
          'http://localhost:8080/admin/add',
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
            this.error = 'Tên đăng nhập đã tồn tại'
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
    async editAcc(e) {
      e.preventDefault()
      this.loading = true
      if (this.$refs.form.validate()) {
        const data = {
          _id: this.selectAcc._id,
          password: this.formData.fpassword,
        }
        const result = await this.$axios.$patch(
          'http://localhost:8080/admin/edit',
          data
        )
        switch (result.status) {
          case 'OK':
            this.reset()
            this.loading = false
            this.refreshData()
            this.snackbarSuccess = true
            break
          case 403:
            this.error = 'Không đủ quyền hạn'
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
    async delAcc(e) {
      e.preventDefault()
      this.loading = true
      const result = await this.$axios.$delete(
        `http://localhost:8080/admin/delete?_id=${this.selectAcc._id}`
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
