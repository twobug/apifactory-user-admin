<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-button class="filter-item" size="medium" @click="handleCreate()" type="success" icon="el-icon-edit">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{scope.row.username}}
          <el-tag v-if="scope.row.isSuperAdmin" type="danger">超级管理员</el-tag>       
        </template>
      </el-table-column>
      <el-table-column prop="realname" label="姓名"></el-table-column>
      <el-table-column prop="dateLogin" label="最后登录时间"></el-table-column>
      <el-table-column prop="ipLogin" label="登录IP"></el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="!scope.row.isLock">正常</el-tag>
          <el-tag type="danger" v-if="scope.row.isLock">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="resetPwd(scope.row.id)" style="color:orange">重置密码</el-button>
          <el-button type="text" v-if="scope.row.isLock" @click="unstopData(scope.row.id)" style="color:green">启用</el-button>
          <el-button type="text" v-if="!scope.row.isLock" @click="stopData(scope.row.id)" style="color:red">禁用</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="pushData.username" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item v-if="!pushData.id" label="密码" prop="pwd">
          <el-input v-model="pushData.pwd" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="pushData.realname" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="超级管理员" prop="realname">
          <el-switch
						v-model="pushData.isSuperAdmin"
						active-color="#13ce66"
						inactive-color="#ff4949"
						active-text="开启">
					</el-switch>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleIds" style="padding-top:10px;">
            <el-col v-for="item in roles" :key="item.id" :span="6" style="line-height:20px">
              <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
            </el-col>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDataList, infoData, delData, saveData, stopData, unstopData, resetPwd } from '@/api/admin'
import { fetchAllRoles } from '@/api/roles'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      rules: {
        username: [
          { required: true, message: '不能为空'},
        ],
        pwd: [
          { required: true, message: '不能为空'},
        ],
        realname: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        method:'POST',
        status:'0',
        paixu:0,
      },

      multipleSelection: [],
      list: null,
      roleIds:[],
      roles:[],
      listLoading: true,
      domain:undefined
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.fetchData()
  },
  mounted() {
    fetchAllRoles().then(response => {
      if (response.code == 0) {
        this.roles = response.data
      }
    })
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList(this.searchData).then(response => {
        if (response.code === 0) {
          this.list = response.data.result
          this.domain = response.data.domain
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '添加管理员'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id){
      infoData(id).then(res => {
        if (res.code !== 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data.info, {dateType:'' + res.data.dateType, isPub:'' + res.data.isPub, content:res.data.value})
          if (res.data.myRoles) {
            res.data.myRoles.forEach(ele => {
              this.roleIds.push(ele.rid)
            })
          }
          this.pushData.dialogTitle = '修改管理员'
          this.pushData.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['addEditPopForm'].clearValidate()
          })
        }
      }).catch(e=>{
        console.error(e);
      })
    },
    handleCreateSave(){
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          this.pushData.roleIds = this.roleIds.toString()
          saveData(this.pushData).then((res) => {
            if (res.code == 0) {
              this.pushData.dialogFormVisible = false
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.fetchData()
            } else {
              Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch(e=>{
            console.error(e);
          })
        }
      })
    },
    delData(id){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(res => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    stopData(id){
      this.$confirm('确定要禁用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stopData(id).then(res => {
          Message({
            message: '禁用成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    unstopData(id){
      this.$confirm('确定要启用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unstopData(id).then(res => {
          Message({
            message: '启用成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    resetPwd(id) {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({
        value
      }) => {
        resetPwd(id, value).then(response => {
          if(response.code === 0) {
            this.$message({
              type: 'success',
              message: '重置成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: response.msg
            })
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消输入'
        // })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}

</style>
