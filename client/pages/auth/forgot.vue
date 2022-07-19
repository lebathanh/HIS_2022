<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6" class="auth">
      <v-form ref="form" v-model="valid" lazy-validation class="auth__form">
        <v-avatar size="150" class="auth__form-avatar">
          <img src="@/assets/images/avatar.png" alt="" srcset="" />
        </v-avatar>

        <h2 class="auth__form-header">Quên mật khẩu</h2>

        <v-text-field
          v-model="id"
          :rules="idRules"
          label="Tên đăng nhập"
          required
          placeholder="Nhập tên đăng nhập..."
          class="auth__form-input"
        ></v-text-field>

        <v-text-field v-model="email" :rules="emailRules" label="E-mail" required placeholder="Nhập email..." class="auth__form-input"></v-text-field>

        <v-btn color="primary" block rounded type="submit" class="auth__form-btn" @click="validate"> Gửi </v-btn>

        <div class="auth__form-link">
          <span @click="$router.push('/auth/login')">Quay về trang đăng nhập</span>
        </div>

        <v-snackbar v-model="snackbarSuccess" color="success" outlined>
          Email đã được gửi, vui lòng kiểm tra hộp thư của bạn!
          <template #action="{ attrs }">
            <v-btn color="red" text v-bind="attrs" @click="snackbarSuccess = false"> Close </v-btn>
          </template>
        </v-snackbar>
        <v-snackbar v-model="snackbarFail" color="error" outlined>
          {{ error }}
          <template #action="{ attrs }">
            <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
          </template>
        </v-snackbar>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ForgotPage',
  layout: 'auth',

  data() {
    return {
      show: false,
      valid: true,
      loading: false,
      snackbarFail: false,
      snackbarSuccess: false,
      error: '',
      id: '',
      idRules: [(v) => !!v || 'Không được bỏ trống ô này', (v) => (v && v.length >= 4 && v.length < 12) || 'Số ký tự lớn hơn bằng 4 và nhỏ hơn 12'],
      email: '',
      emailRules: [(v) => !!v || 'Không được bỏ trống ô này', (v) => /.+@.+\..+/.test(v) || 'Email không hợp lệ'],
    }
  },

  methods: {
    async validate(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const result = await this.$axios.$post('/admin/forgot', {
          id: this.id,
          email: this.email,
        })
        // eslint-disable-next-line no-console
        console.log(result)
        if (result.status === 'OK') {
          this.loading = false
          this.error = ''
          this.snackbarSuccess = true
        } else {
          switch (result.status) {
            case 400:
              this.error = 'Email không chính xác!'
              this.loading = false
              this.snackbarFail = true
              break
            case 401:
              this.error = 'Chức năng này chỉ dành cho quản lý cấp cao!'
              this.loading = false
              this.snackbarFail = true
              break
            default:
              this.error = 'Lỗi Server'
              this.loading = false
              this.snackbarFail = true
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/layouts/auth.scss';
</style>
