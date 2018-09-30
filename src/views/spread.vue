<template>
  <div class="app-container">
    <!-- 4个统计数据 -->
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="tixian" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">可提余额</div>
            <count-to :start-val="0" :end-val="centerUserCash.balance" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="userList" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">推广人数</div>
            <count-to :start-val="0" :end-val="centerUserCash.spreadNumber" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="caiwu" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">累计收入</div>
            <count-to :start-val="0" :end-val="centerUserCash.spreadTotle" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="userlevel" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">返佣比例</div>
            <count-to :start-val="0" :end-val="centerUserCash.spreadPercent" :duration="3600" class="card-panel-num"/> %
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="order-title">推广信息：</div>
        <div style="clear:both;margin-top:20px;">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form label-width="90px">
                <el-form-item label="推广级别:">
                  <el-badge value="等级越高返佣越多" class="item">
                    {{ centerUserCash.level }} 级 &nbsp;&nbsp;
                  </el-badge>
                </el-form-item>
                <el-form-item label="推广链接:">
                  <a :href="'https://www.it120.cc/?referrer=' + centerUserCash.id" target="_blank" class="green">https://www.it120.cc/?referrer={{centerUserCash.id}}</a>
                </el-form-item>
                <el-form-item label="推广码:">
                  {{centerUserCash.id}}
                </el-form-item>
                <el-form-item label="推广积分:">
                    <span>{{centerUserCash.score}}</span>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="order-title">结算信息：</div>
        <div style="clear:both;margin-top:20px;">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form label-width="90px">
                <el-form-item v-if="centerUserCash.alipay" label="支付宝账号:">
                  <font>{{ centerUserCash.alipay }}</font>
                </el-form-item>
                <el-form-item v-else label="支付宝账号:">
                  <el-button type="success" size="small" @click="bindAlipay">设置结算支付宝</el-button>
                </el-form-item>
                <el-form-item label="可提余额:">
                  {{centerUserCash.balance}}
                </el-form-item>
                <el-form-item label="提现:">
                  <el-button type="danger" size="small" @click="applyAmount">提现</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>    
    <div class="order-title">结算记录：</div>
    <div style="clear:both;margin-top:20px;">
      <el-table :data="centerUserCashWithdraws"  fit highlight-current-row empty-text="暂无数据">
        <el-table-column label="结算金额" prop="amount"></el-table-column>
        <el-table-column label="申请日期" prop="dateAdd"></el-table-column>
      </el-table>
    </div>
    <div class="order-title">积分记录：</div>
    <div style="clear:both;margin-top:20px;">
      <el-table :data="scoreLogs"  fit highlight-current-row empty-text="暂无数据">
        <el-table-column label="收/支">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.behavior==0">收入</el-tag>
            <el-tag type="danger" v-else>支出</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="变更积分" prop="score"></el-table-column>
        <el-table-column label="剩余可用积分" prop="scoreLeft"></el-table-column>
        <el-table-column label="详情" prop="remark"></el-table-column>
        <el-table-column label="变更日期" prop="dateAdd"></el-table-column>
      </el-table>
    </div>
    <div class="order-title">邀请人：</div>
    <div style="clear:both;margin-top:20px;">
      <el-table :data="centerUsers"  fit highlight-current-row empty-text="暂无数据">
        <el-table-column label="昵称" prop="realName"></el-table-column>
        <el-table-column label="注册时间" prop="dateAdd"></el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import { spreadData, bindAlipay, applyAmount } from '@/api/spread'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {

      centerUserCash:{
        balance:0,
        spreadNumber:0,
        spreadTotle:0,
        spreadPercent:10
      },

      centerUserCashWithdraws:[],
      scoreLogs:[],
      centerUsers:[],


      

    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    bindAlipay(){
      this.$prompt('请输入支付宝账号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        bindAlipay(value).then((res) => {
          if (res.code == 0) {
            Message({
              message: '设置成功',
              type: 'success',
              duration: 1000
            })
            this.fetchData()
          } else {
            Message({
              message: res.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }          
        })
      })
    },
    applyAmount(){
      this.$prompt('请输入提现金额', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        applyAmount(value).then((res) => {
          if (res.code == 0) {
            Message({
              message: '申请成功，款项将在 1-2 工作日到账，请注意查收！',
              type: 'success',
              duration: 1000
            })
            this.fetchData()
          } else {
            Message({
              message: res.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }          
        })
      })
    },
    fetchData() {
      spreadData().then(res => {
        if (res.code == 0) {
          this.centerUserCash = res.data.centerUserCash
          this.centerUserCashWithdraws = res.data.centerUserCashWithdraws
          this.scoreLogs = res.data.scoreLogs
          this.centerUsers = res.data.centerUsers
        }
      })
    },    
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
.order-title {
  margin-top: 18px;
  font-size: 16px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}

.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
