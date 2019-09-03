<template>
  <div class="wrap-editor">
    <iframe id="minderIframe" ref="minderIframe" name="minderIframe" :src="`${publicPath}kityminder-editor/dist/index.html`" @load="handleLoad"/>
  </div>
</template>

<script>
import Api from '@/api/index.api'
export default {
  name: 'NaotuEditor',
  data() {
    return {
      _id: '', // 链接参数
      fileData: '', // 当前文件数据
      naotuCache: '',
      iframeSec: '',
      publicPath: process.env.BASE_URL
    }
  },
  created() {
    const routeParams = this.$route.params
    this._id = routeParams._id
    this.fetchQueryFile()
  },
  beforeRouteUpdate(to, from, next) {
    document.title = to.meta.title
  },
  methods: {
    // iframe load
    handleLoad() {
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
    handleCtrlSClick() {
      this.naotuCache = this.editor.minder.exportJson()
      this.fetchUpdateFile()
    },
    // request update
    async fetchUpdateFile() {
      const fileName = this.naotuCache.root.data.text
      const content = JSON.stringify(this.editor.minder.exportJson())
      const rp = {
        _id: this._id,
        content,
        fileName
      }
      const res = await Api.updateFile(rp)
      const { response } = res
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
    // 获取数据
    async fetchQueryFile() {
      try {
        const rp = {
          _id: this._id
        }
        const res = await Api.queryFile(rp)
        if (res) {
          this.handleQueryData(res)
        }
      } catch (error) {
        console.log('fetchQueryFile ------->', error)
      }
    },
    // 查询脑图
    handleQueryData(res) {
      const { response, data } = res
      if (!response.error_code) {
        this.fileData = data
        this.naotuCache = data.content ? JSON.parse(data.content) : ''
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
