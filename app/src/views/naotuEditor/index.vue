<template>
  <div class="wrap-editor">
    <iframe ref="minderIframe" id="minderIframe" name="minderIframe" :src="`${publicPath}kityminder-editor/dist/index.html`" @load="handleLoad"></iframe>
  </div>
</template>

<script>
import Api from '@/api/index.api'
export default {
  name: 'NaotuEditor',
  data () {
    return {
      fileGuid: '', // 链接参数
      naotuCache: '',
      iframeSec: '',
      publicPath: process.env.BASE_URL
    }
  },
  created () {
    let routeParams = this.$route.params
    this.fileGuid = routeParams.id
    this.fetchQueryFile()
  },
  mounted() {
    // let iframe = document.createElement('iframe');
    // iframe.src="../../../public/kityminder-editor/dist/index.html";
    // iframe.id = 'minderIframe'
    // iframe.name = 'minderIframe'
    // document.body.appendChild(iframe);
    // // iframe.onload = () => {
    //   this.handleLoad()
    // // }
  },
  methods: {
    // iframe load
    handleLoad () {
      this.editor = window.frames['minderIframe'].editor
      if (this.naotuCache) {
        this.editor.minder.importJson(this.naotuCache)
      }

      window.frames['minderIframe'].addEventListener('keydown', e => {
        // 可以判断是不是mac，如果是mac,ctrl变为花键
        // event.preventDefault() 方法阻止元素发生默认的行为。
        if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
          e.preventDefault()
          this.handleCtrlSClick()
        }
      }, false)
    },
    // ctrl + s 保存
    handleCtrlSClick () {
      this.naotuCache = JSON.stringify(this.editor.minder.exportJson())
      this.fetchUpdateFile()
    },
    // request update
    async fetchUpdateFile () {
      let rp = {
        fileGuid: String(this.fileGuid),
        content: this.naotuCache
      }
      let res = await Api.updateFile(rp)
      let { response } = res
      if (!response.error_code) {
        this.$message({
          message: '保存成功',
          center: true,
          duration: 2 * 1000
        })
      } else {
        this.$message({
          message: response.hint_message,
          center: true,
          duration: 2 * 1000
        })
      }
    },
    // 获取 列表数据
    async fetchQueryFile () {
      let rp = {
        fileGuid: this.fileGuid
      }
      let res = await Api.queryFile(rp)
      if (res) {
        this.handleQueryData(res)
      }
    },
    // 查询脑图
    handleQueryData (res) {
      let { response, data } = res
      if (!response.error_code) {
        this.naotuCache = data[0].content ? JSON.parse(data[0].content) : ''
      } else {
        this.$message({
          message: response.hint_message,
          center: true,
          duration: 2 * 1000
        })
      }
    }
  }
}
</script>

<style lang="scss">
.wrap-editor, #minderIframe{
  width: 100%;
  height: 100%;
}
</style>
