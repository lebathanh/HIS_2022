<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6" class="auth">
      <v-form ref="form" v-model="valid" lazy-validation class="auth__form">
        <v-avatar size="150" class="auth__form-avatar">
          <img src="@/assets/images/avatar.png" alt="" srcset="" />
        </v-avatar>

        <h2 class="auth__form-header">ĐĂNG NHẬP</h2>

        <v-text-field
          v-model="id"
          :rules="idRules"
          label="Tên đăng nhập"
          required
          placeholder="Nhập tên đăng nhập..."
          class="auth__form-input"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Mật khẩu"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          required
          placeholder="Nhập mật khẩu..."
          class="auth__form-input"
          @click:append="show = !show"
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          :loading="loading"
          color="primary"
          block
          rounded
          type="submit"
          class="auth__form-btn"
          @click="validate"
        >
          ĐĂNG NHẬP
        </v-btn>

        <v-snackbar v-model="snackbarFail" color="error" outlined>
          {{ error }}
          <template #action="{ attrs }">
            <v-btn
              color="red"
              text
              v-bind="attrs"
              @click="snackbarFail = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <div class="auth__form-link">
          <span @click="$router.push('/auth/forgot')">Quên mật khẩu</span>
        </div>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'auth',

  data() {
    return {
      show: false,
      error: '',
      loading: false,
      valid: true,
      snackbarFail: false,
      id: '',
      idRules: [
        (v) => !!v || 'Không được bỏ trống ô này',
        (v) =>
          (v && v.length >= 4 && v.length < 12) ||
          'Số ký tự lớn hơn bằng 4 và nhỏ hơn 12',
      ],
      password: '',
      passwordRules: [
        (v) => !!v || 'Không được bỏ trống ô này',
        (v) =>
          (v && v.length >= 6 && v.length < 18) ||
          'Số ký tự lớn hơn bằng 6 và nhỏ hơn 18',
      ],
    }
  },

  methods: {
    async validate(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const result = await this.$auth.loginWith('local', {
            data: {
              id: this.id,
              password: this.password,
            },
          })
          switch (result.data.status) {
            case 400:
              this.loading = false
              this.error = 'Sai mật khẩu!'
              this.snackbarFail = true
              break
            case 404:
              this.loading = false
              this.error = 'Tài khoản không tồn tại'
              this.snackbarFail = true
              break
            case 'OK':
              this.loading = false
              this.error = ''
              this.snackbarFail = false
              break
            default:
              this.loading = false
              this.error = 'Lỗi server'
              this.snackbarFail = true
              break
          }
        } catch (error) {
          this.loading = false
          this.error = 'Server error!'
          this.snackbarFail = true
          // eslint-disable-next-line no-console
          console.log(error)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/layouts/auth.scss';
</style>
