<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobile">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="searchData.nick">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.orderBy" placeholder="排序方式">
        <el-option label="余额从小到大" value="balanceUp"></el-option>        
        <el-option label="余额从大到小" value="balanceDown"></el-option>        
        <el-option label="冻结从小到大" value="freezeUp"></el-option>        
        <el-option label="冻结从大到小" value="freezeDown"></el-option>        
        <el-option label="积分从小到大" value="scoreUp"></el-option>        
        <el-option label="积分从大到小" value="scoreDown"></el-option>        
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" @click="modifyAmount()" type="danger" icon="el-icon-edit">调整余额</el-button>
      <el-button class="filter-item" @click="modifyScore()" type="danger" icon="el-icon-edit">调整积分</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="uid" label="用户编号"></el-table-column>
      <el-table-column prop="mobile" label="手机号码"></el-table-column>
      <el-table-column prop="nick" label="昵称"></el-table-column>
      <el-table-column prop="balance" label="可用余额（元）" />
      <el-table-column prop="freeze" label="冻结资金（元）" />
      <el-table-column prop="score" label="当前积分" />
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

    <el-dialog title="调整余额" :visible.sync="dialogModifyAmountVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopFormAmount" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="用户编号" prop="uid">
          <el-input v-model="pushData.uid" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="pushData.mobile" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="pushData.money" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pushData.remark" type="textarea" clearable rows="4"
                  @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModifyAmountVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyAmountSave">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="调整积分" :visible.sync="dialogModifyScoreVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopFormScore" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="用户编号" prop="uid">
          <el-input v-model="pushData.uid" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="pushData.mobile" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="积分" prop="score">
          <el-input v-model="pushData.score" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pushData.remark" type="textarea" clearable rows="4"
                  @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModifyScoreVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyScoreSave">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDataList } from '@/api/apiExtUserCash'
import { modifyUserAmount } from '@/api/apiExtUserPay'
import { modifyUserScore } from '@/api/apiExtUserScoreLog'
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
      page:1,
      pageSize:10,
      totalRow:0,

      rules: {
        money: [
          { required: true, message: '不能为空'},
        ],
        score: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {},

      multipleSelection: [],
      list: null,
      listLoading: true,

      dialogModifyAmountVisible:false,
      dialogModifyScoreVisible:false,
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
      fetchDataList(this.searchData).then(response => {
        if (response.code === 0) {
          this.list = response.data.result
          this.list.forEach(ele => {
            if (ele.uid) {
              let UserMap = response.data.userMap[ele.uid]
              if (UserMap) {
                ele.mobile = UserMap.mobile
                ele.nick = UserMap.nick
              }
            }            
          })
        }
        this.listLoading = false
      })
    },
    modifyAmount(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.dialogModifyAmountVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopFormAmount'].clearValidate()
      })
    },
    modifyScore(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.dialogModifyScoreVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopFormScore'].clearValidate()
      })
    },
    modifyAmountSave(){
      this.$refs['addEditPopFormAmount'].validate((valid) => {
        if (valid) {
          modifyUserAmount(this.pushData).then((res) => {
            if (res.code == 0) {
              this.dialogModifyAmountVisible = false
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
    modifyScoreSave(){
      this.$refs['addEditPopFormScore'].validate((valid) => {
        if (valid) {
          modifyUserScore(this.pushData).then((res) => {
            if (res.code == 0) {
              this.dialogModifyScoreVisible = false
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
