<template>
  <div class="body_page">
    <div class="body_page-header">
      <h2>Địa chỉ không khả dụng</h2>
      <p>
        Vui lòng kiểm tra lại địa chỉ hoặc trở lại trang chủ bằng cách nhấn vào
        nút bên dưới...
      </p>
      <v-btn color="primary" @click="$router.push('/')">Trở về trang chủ</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
}
</script>

<style lang="scss" scoped>
.body_page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  &-header {
    position: fixed;
    width: 100%;
    text-align: center;
    margin-top: 150px;
    top: 0px;
    h2 {
      font-size: 30px;
      text-transform: uppercase;
      color: $shadow;
    }
  }
}
</style>
