<template>
  <div class="home-container">
    <el-row class="button-group">
      <el-button icon="el-icon-edit" type="primary" @click="handleAddFile">新建脑图</el-button>
      <el-button icon="el-icon-circle-plus-outline" type="primary" @click="handleAddDirectory">新建文件夹</el-button>
      <el-button icon="el-icon-delete" type="danger" @click="handleDeleteMany">删除</el-button>
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
          <router-link v-if="scope.row.fileType === 'file'" :to="{'name': 'NaotuEditor', 'params': { id: scope.row.fileGuid }}">
            {{ scope.row.fileName }}{{scope.row.extName}}
          </router-link>
          <!-- 文件夹 -->
          <router-link v-if="scope.row.fileType === 'directory'" :to="{'name': 'Home', 'params': { id: scope.row.fileGuid }}">
            {{ scope.row.fileName }}{{scope.row.extName}}
          </router-link>
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
        label="选项"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
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
import { parseTime } from '@/utils/index.js'
export default {
  name: 'Naotu',
  data () {
    return {
      multipleSelection: [], // 多选框选项
      tableData: [], // 表格数据
      rootGuid: '', // ROOT_GUID
      parentGuid: '', // 父 guid
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 初始化必要参数
    init() {
      let up = this.$route.params
      this.parentGuid = up.id
      if(this.parentGuid) {
        this.fetchQueryDirectory()
      } else {
        this.fetchRootGuid()
      }
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
        parentGuid: this.parentGuid ? this.parentGuid : this.rootGuid
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
      // this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 编辑
    // handleEdit (index, row) {
    //   let { fileGuid } = row
    //   this.$router.push({'name': 'NaotuEditor', 'params': { id: fileGuid }})
    // },
    // 删除
    handleDelete (index, row) {
      let { fileGuid } = row
      this.fetchRmFile([fileGuid])
    },
    // 批量删除
    handleDeleteMany () {
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
    // 新增文件
    async handleAddFile () {
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
