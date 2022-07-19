<template>
  <v-row>
    <v-col cols="12">
      <canvas id="canvas" ref="canvas" width="500" height="300"> </canvas>
    </v-col>
    <v-col cols="12">
      <v-btn @click="dowCanvas">Tải thẻ</v-btn>
      <v-btn @click="printImg">In thẻ</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import QRCode from 'qrcode'
export default {
  props: {
    card: {
      type: Object,
      default: null,
    },
    qr: {
      type: String,
      default: 'abc',
    },
  },
  data() {
    return {
      avatarX: 10,
      avatarY: 40,
      avatarW: 110,
      avatarH: 140,

      qrW: 80,
      qrH: 80,

      imgCanVas: '',
      avatar: '',
    }
  },
  created() {},
  async mounted() {
    await this.drawCanvas()
  },

  methods: {
    async createQR(data) {
      try {
        if (this.card) {
          return await QRCode.toDataURL(data)
        } else {
          return ''
        }
      } catch (err) {
        return ''
      }
    },
    async drawCanvas() {
      function loadImage(src) {
        const img = new Image()
        img.setAttribute('crossorigin', 'anonymous')
        img.src = src
        return img
      }

      // img
      const avatar = loadImage(this.card.customer.avatar.imgUrl)

      const qr = loadImage(this.qr)

      // canvas
      const canvas_ = await this.$refs.canvas
      const canvas = canvas_.getContext('2d')
      canvas.drawImage(
        avatar,
        this.avatarX,
        this.avatarY,
        this.avatarW,
        this.avatarH
      )
      canvas.drawImage(
        qr,
        this.avatarX + this.avatarW / 2 - this.qrW / 2,
        this.avatarH + this.avatarY + 10,
        this.qrW,
        this.qrH
      )

      canvas.font = 'normal small-caps bold 24px arial'
      canvas.fillText(
        'THẺ KHÁM CHỮA BỆNH',
        this.avatarX + this.avatarW + 30,
        this.avatarY
      )
      // col 1
      canvas.font = 'normal small-caps bold 12px arial'
      canvas.fillText(
        'Họ tên:',
        this.avatarX + this.avatarW + 20,
        this.avatarY + 30
      )
      canvas.fillText(
        this.card.customer.name,
        this.avatarX + this.avatarW + 100,
        this.avatarY + 30
      )
      canvas.fillText(
        this.card.place.id,
        this.avatarX + this.avatarW + 210,
        this.avatarY + 30
      )
      canvas.fillText(
        this.card.obj.id,
        this.avatarX + this.avatarW + 240,
        this.avatarY + 30
      )
      canvas.fillText(
        this.card.benefitRate.id,
        this.avatarX + this.avatarW + 270,
        this.avatarY + 30
      )
      // col 2
      canvas.fillText(
        'Ngày Sinh:',
        this.avatarX + this.avatarW + 20,
        this.avatarY + 60
      )
      canvas.fillText(
        new Date(this.card.customer.birth).toISOString().substring(0, 10),
        this.avatarX + this.avatarW + 100,
        this.avatarY + 60
      )
      canvas.fillText(
        'Giới tính:',
        this.avatarX + this.avatarW + 210,
        this.avatarY + 60
      )
      canvas.fillText(
        this.card.customer.gender,
        this.avatarX + this.avatarW + 280,
        this.avatarY + 60
      )
      // col 3
      canvas.fillText(
        'Dân tộc:',
        this.avatarX + this.avatarW + 20,
        this.avatarY + 90
      )
      canvas.fillText(
        this.card.customer.ethnic,
        this.avatarX + this.avatarW + 100,
        this.avatarY + 90
      )
      canvas.fillText(
        'Quốc tịch:',
        this.avatarX + this.avatarW + 210,
        this.avatarY + 90
      )
      canvas.fillText(
        this.card.customer.citizenship,
        this.avatarX + this.avatarW + 280,
        this.avatarY + 90
      )
      // col 4
      canvas.fillText(
        'Địa chỉ:',
        this.avatarX + this.avatarW + 20,
        this.avatarY + 120
      )
      canvas.fillText(
        `${this.card.customer.address}, ${this.card.customer.ward.name},`,
        this.avatarX + this.avatarW + 100,
        this.avatarY + 120
      )
      canvas.fillText(
        `${this.card.customer.district.name}, ${this.card.customer.province.name},`,
        this.avatarX + this.avatarW + 100,
        this.avatarY + 140
      )
      // col 5
      canvas.fillText(
        'Giá trị từ:',
        this.avatarX + this.avatarW + 20,
        this.avatarY + 160
      )
      canvas.fillText(
        this.card.effectFrom
          ? new Date(this.card.effectFrom).toISOString().substring(0, 10)
          : '...',
        this.avatarX + this.avatarW + 100,
        this.avatarY + 160
      )
      canvas.fillText(
        'Đến ngày:',
        this.avatarX + this.avatarW + 210,
        this.avatarY + 160
      )
      canvas.fillText(
        this.card.effectTo
          ? new Date(this.card.effectTo).toISOString().substring(0, 10)
          : '...',
        this.avatarX + this.avatarW + 280,
        this.avatarY + 160
      )

      canvas.font = 'italic normal normal 12px arial'

      canvas.fillText(
        '..............., ngày .... / .... / 202...',
        this.avatarX + this.avatarW + 180,
        this.avatarY + 190
      )
    },
    dowCanvas(e) {
      const a = document.createElement('a')
      a.href = this.$refs.canvas.toDataURL()
      a.setAttribute('download', `card.png`)
      a.click()
      a.remove()
    },
    printImg(e) {
      const imgHtml =
        "<img style='padding:50px 50px;display:block;margin-left:auto;margin-right:auto;width:500px;height:auto;' src='" +
        this.$refs.canvas.toDataURL() +
        "'></img>"

      const WindowObject = window.open(
        '',
        'PrintWindow',
        'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes'
      )

      const strHtml =
        '<html>\n<head>\n <link rel="stylesheet" type="text/css" href="test.css">\n</head><body onload=\'window.print();window.close()\'><div style="testStyle">\n' +
        imgHtml +
        '\n</div>\n</body>\n</html>'

      WindowObject.document.writeln(strHtml)
      WindowObject.document.close()
      WindowObject.focus()
    },
  },
}
</script>

<style lang="scss" scoped>
#canvas {
  background: $primary;
}
.hide {
  display: none;
}
</style>
