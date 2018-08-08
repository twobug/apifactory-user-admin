<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="类型" v-model="searchData.type">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="对象编号" v-model="searchData.refId">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="名称" v-model="searchData.name">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="正常" value="0"></el-option>
        <el-option label="失效" value="1"></el-option>
        <el-option label="已过期/结束" value="2"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-edit">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="编号/名称" width="100%">
        <template slot-scope="scope">
          {{scope.row.id}}<br>{{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="类型/对象" width="100%">
        <template slot-scope="scope">
          {{scope.row.type?scope.row.type:'-'}}<br>{{scope.row.refId?scope.row.refId:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="领取条件">
        <template slot-scope="scope">
          口令：{{scope.row.pwd?scope.row.pwd:'无'}}
          <br>
          {{scope.row.needScore}} 积分, 连续签到 {{scope.row.needSignedContinuous}} 天
        </template>
      </el-table-column>
      <el-table-column label="总数/剩余" width="100%">
        <template slot-scope="scope">
          {{scope.row.numberTotle}}
          <br>
          {{scope.row.numberLeft}}
        </template>
      </el-table-column>
      <el-table-column label="领取/使用">
        <template slot-scope="scope">
          {{scope.row.numberGitNumber}} 人领取 {{scope.row.numberGit}} 张
          <br>
          {{scope.row.numberUsed}} 张已使用
        </template>
      </el-table-column>
      <el-table-column label="使用限制">
        <template slot-scope="scope">
          每人限领 {{scope.row.numberPersonMax}} 张
          <br>
          消费满 {{scope.row.moneyHreshold}} 元可用
        </template>
      </el-table-column>
      <el-table-column label="金额">
        <template slot-scope="scope">
          <span v-if="scope.row.moneyMin == scope.row.moneyMax">{{scope.row.moneyMin}}</span>
          <span v-else>{{scope.row.moneyMin}} ~ {{scope.row.moneyMax}} 随机</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100%">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">正常</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 1">失效</el-tag>
          <el-tag type="info" v-if="scope.row.status == 2">已过期/结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="有效期" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.dateStartType == 0">{{scope.row.dateStart}} 生效</span>
          <span v-if="scope.row.dateStartType == 1">领取当天生效</span>
          <span v-if="scope.row.dateStartType == 2">领取次日生效</span>
          <br>
          <span v-if="scope.row.dateEndType == 0">{{scope.row.dateEnd}} 截止</span>
          <span v-if="scope.row.dateEndType == 1">领取 {{scope.row.dateEndDays}} 天后到期</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%" align="center">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button type="text" @click="sendUser(scope.row.id)" style="color:green">发放给用户</el-button></el-dropdown-item>
              <el-dropdown-item><el-button type="text" @click="sendUserLevel(scope.row.id)" style="color:green">发放给指定等级用户</el-button></el-dropdown-item>
              <el-dropdown-item><el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button></el-dropdown-item>
              <el-dropdown-item><el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        <el-form-item label="优惠券类型" prop="type">
          <el-col :span="8">
            <el-input v-model="pushData.type" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;自定义优惠券类型编码</el-col>
        </el-form-item>
        <el-form-item label="使用对象" prop="refId">
          <el-col :span="8">
            <el-input v-model="pushData.refId" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;例如填写商品编号，该优惠券只针对该商品有效,不填为全站通用</el-col>
        </el-form-item>
        <el-form-item label="口令" prop="pwd">
          <el-col :span="8">
            <el-input v-model="pushData.pwd" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;如果填写了口令，领取的时候必须输入正确的口令才能领取</el-col>
        </el-form-item>
        <el-form-item label="需要积分" prop="needScore">
          <el-col :span="8">
            <el-input v-model="pushData.needScore" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;需要多少积分兑换该优惠券</el-col>
        </el-form-item>
        <el-form-item label="连续签到" prop="needSignedContinuous">
          <el-col :span="8">
            <el-input v-model="pushData.needSignedContinuous" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;连续签到指定天数才能领取</el-col>
        </el-form-item>
        <el-form-item label="优惠券名称" prop="name" >
          <el-input v-model="pushData.name" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="总数量" prop="numberTotle">
          <el-col :span="8">
            <el-input v-model="pushData.numberTotle" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;优惠券总数量，领完截止</el-col>
        </el-form-item>
        <el-form-item label="金额" required>
          <el-col :span="3">
            <el-form-item prop="moneyMin">
              <el-input v-model="pushData.moneyMin" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" align="center">~</el-col>  
          <el-col :span="3">
            <el-form-item prop="moneyMax">
              <el-input v-model="pushData.moneyMax" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="17" class="orange">&nbsp;&nbsp;&nbsp;填写金额范围，两个值一样默认为固定金额优惠券，否则为随机</el-col>
        </el-form-item>
        <el-form-item label="使用条件" prop="moneyHreshold">
          <el-col :span="8">
            <el-input v-model="pushData.moneyHreshold" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;消费满多少金额可用</el-col>
        </el-form-item>
        <el-form-item label="每人限领" prop="numberPersonMax">
          <el-col :span="8">
            <el-input v-model="pushData.numberPersonMax" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;张，超过无法领取</el-col>
        </el-form-item>
        <el-form-item label="生效时间" required>
          <el-col :span="8">
            <el-form-item prop="dateStartType">
              <el-select v-model="pushData.dateStartType" placeholder="请选择">
                <el-option label="固定生效时间" value="0"></el-option>
                <el-option label="领取当天生效" value="1"></el-option>
                <el-option label="领取次日生效" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="pushData.dateStartType == 0">
            <el-form-item prop="dateStart">
              <el-date-picker type="date" placeholder="选择生效时间" v-model="pushData.dateStart"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="到期时间" required>
          <el-col :span="8">
            <el-form-item prop="dateEndType">
              <el-select v-model="pushData.dateEndType" placeholder="请选择">
                <el-option label="固定到期时间" value="0"></el-option>
                <el-option label="领取N天后到期" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="pushData.dateEndType == 0">
            <el-form-item prop="dateEnd">
              <el-date-picker type="date" placeholder="选择到期时间" v-model="pushData.dateEnd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="pushData.dateEndType == 1">
            <el-form-item prop="dateEndDays">
              <el-input v-model="pushData.dateEndDays" placeholder="输入具体天数" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="状态" prop="status" >
          <el-select v-model="pushData.status" placeholder="请选择">
            <el-option label="正常" value="0"></el-option>
            <el-option label="失效" value="1"></el-option>
            <el-option label="已过期/结束" value="2"></el-option>
          </el-select>
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
import { fetchDataList, infoData, delData, saveData, sendUser, sendUserLevel } from '@/api/extDiscountsCoupon'
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
        name: [
          { required: true, message: '不能为空'},
        ],
        moneyMin: [
          { required: true, message: '不能为空'},
        ],
        moneyMax: [
          { required: true, message: '不能为空'},
        ],
        moneyHreshold: [
          { required: true, message: '不能为空'},
        ],
        dateStartType: [
          { required: true, message: '不能为空'},
        ],
        dateStart: [
          { required: true, message: '不能为空'},
        ],
        dateEndType: [
          { required: true, message: '不能为空'},
        ],
        dateEnd: [
          { required: true, message: '不能为空'},
        ],
        dateEndDays: [
          { required: true, message: '不能为空'},
        ],
        status: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        needScore:0,
        needSignedContinuous:0,
        moneyHreshold:0,
        status:'0',
        
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      statisticsData:{}
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
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '增加优惠券规则'
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
          this.pushData = Object.assign({}, this.pushDataTmp, res.data, {dateStartType:'' + res.data.dateStartType, dateEndType:'' + res.data.dateEndType, status:'' + res.data.status})
          this.pushData.dialogTitle = '修改优惠券规则'
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
          saveData(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000,
                onClose: () => {
                  this.fetchData()
                }
              })
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
    statistics(){
      statistics().then(res => {
        // 弹框点击确定调整支付宝付款
        this.statisticsData = res.data
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
    sendUser(id){
      this.$prompt('请输入用户编号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\d+/,
        inputErrorMessage: '用户编号为数字'
      }).then(({ value }) => {
        sendUser(id, value).then(res => {
          if (res.code == 0) {
            Message({
              message: '赠送成功',
              type: 'success',
              duration: 1 * 1000
            })
          } else {
            Message({
              message: res.msg,
              type: 'error',
              duration: 1 * 1000
            })
          }          
        })
      }).catch(() => {});
    },
    sendUserLevel(id){
      this.$prompt('请输入用户等级编号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\d+/,
        inputErrorMessage: '用户等级编号为数字'
      }).then(({ value }) => {
        sendUserLevel(id, value).then(res => {
          if (res.code == 0) {
            Message({
              message: '赠送成功',
              type: 'success',
              duration: 1 * 1000
            })
          } else {
            Message({
              message: res.msg,
              type: 'error',
              duration: 1 * 1000
            })
          }          
        })
      }).catch(() => {});
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
