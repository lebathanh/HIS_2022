<template>
  <v-row>
    <!-- table -->
    <v-col cols="7" class="group_table">
      <div class="group_table--content">
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
            :items="groups"
            :search="search"
            @click:row="clickRow"
          >
            <template #[`item.actions`]="{ item }">
              <v-icon small @click="deleteDialogOn($event, item)">
                mdi-delete
              </v-icon>
            </template>
            <!-- members_custom -->
            <template #[`item.members_custom`]="{ item }">
              <v-chip>
                {{ item.members.length }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-col>
    <!-- info -->
    <v-col cols="5" class="text-center group_form">
      <div class="group_form--content">
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- form -->
          <v-container>
            <v-row>
              <!-- ten -->
              <v-col cols="8">
                <v-text-field
                  v-model="formData.fname"
                  label="Tên nhóm"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>
              <!-- hinh thuc -->
              <v-col cols="4">
                <v-select
                  v-model="formData.fjoinType"
                  label="Hình thức tham gia"
                  :items="joinTypes"
                  :rules="[requiredRule]"
                  required
                ></v-select>
              </v-col>
              <!-- thanh vien -->
              <v-col cols="12">
                <v-autocomplete
                  v-model="formData.fmembers"
                  :disabled="isUpdating"
                  :items="customers"
                  chips
                  label="Thành viên"
                  item-text="name"
                  item-value="_id"
                  multiple
                >
                  <template #selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      close
                      @click="data.select"
                      @click:close="remove(data.item)"
                    >
                      <v-avatar left>
                        <v-img :src="data.item.avatar.imgUrl"></v-img>
                      </v-avatar>
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                  <template #item="data">
                    <v-list-item-avatar>
                      <img :src="data.item.avatar.imgUrl" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ data.item.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ data.item.idCard }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>

          <!-- btn -->
          <v-btn v-if="!selectGroup" class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="!selectGroup"
            :disabled="!valid"
            color="success"
            @click="addGroup"
          >
            Thêm nhóm khách hàng
          </v-btn>
          <v-btn v-if="selectGroup" class="mr-4" @click="reset"> Hủy </v-btn>
          <v-btn
            v-if="selectGroup"
            :disabled="!valid"
            color="warning"
            @click="editGroup"
          >
            Sửa
          </v-btn>
        </v-form>
      </div>
    </v-col>

    <!-- delete dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Xóa nhóm khách hàng </v-card-title>
        <v-card-text>
          Dữ liệu về nhóm khách hàng sẽ bị xóa vĩnh viễn. Bạn thật sự muốn xóa?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelDialog">
            Trở lại
          </v-btn>
          <v-btn color="error" text @click="delGroup"> Xóa </v-btn>
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
  name: 'GroupPage',

  data() {
    return {
      // data
      joinTypes: ['GD', 'DN'],
      customers: [],
      groups: [],
      formData: {
        fname: '',
        fmembers: [],
        fjoinType: '',
      },
      search: '',
      headers: [
        {
          text: 'Tên nhóm',
          align: 'center',
          sortable: true,
          value: 'name',
          divider: true,
        },
        {
          text: 'Hình thức tham gia',
          value: 'joinType',
          align: 'center',
          sortable: false,
          divider: true,
        },
        {
          text: 'Thành viên',
          align: 'center',
          sortable: false,
          value: 'members_custom',
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
      isUpdating: false,
      valid: true,
      requiredRule: (v) => !!v || 'Không được bổ trống trường này',
      lengthRule: (v) => (v && v.length <= 10) || 'Số ký tự phải nhỏ hơn 10',
      emailRule: (v) => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ',

      // temp
      selectGroup: null,

      // amination
      dialog: false,
      loading: false,
      error: '',
      snackbarFail: false,
      snackbarSuccess: false,
    }
  },

  computed: {},

  watch: {},

  beforeCreate() {
    this.$axios.get('/cus/getall/1').then((respone) => {
      try {
        this.customers = respone.data.elements.customers
      } catch (error) {
        this.customers = []
      }
    })
    this.$axios.get('/cusgs/getall/1').then((respone) => {
      try {
        this.groups = respone.data.elements.groups
      } catch (error) {
        this.groups = []
      }
    })
  },

  methods: {
    remove(item) {
      const index = this.formData.fmembers.indexOf(item._id)
      if (index >= 0) this.formData.fmembers.splice(index, 1)
    },
    clickRow(data) {
      this.formData = {
        fname: data.name,
        fmembers: data.members.map((m) => m._id),
        fjoinType: data.joinType,
      }
      this.selectGroup = data
    },
    reset() {
      this.$refs.form.reset()
      this.formData.fname = ''
      this.formData.fmembers = []
      this.formData.fjoinType = ''
      this.selectGroup = null
    },
    refreshData() {
      this.$axios.get('/cusgs/getall/1').then((respone) => {
        try {
          this.groups = respone.data.elements.groups
        } catch (error) {
          this.groups = []
        }
      })
    },
    deleteDialogOn(e, item) {
      this.dialog = true
      this.selectGroup = item
    },
    closeDelDialog() {
      this.dialog = false
      this.reset()
    },
    async addGroup(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          name: this.formData.fname,
          members: this.formData.fmembers,
          joinType: this.formData.fjoinType,
        }
        const result = await this.$axios.$post('/cusgs/add', data)
        switch (result.status) {
          case 'OK':
            this.reset()
            this.loading = false
            this.refreshData()
            this.snackbarSuccess = true
            break
          case 409:
            this.error = 'Nhóm đã tồn tại'
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
    async editGroup(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          _id: this.selectGroup._id,
          name: this.formData.fname,
          members: this.formData.fmembers,
          joinType: this.formData.fjoinType,
        }
        const result = await this.$axios.$patch('/cusgs/edit', data)
        switch (result.status) {
          case 'OK':
            this.reset()
            this.loading = false
            this.refreshData()
            this.snackbarSuccess = true
            break
          case 409:
            this.error = 'Nhóm đã tồn tại'
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
    async delGroup(e) {
      e.preventDefault()
      this.loading = true
      const result = await this.$axios.$delete(
        `/cusgs/delete?_id=${this.selectGroup._id}`
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
