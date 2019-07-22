<template>
  <div class="home-container">
    <el-row class="button-group">
      <el-button type="primary" @click="handleAddFile">新建脑图</el-button>
      <el-button type="primary" @click="handleAddDirectory">新建文件夹</el-button>
    </el-row>
    <!-- table -->
    <el-table
      ref="multipleTable1111"
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
        label="文件名111"
      >
        <template slot-scope="scope">
          {{ scope.row.extName ? `${scope.row.fileName}${scope.row.extName}` : scope.row.fileName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="fileSize"
        label="大小"
      >
      </el-table-column> -->
      <el-table-column
        prop="edit"
        label="EDIT"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleRename(scope.$index, scope.row)">重命名</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Api from '@/api/index.api'
export default {
  name: 'Naotu',
  data () {
    return {
      multipleSelection: [], // 多选框选项
      tableData: [], // 表格数据
      rootGuid: '' // ROOT_GUID
    }
  },
  created () {
    this.fetchRootGuid()
  },
  methods: {
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
    // 点击行
    handleRowClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 编辑
    handleEdit (index, row) {
      let { fileGuid } = row
      this.$router.push({'name': 'NaotuEditor', 'params': { id: fileGuid }})
    },
    // 删除
    handleDelete (index, row) {
      let { fileGuid } = row
      this.fetchDelFile(fileGuid)
    },
    // 删除
    async fetchDelFile (fileGuid) {
      let rp = {
        fileGuidArr: [fileGuid]
      }
      let res = await Api.delFile(rp)
      let { response } = res
      if (!response.error_code) {
        this.$message({
          message: '删除成功',
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
    // 重命名
    handleRename (index, row) {
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
          this.fetchRename(row.fileGuid, value)
        }
      })
    },
    // request
    async fetchRename (fileGuid, newName) {
      let rp = {
        fileGuid,
        newName
      }
      let res = await Api.rename(rp)
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
          item.createTime = new Date(item.createTime).getTime()
          item.updateTime = new Date(item.updateTime).getTime()
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
    // 新增文件
    async handleAddFile () {
      let rp = {
        parentGuid: this.rootGuid
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
      // window.open('../../../static/kityminder-editor/dist/index.html')
    },
    // 新建文件夹
    handleAddDirectory () {
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
          this.handleFetchAddDirectory(value)
        }
      })
    },
    // request 新建文件夹
    async handleFetchAddDirectory (fileName) {
      let rp = {
        parentGuid: this.rootGuid,
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
}
</style>
