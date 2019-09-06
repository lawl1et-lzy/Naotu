<template>
  <div class="container">
    图片上传：<input type="file" accept="image/*" @change="handleFileChange" multiple>
    <template v-if="imgs.length > 0">
      <img v-for="img in imgs" :src="`http://127.0.0.1:3000${img.path}`" alt="">
    </template>
    
  </div>
</template>

<script>
import Api from '@/api/demo/fileManage.api'
export default {
  name: 'FileManage', 
  data () {
    return {
      imgs: []
    }
  },
  methods: {
    async handleFileChange(e) {
      console.log('e', e)
      let files = e.target.files;
      let formData = new FormData()
      for(let file of files) {
        formData.append('files', file);
      }
      const resp = await Api.uploadImgs(formData)
      const { response: { error_code }, data } = resp
      if(!error_code) {
        if(data) {
          this.imgs = data
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  margin: 0 30px;
  .button-group{
    margin: 30px 0;
  }
  img{
    width: 100px;
    height: 100px;
  }
}
</style>