<template>
  <div class="app-container">
    <div class="tipBox">
      <p class="title">注意事项:</p>
      <div class="itemList">
        <p>1、将本后台数据克隆到输入的账号，使得输入的账号登陆后将看到和本后台一样的数据</p>
        <p>2、本操作会删除输入账号的原有数据，请谨慎操作</p>
        <p>&nbsp;</p>
      </div>
    </div>

    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-width="120px">
      <el-form-item label="用户名" prop="mobile" >
        <el-col :span="12">
          <el-input v-model="pushData.mobile" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="11" :offset="1" style="color:red;">
          通常为手机号码
        </el-col>
      </el-form-item>
      <el-form-item label="密码" prop="pwd" >
        <el-col :span="12">
          <el-input v-model="pushData.pwd" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="11" :offset="1" style="color:red;">
          请正确输入，错误次数太多账号有可能会被系统锁定
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="onSubmit"> 「 立即克隆 」 </el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import { saveData } from '@/api/copyData'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      rules: {
        mobile: [
          { required: true, message: '不能为空'}
        ],
        pwd: [
          { required: true, message: '不能为空'},
        ],
      },

      pushData: {
        
      },

    }
  },
  methods: {
    onSubmit() {
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          saveData(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '克隆成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.pushData = {}
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
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.tipBox{
  margin-left:80px;
  .title{
    font-size:15px;
    font-weight:600;
    color:red;
  }
  .itemList{
    line-height: 16px;
    color:#666;
    font-size: 14px;
  }
}
</style>
