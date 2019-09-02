<template>
  <div class="container">
    <el-row class="button-group">
      <el-button icon="el-icon-edit" type="primary" @click="handleAdd">新建</el-button>
      <!-- <el-button icon="el-icon-edit" type="primary" @click="handleEdit">编辑</el-button>
      <el-button icon="el-icon-delete" type="danger" @click="handleDelete">删除</el-button> -->
    </el-row>
    <!-- table -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      @selection-change="handleSelectionChange">
      <!-- 多选框 -->
      <el-table-column
        type="selection"
      />
      <!-- 文件名 -->
      <el-table-column
        prop="name"
        label="文件名" />
      <!-- 是否启用 -->
      <el-table-column
        prop="status"
        label="是否启用" >
        <template slot-scope="scope">
          <el-tag type="success" effect="dark" v-if="scope.row && scope.row.status">启用中</el-tag>
          <el-tag type="danger" effect="dark" v-else>关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间" />
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
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- form -->
    <el-dialog title="功能" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="功能名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth" prop="status">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/api/system'
import { parseTime } from '@/utils/index.js'
export default {
  name: 'Func',
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      form: {
        name: '',
        status: true,
      },
      formLabelWidth: '120px',
      rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
        }
    }
  },
  methods: {
    // 多选框
    handleSelectionChange(val) {
      console.log('handleSelectionChange val', val)
    },
    // 新增
    handleAdd() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { id } = row
        this.fetchDelete([id])
      })
    },
    async fetchDelete(ids) {
      try {
        const rp = {
          ids
        }
        const doc = await Api.funcRemove(rp)
        const { response: {error_code, hint_message} } = doc
        if(!error_code) {
          this.message('删除成功')
          this.fetchTableData()
        } else {
          this.message(hint_message)
        }
      } catch (error) {
        console.log('fetchDelete', error)
      }
    },
    // 编辑
    handleEdit(index, row) {
      const { id } = row
      if(!id) return false
      this.fetchFormData(id)
    },
    // 获取表单数据
    async fetchFormData(id) {
      try {
        const rp = {
          id
        }
        const doc = await Api.funcFind(rp)
        const {response: {error_code, hint_message}, data} = doc
        if(!error_code) {
          this.form.name = data[0].name
          this.form.status = data[0].status
          this.$nextTick(() => {
            this.dialogFormVisible = true
          })
        }
      } catch (error) {
        console.log('fetchFormData', error)
      }
    },
    // 获取表格数据
    async fetchTableData() {
      try {
       const doc = await Api.funcFind()
       if(doc) {
         this.handleFuncFindData(doc)
       }
      } catch (error) {
        console.log('fetchTableData', error)
      }
    },
    // 处理数据
    handleFuncFindData(res) {
      const { response, data } = res
      if (!response.error_code) {
        data.forEach(item => {
          item.createTime = this.dateParse(new Date(item.createTime).getTime())
          item.updateTime = this.dateParse(new Date(item.updateTime).getTime())
        })
        this.tableData = data
      } else {
        this.message(response.hint_message)
      }
    },
    // initData
    initData() {
      this.fetchTableData()
    },
    // 格式化事件
    dateParse(timestamp, format = '{y}-{m}-{d} {h}:{i}') {
      if (!timestamp) return ''
      return parseTime(timestamp, format)
    },
    // 确定
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.fetchSave()
        } else {
          return false;
        }
      });
    },
    // 保存表单
    async fetchSave() {
      try {
        const doc = await Api.funcCreate(this.form)
        const { response } = doc
        if(!response.error_code) {
          this.message('保存成功')
          this.dialogFormVisible = false
          this.fetchTableData()
        } else {
          this.message(response.hint_message)
        }
      } catch (error) {
        console.log('fetchSave', error)
      }
    },
    message(message) {
      this.$message({
        message: message,
        center: true,
        duration: 2 * 1000
      })
    }
  },
  created() {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
.container{
  margin: 0 30px;
  .button-group{
    margin: 30px 0;
  }
  a:hover{
    text-decoration: underline;
  }
}
</style>