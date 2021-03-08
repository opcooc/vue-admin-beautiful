<template>
  <div style="font-size: 20px">登录中...</div>
</template>

<script>
  export default {
    name: 'SocialTransit',
    created() {
      let data = {
        accessToken: this.$route.query.token,
        code: this.$route.query.code,
        message: this.$route.query.message,
      }

      window.onload = function () {
        window.opener.parent.postMessage(data, 'http://127.0.0.1:8899')
        window.close()
      }
    },
    beforeDestroy() {},
  }
</script>

<style scoped></style>
