<template>
  <div class="home-container">
    <el-row class="button-group">
      <el-button v-if="showPreBtn" icon="el-icon-back" @click="handleBack">返回上一级</el-button>
      <el-button icon="el-icon-edit" type="primary" @click="handleAddFile">新建脑图</el-button>
      <el-button icon="el-icon-circle-plus-outline" @click="handleAddDirectory">新建文件夹</el-button>
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
      />
      <!-- 文件名 -->
      <el-table-column
        prop="fileName"
        label="文件名"
      >
        <template slot-scope="scope">
          <!-- 文件类型 -->
          <router-link v-if="scope.row.fileType === 'file'" :to="{'name': 'NaotuEditor', 'params': { _id: scope.row._id }}">
            <i class="el-icon-document" />
            {{ scope.row.fileName }}{{ scope.row.extName }}
          </router-link>
          <!-- 文件夹 -->
          <router-link v-if="scope.row.fileType === 'directory'" :to="{'name': 'Home', 'params': { _id: scope.row._id }}">
            <i class="el-icon-circle-plus-outline" />
            {{ scope.row.fileName }}{{ scope.row.extName }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
      />
      <el-table-column
        prop="edit"
        label="选项"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleRename(scope.$index, scope.row)"
          >重命名</el-button>
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
  data() {
    return {
      multipleSelection: [], // 多选框选项
      tableData: [], // 表格数据
      parentid: '', // 父 id
      showPreBtn: false, // 是否显示上一级
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 初始化必要参数
    initData() {
      const up = this.$route.params
      this.parentid = up._id
      if (this.parentid) {
        this.showPreBtn = true
        this.fetchQueryDirectory()
      } else {
        this.fetchRootid()
      }
    },
    // 获取 ROOT_GUID
    async fetchRootid() {
      try {
        const res = await Api.getRootid()
        if (!(res && res.data)) return false
        const { _id } = res.data
        this.parentid = _id
        this.fetchQueryDirectory()
      } catch (error) {
        console.log('fetchRootid ----->', error)
      }
    },
    // 获取 列表数据
    async fetchQueryDirectory() {
      try {
        const rp = {
          parentid: this.parentid
        }
        const resQuery = await Api.queryDirectoty(rp)
        if (resQuery) {
          this.handleQueryData(resQuery)
        }
      } catch (error) {
        console.log('fetchQueryDirectory ----->', error)
      }
    },
    // 多选框
    handleSelectionChange(val) {
      console.log('handleSelectionChange val', val)
      this.multipleSelection = val
    },
    // 点击行
    handleRowClick(row) {
      // this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { _id } = row
        this.fetchRmFile([_id])
      })
    },
    // 批量删除
    handleDeleteMany() {
      const delArr = this.multipleSelection
      if (Array.isArray(delArr) && delArr.length > 0) {
        this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _ids = []
          delArr.forEach(item => {
            _ids.push(item._id)
          })
          this.fetchRmFile(_ids)
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
    async fetchRmFile(_ids) {
      try {
        const rp = {
          _ids
        }
        const res = await Api.rmFile(rp)
        const { response } = res
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
        console.log('fetchRmFile', error)
      }
    },
    // 重命名
    handleRename(index, row) {
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
          const rp = {
            _id: row._id,
            fileName: value
          }
          this.fetchRename(rp)
        }
      })
    },
    // request 重命名
    async fetchRename(rp) {
      try {
        const res = await Api.rename(rp)
        const { response } = res
        if (!response.error_code) {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.fetchQueryDirectory()
        }
      } catch (error) {
        console.log('fetchRename', error)
      }
    },
    // 查询脑图
    handleQueryData(res) {
      const { response, data } = res
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
    async handleAddFile() {
      try {
        const rp = {
          parentid: this.parentid
        }
        const res = await Api.addFile(rp)
        const { response, data: { _id } } = res
        if (!response.error_code) {
          this.$router.push({ 'name': 'NaotuEditor', 'params': { _id }})
        } else {
          this.$message({
            message: response.hint_message,
            center: true,
            duration: 2 * 1000
          })
        }
      } catch (error) {
        console.log('handleAddFile ----->', error)
      }
    },
    // 新建文件夹
    handleAddDirectory() {
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
    async handleFetchAddDirectory(fileName) {
      try {
        const rp = {
          parentid: this.parentid,
          fileName
        }
        const res = await Api.addDirectory(rp)
        const { response } = res
        if (!response.error_code) {
          this.$message({
            type: 'success',
            message: '新建成功'
          })
          this.fetchQueryDirectory()
        }
      } catch (error) {
        console.log('handleFetchAddDirectory', error)
      }
    },
    // 返回上一级
    handleBack() {
      this.$router.go(-1)
    },
    // 格式化事件
    dateParse(timestamp, format = '{y}-{m}-{d} {h}:{i}') {
      if (!timestamp) return ''
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
