<template>
  <v-row justify="center" align="center" class="auth">
    <v-col cols="12" sm="8" md="6">
      <v-form ref="form" v-model="valid" lazy-validation class="auth__form">
        <v-avatar size="150" class="auth__form-avatar">
          <img src="@/assets/images/avatar.png" alt="" srcset="" />
        </v-avatar>

        <h2 class="auth__form-header">Cập nhật mật khẩu</h2>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Mật khẩu mới"
          required
          placeholder="Nhập mật khẩu mới..."
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          class="auth__form-input"
          @click:append="show = !show"
        ></v-text-field>

        <v-text-field
          v-model="repassword"
          :rules="[passwordRules, () => repassword === password || 'Mật khẩu xác nhận không trùng khớp']"
          label="Xác nhận mật khẩu"
          required
          placeholder="Nhập lại mật khẩu mới..."
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          class="auth__form-input"
          @click:append="show = !show"
        ></v-text-field>

        <v-btn :disabled="!valid" :loading="loading" color="primary" block rounded type="submit" class="auth__form-btn" @click="validate">
          Lưu thay đổi
        </v-btn>

        <div class="auth__form-link">
          <span @click="$router.push('/auth/login')">Về trang đăng nhập</span>
        </div>
      </v-form>

      <v-snackbar v-model="snackbarSuccess" color="success" outlined>
        Cập nhật mật khẩu thành công! Quay lại trang đăng nhập tự động sau 3s.
        <template #action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbarSuccess = false"> Close </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="snackbarFail" color="error" outlined>
        Liên kết quá hạn!
        <template #action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ResetPage',
  layout: 'auth',

  data() {
    return {
      show: false,
      error: '',
      loading: false,
      valid: true,
      snackbarFail: false,
      snackbarSuccess: false,
      password: '',
      repassword: '',
      passwordRules: [
        (v) => !!v || 'Không được bỏ trống ô này',
        (v) => (v && v.length >= 6 && v.length < 18) || 'Số ký tự lớn hơn bằng 6 và nhỏ hơn 18',
      ],
    }
  },

  methods: {
    async validate(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const result = await this.$axios.$patch(
            '/admin/reset',
            {
              password: this.password,
            },
            {
              headers: {
                Authorization: 'Bearer ' + this.$route.params.id,
              },
            }
          )
          if (result.status === 'OK') {
            this.loading = false
            this.snackbarSuccess = true
            setTimeout(() => {
              this.$router.push('/auth/login')
            }, 3000)
          } else {
            this.loading = false
            this.snackbarFail = true
          }
        } catch (error) {
          this.success = false
          this.snackbarFail = true
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/layouts/auth.scss';
</style>
