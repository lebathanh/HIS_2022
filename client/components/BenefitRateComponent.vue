<template>
  <v-row>
    <!-- table -->
    <v-col cols="7" class="brs_table">
      <div class="brs_table--content">
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
            :items="brs"
            :search="search"
            @click:row="clickRow"
          >
            <template #[`item.actions`]="{ item }">
              <v-icon small @click="deleteDialogOn($event, item)">
                mdi-delete
              </v-icon>
            </template>
            <template #[`item.reobjs`]="{ item }">
              <v-chip>
                {{ item.objs.length }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-col>
    <!-- info -->
    <v-col cols="5" class="text-center brs_form">
      <div class="brs_form--content">
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- form -->
          <v-container>
            <v-row>
              <!-- ma mh -->
              <v-col cols="8">
                <v-text-field
                  v-model="formData.fid"
                  label="Mã mức hưởng"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>
              <!-- mh -->
              <v-col cols="4">
                <v-text-field
                  v-model="formData.frates"
                  label="Mức hưởng"
                  :rules="[requiredRule]"
                  type="number"
                  min="0"
                  step="0.05"
                  max="1"
                  required
                ></v-text-field>
              </v-col>
              <!-- doi tuong -->
              <v-col cols="12">
                <v-autocomplete
                  v-model="formData.fobjs"
                  :items="objects"
                  chips
                  item-text="id"
                  item-value="_id"
                  small-chips
                  label="Đối tượng"
                  multiple
                ></v-autocomplete>
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
          <v-btn v-if="!selectBrs" class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="!selectBrs"
            :disabled="!valid"
            color="success"
            @click="addBrs"
          >
            Thêm mức hưởng
          </v-btn>
          <v-btn v-if="selectBrs" class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="selectBrs"
            :disabled="!valid"
            color="warning"
            @click="editBrs"
          >
            Sửa
          </v-btn>
        </v-form>
      </div>
    </v-col>
    <!-- delete dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Xóa mức hưởng </v-card-title>
        <v-card-text>
          Dữ liệu về mức hưởng này sẽ bị xóa vĩnh viễn. Bạn thật sự muốn xóa?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelDialog">
            Trở lại
          </v-btn>
          <v-btn color="error" text @click="delBrs"> Xóa </v-btn>
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
      brs: [],
      objects: [],
      formData: {
        fid: '',
        frates: '',
        fobjs: [],
        fdescriptions: '',
      },
      search: '',
      headers: [
        {
          text: 'Mã mức hưởng',
          align: 'center',
          sortable: true,
          value: 'id',
          width: '150px',
          divider: true,
        },
        {
          text: 'Mức hưởng',
          value: 'rates',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Đối tượng hưởng',
          value: 'reobjs',
          align: 'center',
          sortable: false,
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
      selectBrs: null,
    }
  },

  computed: {},

  watch: {},

  beforeCreate() {
    this.$axios.get('/brs/getall').then((respone) => {
      try {
        this.brs = respone.data.elements.bRs
      } catch (error) {
        this.brs = []
      }
    })
    this.$axios.get('/obj/getall').then((respone) => {
      try {
        this.objects = respone.data.elements.Objects
      } catch (error) {
        this.objects = []
      }
    })
  },

  methods: {
    clickRow(data) {
      this.formData = {
        fid: data.id,
        frates: data.rates,
        fobjs: data.objs.map((o) => o._id),
        fdescriptions: data.descriptions,
      }
      this.selectBrs = data
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fid = ''
      this.formData.frates = ''
      this.formData.fobjs = []
      this.formData.fdescriptions = ''
      this.selectBrs = null
    },
    refreshData() {
      this.$axios.get('/brs/getall').then((respone) => {
        try {
          this.brs = respone.data.elements.bRs
        } catch (error) {
          this.brs = []
        }
      })
    },
    deleteDialogOn(e, item) {
      this.dialog = true
      this.selectBrs = item
    },
    closeDelDialog() {
      this.dialog = false
      this.reset()
    },
    async addBrs(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          id: this.formData.fid,
          rates: this.formData.frates,
          objs: this.formData.fobjs,
          descriptions: this.formData.fdescriptions,
        }
        const result = await this.$axios.$post('/brs/add', data)
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
            this.error = 'Mã mức hưởng đã tồn tại'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async editBrs(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          _id: this.selectBrs._id,
          id: this.formData.fid,
          rates: this.formData.frates,
          objs: this.formData.fobjs,
          descriptions: this.formData.fdescriptions,
        }
        const result = await this.$axios.$patch('/brs/edit', data)
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
            this.error = 'Mã đối tượng đã tồn tại'
            this.snackbarFail = true
            break
          default:
            this.error = 'Lỗi không xác định vui lòng thử lại sau'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
    async delBrs(e) {
      e.preventDefault()
      this.loading = true
      const result = await this.$axios.$delete(
        `/brs/delete?_id=${this.selectBrs._id}`
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
