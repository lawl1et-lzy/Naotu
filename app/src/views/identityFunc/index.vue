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
      <!-- 角色名称 -->
      <el-table-column
        prop="identity"
        label="角色名称" >
        <template slot-scope="scope">
          {{ scope.row.identity.name }}
        </template>
      </el-table-column>
      <!-- 菜单组 -->
      <el-table-column
        prop="funcs"
        label="菜单组" >
        <template slot-scope="scope">
          <template v-if="Array.isArray(scope.row.funcs) && scope.row.funcs.length > 0">
            <el-tag 
              class="el-tag-mgl"
              v-for="item in scope.row.funcs"
              :key="item._id"
              effect="dark">
              {{ item.name }}
            </el-tag>
          </template>
        </template>
      </el-table-column>
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
        prop="createTime"
        label="创建时间" />
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
    <el-dialog title="权限配置" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules">
        <!-- 角色名称 -->
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="identityid">
          <el-select v-model="form.identityid" filterable placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 菜单 -->
        <el-form-item label="菜单列表" :label-width="formLabelWidth" prop="funcsids">
          <el-checkbox-group v-model="form.funcsids">
            <el-checkbox
              v-for="item in funcs"
              :key="item.value"
              :label="item.value"
              name="type">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
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
import Api from '@/api/identityFunc.api'
import { parseTime } from '@/utils/index.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'IdentityFunc',
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      form: {
        _id: '',
        identityid: '', // 角色
        funcsids: [], // 菜单选项
        status: true, // 状态
      },
      formLabelWidth: '120px',
      rules: {
        identityid: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        funcsids: [
          { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }
        ],
      },
      /**
       * 用户判断点击保存的动作
       * {
       *    0: save,
       *    1: edit
       * }
       */
      confirmType: 0, 
      // 所有的用户角色
      roles: [],
      // 所有的功能
      funcs: []
    }
  },
  computed: {
    ...mapGetters([
      'identityInfos',
      'funcInfos'
    ])
  },
  watch: {
    identityInfos: {
      async handler (n) {
        if(Array.isArray(n) && n.length > 0) {
          this.roles = await this.formatToLabelValue(n)
        } else {
          this['identity/getIdentityInfos']()
        }
      },
      immediate: true
    },
    funcInfos: {
      async handler (n) {
        if(Array.isArray(n) && n.length > 0) {
          this.funcs = await this.formatToLabelValue(n)
        } else {
          this['func/getFuncInfos']()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions([
      'identity/getIdentityInfos',
      'func/getFuncInfos',
    ]),
    // 多选框
    handleSelectionChange(val) {
      console.log('handleSelectionChange val', val)
    },
    // 新增
    handleAdd() {
      this.dialogFormVisible = true
      this.confirmType = 0
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
        const { _id } = row
        this.fetchDelete([_id])
      })
    },
    async fetchDelete(_ids) {
      try {
        const rp = {
          _ids
        }
        const doc = await Api.identityFuncRemove(rp)
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
      const { _id } = row
      if(!_id) return false
      this.confirmType = 1
      this.fetchFormData(_id)
    },
    // 获取表单数据
    async fetchFormData(_id) {
      try {
        const rp = {
          _id
        }
        const doc = await Api.identityFuncFindById(rp)
        const {response: {error_code, hint_message}, data} = doc
        if(!error_code) {
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs.form.resetFields() // 不加，点击新增，数据有残留
            this.form._id = data._id
            this.form.identityid = data.identity
            this.form.funcsids = data.funcs
          })
        }
      } catch (error) {
        console.log('fetchFormData', error)
      }
    },
    // 获取表格数据
    async fetchTableData() {
      try {
       const doc = await Api.identityFuncFind()
       if(doc) {
         this.handleReqTableData(doc)
       }
      } catch (error) {
        console.log('fetchTableData', error)
      }
    },
    // 处理数据
    handleReqTableData(res) {
      const { response: { error_code, hint_message }, data } = res
      if (!error_code) {
        data.forEach(item => {
          item.createTime = this.dateParse(new Date(item.createTime).getTime())
          item.updateTime = this.dateParse(new Date(item.updateTime).getTime())
        })
        this.tableData = data
      } else {
        this.message(hint_message)
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
          /**
           * 用户判断点击保存的动作
           * {
           *    0: save,
           *    1: edit
           * }
           */
          if(this.confirmType) {
            this.fetchUpdate()
          } else {
            this.fetchSave()
          }
        } else {
          return false;
        }
      });
    },
    // 保存表单
    async fetchSave() {
      try {
        const doc = await Api.identityFuncCreate(this.form)
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
    // 更新表单
    async fetchUpdate() {
      try {
        const doc = await Api.identityFuncUpdate(this.form)
        const { response } = doc
        if(!response.error_code) {
          this.message('更新成功')
          this.dialogFormVisible = false
          this.fetchTableData()
        } else {
          this.message(response.hint_message)
        }
      } catch (error) {
        console.log('fetchUpdate', error)
      }
    },
    // 格式化成[{value, label}]
    formatToLabelValue(roles) {
      let arr = []
      if(Array.isArray(roles) && roles.length > 0) {
        for(let role of roles) {
          const { _id, name } = role
          arr.push({
            value: _id,
            label: name
          })
        }
      }
      return arr
    },
    // 处理菜单
    handleFuncMsg(funcArr) {

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
  .el-tag-mgl{
    margin: 4px;
  }
  .button-group{
    margin: 30px 0;
  }
  a:hover{
    text-decoration: underline;
  }
}
</style>