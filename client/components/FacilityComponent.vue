<template>
  <v-row>
    <!-- table -->
    <v-col cols="7" class="facility_table">
      <div class="facility_table--content">
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
            :items="facilities"
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
    <v-col cols="5" class="text-center facility_form">
      <div class="facility_form--content">
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- form -->
          <v-container>
            <v-row>
              <!-- ma nss -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.fname"
                  label="Tên cơ sở"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>
              <!-- dac ta -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.faddress"
                  label="Địa chỉ"
                  :rules="[requiredRule]"
                  auto-grow
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>

          <!-- btn -->
          <v-btn v-if="!selectFacility" class="mr-4" @click="reset">
            Hủy
          </v-btn>
          <v-btn
            v-if="!selectFacility"
            :disabled="!valid"
            color="success"
            @click="addFacility"
          >
            Thêm cơ sở y tế
          </v-btn>
          <v-btn v-if="selectFacility" class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="selectFacility"
            :disabled="!valid"
            color="warning"
            @click="editFacility"
          >
            Sửa
          </v-btn>
        </v-form>
      </div>
    </v-col>
    <!-- delete dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Xóa CSYT </v-card-title>
        <v-card-text>
          Dữ liệu về cơ sở này và các thông tin liên quan trước đó bao gồm danh
          sách KCB và TK-QT trước đó sẽ bị xóa vĩnh viễn. Bạn thật sự muốn xóa?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelDialog">
            Trở lại
          </v-btn>
          <v-btn color="error" text @click="delFacility"> Xóa </v-btn>
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
      facilities: [],
      formData: {
        fname: '',
        faddress: '',
      },
      search: '',
      headers: [
        {
          text: 'Tên cơ sở',
          align: 'center',
          sortable: true,
          value: 'name',
          divider: true,
        },
        {
          text: 'Địa chỉ',
          value: 'address',
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
      selectFacility: null,
    }
  },

  computed: {},

  watch: {},

  beforeCreate() {
    this.$axios.get('/mfs/getall').then((respone) => {
      try {
        this.facilities = respone.data.elements.MedicalFs
      } catch (error) {
        this.facilities = []
      }
    })
  },

  methods: {
    clickRow(data) {
      this.formData = {
        fname: data.name,
        faddress: data.address,
      }
      this.selectFacility = data
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fname = ''
      this.formData.faddress = ''
      this.selectFacility = null
    },
    refreshData() {
      this.$axios.get('/mfs/getall').then((respone) => {
        try {
          this.facilities = respone.data.elements.MedicalFs
        } catch (error) {
          this.facilities = []
        }
      })
    },
    deleteDialogOn(e, item) {
      this.dialog = true
      this.selectFacility = item
    },
    closeDelDialog() {
      this.dialog = false
      this.reset()
    },
    async addFacility(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          name: this.formData.fname,
          address: this.formData.faddress,
        }
        const result = await this.$axios.$post('/mfs/add', data)
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
            this.error = 'Cơ sở đã tồn tại'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async editFacility(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          _id: this.selectFacility._id,
          name: this.formData.fname,
          address: this.formData.faddress,
        }
        const result = await this.$axios.$patch('/mfs/edit', data)
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
            this.error = 'Cơ sở đã tồn tại'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async delFacility(e) {
      e.preventDefault()
      this.loading = true
      const result = await this.$axios.$delete(
        `/mfs/delete?_id=${this.selectFacility._id}`
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
