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
            :items="places"
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
              <!-- ma nss -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.fid"
                  label="Mã nơi sinh sống"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>
              <!-- dac ta -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.fdescriptions"
                  label="Đặc tả"
                  :rules="[requiredRule]"
                  auto-grow
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>

          <!-- btn -->
          <v-btn v-if="!selectPlace" class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="!selectPlace"
            :disabled="!valid"
            color="success"
            @click="addPlace"
          >
            Thêm nơi sinh sống
          </v-btn>
          <v-btn v-if="selectPlace" class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="selectPlace"
            :disabled="!valid"
            color="warning"
            @click="editPlace"
          >
            Sửa
          </v-btn>
        </v-form>
      </div>
    </v-col>
    <!-- delete dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Xóa NSS </v-card-title>
        <v-card-text>
          Dữ liệu về nơi sinh sống này sẽ bị xóa vĩnh viễn. Bạn thật sự muốn
          xóa?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelDialog">
            Trở lại
          </v-btn>
          <v-btn color="error" text @click="delPlace"> Xóa </v-btn>
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
      places: [],
      formData: {
        fid: '',
        fdescriptions: '',
      },
      search: '',
      headers: [
        {
          text: 'Mã NSS',
          align: 'center',
          sortable: true,
          value: 'id',
          width: '150px',
          divider: true,
        },
        {
          text: 'Đặc tả',
          value: 'descriptions',
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
      dialog: false,

      // validate form
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
      selectPlace: null,
    }
  },

  computed: {},

  watch: {},

  beforeCreate() {
    this.$axios.get('/places/getall').then((respone) => {
      try {
        this.places = respone.data.elements.Places
      } catch (error) {
        this.places = []
      }
    })
  },

  methods: {
    clickRow(data) {
      this.formData = {
        fid: data.id,
        fdescriptions: data.descriptions,
      }
      this.selectPlace = data
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fid = ''
      this.formData.fdescriptions = ''
      this.selectPlace = null
    },
    // to do
    refreshData() {
      this.$axios.get('/places/getall').then((respone) => {
        try {
          this.places = respone.data.elements.Places
        } catch (error) {
          this.places = []
        }
      })
    },
    deleteDialogOn(e, item) {
      this.dialog = true
      this.selectPlace = item
    },
    closeDelDialog() {
      this.dialog = false
      this.reset()
    },
    async addPlace(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          id: this.formData.fid,
          descriptions: this.formData.fdescriptions,
        }
        const result = await this.$axios.$post('/places/add', data)
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
            this.error = 'Mã NSS đã tồn tại'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async editPlace(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          _id: this.selectPlace._id,
          id: this.formData.fid,
          descriptions: this.formData.fdescriptions,
        }
        const result = await this.$axios.$patch('/places/edit', data)
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
            this.error = 'Mã NSS đã tồn tại'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async delPlace(e) {
      e.preventDefault()
      this.loading = true
      const result = await this.$axios.$delete(
        `/places/delete?_id=${this.selectPlace._id}`
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
