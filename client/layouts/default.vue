<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="$auth.user.isSuper" to="account">
          <v-list-item-action>
            <v-icon>mdi-account-key</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="`Tài khoản`" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logOut">
          <v-list-item-action>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="`Đăng xuất`" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>KHÓA LUẬN TỐT NGHIỆP - {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  middleware: 'auth-user',
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Trang chủ',
          to: '/',
        },
        {
          icon: 'mdi-account-details',
          title: 'Khách hàng',
          to: '/customer',
        },
        {
          icon: 'mdi-account-group',
          title: 'Nhóm khách hàng',
          to: '/group',
        },
        {
          icon: 'mdi-card-account-details',
          title: 'Thẻ bảo hiểm',
          to: '/card',
        },
        {
          icon: 'mdi-account-heart',
          title: 'Khám chữa bệnh',
          to: '/therapy',
        },
        {
          icon: 'mdi-hospital-box',
          title: 'Y tế',
          to: 'medical',
        },
        {
          icon: 'mdi-chart-pie',
          title: 'Phân lớp',
          to: 'classify',
        },
        {
          icon: 'mdi-ballot',
          title: 'Thống kê - quyết toán',
          to: '/data',
        },
      ],
      miniVariant: false,
      right: true,
      title: 'QUẢN LÝ KHÁM CHỮA BỆNH BẰNG BẢO HIỂM Y TẾ CHO DOANH NGHIỆP',
    }
  },

  beforeCreate() {},

  methods: {
    async logOut() {
      await this.$auth.logout()
      this.$router.push('/auth/login')
    },
  },
}
</script>
