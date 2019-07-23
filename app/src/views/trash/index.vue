<template>
  <div class="home-container">
    <el-row class="button-group">
      <el-button icon="el-icon-delete" type="danger" @click="handleCleanSelected">彻底删除</el-button>
      <el-button icon="el-icon-plus" type="primary" @click="handleRevertSelected">还原</el-button>
    </el-row>
    <!-- table -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <!-- 多选框 -->
      <el-table-column
        type="selection"
      >
      </el-table-column>
      <!-- 文件名 -->
      <el-table-column
        prop="fileName"
        label="文件名"
      >
        <template slot-scope="scope">
          <!-- 文件类型 -->
          <template v-if="scope.row.fileType === 'file'">
            {{ scope.row.fileName }}{{scope.row.extName}}
          </template>
          <!-- 文件夹 -->
          <template v-if="scope.row.fileType === 'directory'">
            {{ scope.row.fileName }}{{scope.row.extName}}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
      >
      </el-table-column>
      <el-table-column
        prop="edit"
        label="选项"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleCleanOne(scope.$index, scope.row)">彻底删除</el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handleRevertOne(scope.$index, scope.row)">还原</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Api from '@/api/index.api'
import { parseTime } from '@/utils/index.js'
export default {
  name: 'Trash',
  data () {
    return {
      multipleSelection: [], // 多选框选项
      tableData: [], // 表格数据
      rootGuid: '', // ROOT_GUID
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 初始化必要参数
    init() {
      this.fetchRootGuid()
    },
    // 获取 ROOT_GUID
    async fetchRootGuid () {
      let res = await Api.getRootGuid()
      this.rootGuid = res.data.fileGuid
      this.fetchQueryDirectory()
    },
    // 获取 列表数据
    async fetchQueryDirectory () {
      let rp = {
        parentGuid: this.rootGuid
      }
      let resQuery = await Api.queryDirectoty(rp)
      if (resQuery) {
        this.handleQueryData(resQuery)
      }
    },
    // 多选框
    handleSelectionChange (val) {
      console.log('handleSelectionChange val', val)
      this.multipleSelection = val
    },
    // 删除单个
    handleCleanOne (index, row) {
      let { fileGuid } = row
      this.fetchRmFile([fileGuid])
    },
    // 批量删除
    handleCleanSelected () {
      let delArr = this.multipleSelection
      if(Array.isArray(delArr) && delArr.length > 0) {
        this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let fileGuidArr = []
          delArr.forEach(item => {
            fileGuidArr.push(item.fileGuid)
          })
          this.fetchRmFile(fileGuidArr)
        })
      } else {
        this.$message({
          message: '请选择',
          center: true,
          duration: 2 * 1000
        })
      }
    },
    // 删除
    async fetchRmFile (fileGuidArr) {
      let rp = {
        fileGuidArr
      }
      let res = await Api.rmFile(rp)
      let { response } = res
      if (!response.error_code) {
        this.$message({
          message: '删除成功',
          center: true,
          duration: 2 * 1000
        })
        this.fetchQueryDirectory()
      } else {
        this.$message({
          message: response.hint_message,
          center: true,
          duration: 2 * 1000
        })
      }
    },
    // 批量还原
    async handleRevertSelected () {
      let rp = {
        parentGuid: this.parentGuid ? this.parentGuid : this.rootGuid
      }
      let res = await Api.addFile(rp)
      let { response, data } = res
      if (!response.error_code) {
        this.$router.push({'name': 'NaotuEditor', 'params': { id: data.fileGuid }})
      } else {
        this.$message({
          message: response.hint_message,
          center: true,
          duration: 2 * 1000
        })
      }
    },
    // request 新建文件夹
    async handleFetchAddDirectory (fileName) {
      let rp = {
        parentGuid: this.parentGuid ? this.parentGuid : this.rootGuid,
        fileName
      }
      let res = await Api.addDirectory(rp)
      let { response } = res
      if (!response.error_code) {
        this.$message({
          type: 'success',
          message: '新建成功'
        })
        this.fetchQueryDirectory()
      }
    },
    // 单个还原
    handleRevertOne (index, row) {
      this.$prompt('请输入文件名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (!value) {
          this.$message({
            type: 'warn',
            message: '文件名不能为空'
          })
        } else {
          let rp = {
            fileGuid: row.fileGuid,
            fileName: value
          }
          this.fetchUpdate(rp)
        }
      })
    },
    // request
    async fetchUpdate (rp) {
      let res = await Api.updateFile(rp)
      let { response } = res
      if (!response.error_code) {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.fetchQueryDirectory()
      }
    },
    // 查询脑图
    handleQueryData (res) {
      let { response, data } = res
      if (!response.error_code) {
        data.forEach(item => {
          item.createTime = this.dateParse(new Date(item.createTime).getTime())
          item.updateTime = this.dateParse(new Date(item.updateTime).getTime())
        })
        this.tableData = data
      } else {
        this.$message({
          message: response.hint_message,
          center: true,
          duration: 2 * 1000
        })
      }
    },
    // 格式化事件
    dateParse (timestamp, format = '{y}-{m}-{d} {h}:{i}') {
      if(!timestamp) return ''
      return parseTime(timestamp, format)
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container{
  margin: 0 30px;
  .button-group{
    margin: 30px 0;
  }
  a:hover{
    text-decoration: underline;
  }
}
</style>
