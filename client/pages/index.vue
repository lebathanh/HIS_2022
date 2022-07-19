<template>
  <v-row justify="center" class="text-center">
    <v-col cols="12" class="statis">
      <!-- khanh hang -->
      <div class="statis--item">
        <div class="statis--item__">
          <v-icon class="statis--item__icon">mdi-account-details</v-icon>
          <b class="statis--item__txt">Khách hàng</b>
        </div>
        <span class="statis--item__quantity">{{ customers.length }}</span>
      </div>
      <!-- nhom khach hang -->
      <div class="statis--item">
        <div class="statis--item__">
          <v-icon class="statis--item__icon">mdi-account-group</v-icon>
          <b class="statis--item__txt">Nhóm khách hàng</b>
        </div>
        <span class="statis--item__quantity">{{ groups.length }}</span>
      </div>
      <!-- bao hiem -->
      <div class="statis--item">
        <div class="statis--item__">
          <v-icon class="statis--item__icon">mdi-card-account-details</v-icon>
          <b class="statis--item__txt">Bảo hiểm</b>
        </div>
        <span class="statis--item__quantity">{{ cards.length }}</span>
      </div>
      <!-- CSYT -->
      <div class="statis--item">
        <div class="statis--item__">
          <v-icon class="statis--item__icon">mdi-hospital-box</v-icon>
          <b class="statis--item__txt">Cơ sở y tế</b>
        </div>
        <span class="statis--item__quantity">{{ mFs.length }}</span>
      </div>
      <!-- luot kham -->
      <div class="statis--item">
        <div class="statis--item__">
          <v-icon class="statis--item__icon">mdi-account-heart</v-icon>
          <b class="statis--item__txt">Lượt khám</b>
        </div>
        <span class="statis--item__quantity">{{ therapies.length }}</span>
      </div>
    </v-col>
    <v-col cols="6">
      <v-card class="mx-auto text-center" color="gray" dark>
        <v-card-text>
          <h3><b>KHÁM CHỮA BỆNH TRONG NĂM</b></h3>
          <v-sheet>
            <v-sparkline
              :value="value"
              :gradient="['#f72047', '#ffd200', '#1feaea']"
              smooth="10"
              padding="8"
              line-width="2"
              stroke-linecap="round"
              gradient-direction="top"
              :fill="false"
              type="trend"
              :auto-line-width="false"
              auto-draw
            >
              <template #label="item"> {{ item.value }} </template>
            </v-sparkline>
          </v-sheet>
        </v-card-text>
      </v-card>
      <v-carousel
        cycle
        class="mt-8"
        hide-delimiter-background
        show-arrows-on-hover
        height="300px"
      >
        <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src">
        </v-carousel-item>
      </v-carousel>
    </v-col>
    <v-col cols="6">
      <v-btn color="primary" large block @click="$router.push(`/bill`)"
        >Quản lý khách hàng</v-btn
      >
      <v-btn
        color="primary"
        class="mt-9"
        large
        block
        @click="$router.push(`/bill`)"
        >Quản lý nhóm khách hàng</v-btn
      >
      <v-btn
        color="primary"
        class="mt-9"
        large
        block
        @click="$router.push(`/bill`)"
        >Quản lý bảo hiểm</v-btn
      >
      <v-btn
        color="primary"
        class="mt-9"
        large
        block
        @click="$router.push(`/bill`)"
        >Quản lý khám chữa bệnh</v-btn
      >
      <v-btn
        color="primary"
        class="mt-9"
        large
        block
        @click="$router.push(`/bill`)"
        >Quản lý cơ sở y tế - vật tư y tế</v-btn
      >
      <v-btn
        color="primary"
        class="mt-9"
        large
        block
        @click="$router.push(`/bill`)"
        >Quản lý nơi sinh sống - đối tượng - mức hưởng</v-btn
      >
      <v-btn
        color="primary"
        class="mt-9"
        large
        block
        @click="$router.push(`/bill`)"
        >Quản lý thống kê - quyết toán</v-btn
      >
      <v-btn
        color="primary"
        class="mt-9"
        large
        block
        @click="$router.push(`/bill`)"
        >Quản lý tài khoản</v-btn
      >
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',

  data() {
    return {
      value: [4, 3, 1, 1, 2, 2],
      items: [
        {
          src: 'https://congthuong.vn/stores/news_dataimages/hoaquynh/052021/31/18/in_article/5707_bhso.jpg?rt=20210531185708',
        },
        {
          src: 'https://baohiemxahoi.gov.vn:4545/pic/02-BHYT/VssID_20210531043756PM.png',
        },
        {
          src: 'https://ebh.vn/Content/Clients/bhxh.png',
        },
      ],
      cards: [],
      customers: [],
      mFs: [],
      therapies: [],
      groups: [],
    }
  },

  computed: {
    getTherapiesChart(ctx) {
      const a = ctx.therapies
        .map((t) => new Date(t.time).getMonth())
        .reduce(function (acc, curr) {
          if (typeof acc[curr] === 'undefined') {
            acc[curr] = 1
          } else {
            acc[curr] += 1
          }

          return acc
        }, {})
      return Object.values(a)
    },
  },

  beforeCreate() {
    this.$axios.get('/therapy/getall').then((respone) => {
      try {
        this.therapies = respone.data.elements.Therapies
      } catch (error) {
        this.therapies = []
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
        this.mFs = respone.data.elements.MedicalFs
      } catch (error) {
        this.mFs = []
      }
    })
    this.$axios.get('/cusgs/getall/1').then((respone) => {
      try {
        this.groups = respone.data.elements.groups
      } catch (error) {
        this.groups = []
      }
    })
    // this.$axios.get('/statis/getall').then((respone) => {
    //   try {
    //     this.statis = respone.data.elements.Statises
    //   } catch (error) {
    //     this.statis = []
    //   }
    // })
  },
}
</script>

<style lang="scss" scoped>
.statis {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  &--item {
    background-color: gray;
    width: 16%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 12px;
    &__ {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      &icon {
        font-size: 80px;
      }
      &txt {
        font-size: 20px;
        text-transform: uppercase;
      }
    }
    &__quantity {
      font-size: 28px;
    }
  }
}
</style>
