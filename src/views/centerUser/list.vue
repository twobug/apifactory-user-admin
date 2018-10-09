<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户名" v-model="searchData.mobile">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="商户号" v-model="searchData.merchantNo">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="专属域名" v-model="searchData.domain">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="真实姓名" v-model="searchData.realNameLike">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="已删除" value="-1"></el-option>
        <el-option label="正常" value="0"></el-option>
        <el-option label="禁用" value="1"></el-option>
        <el-option label="密码锁定" value="2"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="开通时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="开通时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-edit">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
          <div v-if="scope.row.vipLevel" style="color:orange">
            VIP用户 ( {{scope.row.dateVipEnd}} 到期 )
          </div>
        </template>
      </el-table-column>
      <el-table-column label="独立域名">
        <template slot-scope="scope">
          <div v-if="centerUserAgent">
            http://{{scope.row.domain}}.{{centerUserAgent.domain}}
          </div>
          <div v-else>
            http://{{scope.row.domain}}.it120.cc
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="真实姓名"></el-table-column>
      <el-table-column label="状态" width="100%">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == -1">已删除</el-tag>
          <el-tag type="success" v-if="scope.row.status == 0">正常</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 1">禁用</el-tag>
          <el-tag type="warning" v-if="scope.row.status == 2">密码锁定</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开通/修改时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}<br>{{scope.row.dateUpdate?scope.row.dateUpdate:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="centerUserAgent && scope.row.vipLevel" type="text" style="color:red" @click="buyVip(scope.row.id)">续费</el-button>
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow" style="margin-top:20px;">
    </el-pagination>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="密码" prop="pwd" >
          <el-col :span="7">
            <el-input v-model="pushData.pwd" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" :offset="1" style="color:red;">
            添加密码必填；修改可留空，不填表示不修改密码
          </el-col>
        </el-form-item>
        <el-form-item label="域名" prop="domain" >
          <el-col :span="7">
            <el-input v-model="pushData.domain" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" :offset="1">
            <div v-if="centerUserAgent">
              填写 「 http://<b style="color:red">xxxx</b>.{{centerUserAgent.domain}} 」 中红色部分，数字和字母组成
            </div>
            <div v-else>
              填写 「 http://<b style="color:red">xxxx</b>.it120.cc 」 中红色部分，数字和字母组成
            </div>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名" prop="realName" >
          <el-input v-model="pushData.realName" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" >
          <el-select v-model="pushData.status" placeholder="请选择">
            <el-option label="已删除" :value="-1"></el-option>
            <el-option label="正常" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
            <el-option label="密码锁定" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="在线支付" :visible.sync="dialogTableVisiblePay">
      <form :action="alipayPostData.gateway" method="POST" target="_blank">
        <input type="hidden" v-for="(v, k) in alipayPostData.params" v-bind:key="k" :name="k" :value="v" />
        <el-button type="success" native-type="submit" round>打开支付宝付款</el-button>
      </form>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDataList, infoData, delData, saveData, getPayData } from '@/api/centerUser'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      page:1,
      pageSize:10,
      totalRow:0,

      rules: {
        domain: [
          { required: true, message: '不能为空'},
        ],
        status: [
          { required: true, message: '不能为空'},
        ],
        realName: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        status:0,
        ask:undefined,
        reply:undefined,
        isUse:undefined,
      },

      dialogTableVisiblePay:false,
      alipayPostData:{},

      multipleSelection: [],
      list: null,
      centerUserAgent:undefined,
      listLoading: true
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.fetchData()
  },
  mounted() {
    
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList(this.page, this.pageSize, this.searchData).then(response => {
        if (response.code == 0) {
          this.list = response.data.result
          this.centerUserAgent = response.data.centerUserAgent
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '增加新客户账号'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id){
      infoData(id).then(res => {
        if (res.code != 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data.bean, {pwd:undefined})
          this.pushData.dialogTitle = '修改客户信息'
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
          this.pushData.lastVisitDate = undefined          
          if (!this.pushData.id && !this.pushData.pwd) {
            Message({
              message: '请输入密码---',
              type: 'error',
              duration: 3 * 1000
            })
            return
          }
          saveData(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
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
            duration: 1 * 1000,
            onClose: () => {
              this.fetchData()
            }
          })
        })
      }).catch(() => {});
    },
    buyVip(id){
      getPayData(id).then(res => {
        // 弹框点击确定调整支付宝付款
        if (res.code == 0) {
          this.alipayPostData = res.data;
          this.dialogTableVisiblePay = true;
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }        
      })
    },
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
