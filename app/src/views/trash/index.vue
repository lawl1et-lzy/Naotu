<template>
  <div class="home-container">
    <el-row class="button-group">
      <el-button icon="el-icon-delete" type="danger" @click="handleDeleteSelected">彻底删除</el-button>
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
            <i class="el-icon-document"></i>
            {{ scope.row.fileName }}{{scope.row.extName}}
          </template>
          <!-- 文件夹 -->
          <template v-if="scope.row.fileType === 'directory'">
            <i class="el-icon-circle-plus-outline"></i>
            {{ scope.row.fileName }}{{scope.row.extName}}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="删除时间"
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
            @click="handleDeleteOne(scope.$index, scope.row)">彻底删除</el-button>
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
import Api from '@/api/trash.api'
import { parseTime } from '@/utils/index.js'
export default {
  name: 'Trash',
  data () {
    return {
      multipleSelection: [], // 多选框选项
      tableData: [], // 表格数据
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 初始化必要参数
    init() {
      this.fetchQueryDirectory()
    },
    // 获取 列表数据
    async fetchQueryDirectory () {
      try {
        let resQuery = await Api.querySelfDirectotyForTrash()
        if (resQuery) {
          this.handleQueryData(resQuery)
        }
      } catch (error) {
        console.log('fetchQueryDirectory', error)
      }
    },
    // 处理查询数据
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
    // 多选框
    handleSelectionChange (val) {
      console.log('handleSelectionChange val', val)
      this.multipleSelection = val
    },
    // 点击行
    handleRowClick (row) {
      // this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 删除单个
    handleDeleteOne (index, row) {
      let { _id } = row
      this.fetchDeleteFile([_id])
    },
    // 批量删除
    handleDeleteSelected () {
      let delArr = this.multipleSelection
      if(Array.isArray(delArr) && delArr.length > 0) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _ids = []
          delArr.forEach(item => {
            _ids.push(item._id)
          })
          this.fetchDeleteFile(_ids)
        })
      } else {
        this.$message({
          message: '请选择',
          center: true,
          duration: 2 * 1000
        })
      }
    },
    // request 删除
    async fetchDeleteFile (_ids) {
      try {
        const rp = {
          _ids
        }
        const res = await Api.deleteFiles(rp)
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
      } catch (error) {
        console.log('fetchDeleteFile', error)
      }
    },
    // 批量还原
    async handleRevertSelected () {
      let arr = this.multipleSelection
      if(Array.isArray(arr) && arr.length > 0) {
        let _ids = []
        arr.forEach(item => {
          _ids.push(item._id)
        })
        this.fetchRevertFile(_ids)
      } else {
        this.$message({
          message: '请选择',
          center: true,
          duration: 2 * 1000
        })
      }
    },
    // 单个还原
    handleRevertOne (index, row) {
      const { _id } = row
      this.fetchRevertFile([_id])
    },
    // request 还原
    async fetchRevertFile (_ids) {
      try {
        const rp = {
          _ids
        }
        let res = await Api.revertFiles(rp)
        let { response } = res
        if (!response.error_code) {
          this.$message({
            message: '还原成功',
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
      } catch (error) {
        console.log('fetchRevertFile', error)
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
