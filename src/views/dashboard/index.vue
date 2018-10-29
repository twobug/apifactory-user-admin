<template>
  <div class="dashboard-container">
    <el-row :gutter="40" class="panel-group">
      <el-col v-checkInstalledApi="[18, 25, 166]" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel user-box">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="user" class-name="card-panel-icon" />
          </div>
          <div class="column-box" />
          <div class="card-panel-description">
            <div class="card-panel-text">用户数</div>
            <count-to :start-val="0" :end-val="statisticsData.users" :duration="1000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col v-checkInstalledApi="[41]" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel income-box">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="order" class-name="card-panel-icon" />
          </div>
          <div class="column-box" />
          <div class="card-panel-description">
            <div class="card-panel-text">订单数</div>
            <count-to :start-val="0" :end-val="statisticsData.orders" :duration="1000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel jkje-box">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="files" class-name="card-panel-icon" />
          </div>
          <div class="column-box" />
          <div class="card-panel-description">
            <div class="card-panel-text">存储空间</div>
            <font style="color:red">已用 {{statisticsData.fileCapacity}}</font>
          </div>
        </div>
      </el-col>
      <el-col v-checkInstalledApi="[37]" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel pz-box">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <svg-icon icon-class="goods" class-name="card-panel-icon" />
          </div>
          <div class="column-box" />
          <div class="card-panel-description">
            <div class="card-panel-text">商品数量</div>
            <count-to :start-val="0" :end-val="statisticsData.goods" :duration="1000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-alert type="error" :closable="false" title="温馨提示：" style="margin-bottom:25px;">
      当前后台左侧没有菜单？安装/卸载模块快速切换菜单！「<a href="#/user/centerUserApi/list" class="gray">模块设置</a>」。
    </el-alert>
    <el-row :gutter="40">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
            <a style="float: right; padding: 3px 0;color:red" href="https://www.it120.cc/vip" target="_blank">「vip特权」</a>
          </div>
          <div class="text item">
            <table class="baseInfoTable">
              <tr>
                <th width="100px" align="left">商户ID</th>
                <td>{{centerUserBase.id}}</td>
              </tr>
              <tr>
                <th width="100px" align="left">商户号</th>
                <td>{{centerUserBase.merchantNo}}</td>
              </tr>
              <tr>
                <th width="100px" align="left">商户秘钥</th>
                <td>
                  {{centerUserBase.merchantKey}}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <el-button type="text" @click="resetKey">「 重置 」</el-button>
                </td>
              </tr>
              <tr>
                <th width="100px" align="left">手机号码</th>
                <td>
                  {{centerUserBase.mobile}}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <el-button type="text" @click="modifyMobile">「 修改 」</el-button>
                </td>
              </tr>
              <tr>
                <th width="100px" align="left">专属接口域名</th>
                <td>
                  https://api.it120.cc/{{centerUserBase.domain}}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <el-button type="text" @click="changeDomain">「 修改 」</el-button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <router-link to="/user/centerUserDomain/list" style="color:red;">「 绑定更多个性域名 」</router-link>
                </td>
              </tr>
              <tr>
                <th width="100px" align="left">真实姓名</th>
                <td>
                  {{centerUserBase.realName}}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <el-button type="text" @click="changeName">「 修改 」</el-button>
                </td>
              </tr>
            </table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="40">
          <el-col :span="24">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>消息推送</span>
                <el-button style="float: right; padding: 3px 0;color:red" type="text" @click="changePushUrl">「配置」</el-button>
              </div>
              <div class="text item">
                <table class="baseInfoTable">
                  <tr>
                    <th width="100px" align="left">使用教程</th>
                    <td>
                      <a href="https://www.it120.cc/info/wxapp/4828" target="_blank"> [ 订单推送 ] </a>
                    </td>
                  </tr>
                  <tr>
                    <th width="100px" align="left">推送地址</th>
                    <td>{{centerUserBase.pushUrl ? centerUserBase.pushUrl : '未配置'}}</td>
                  </tr>            
                  <tr>
                    <td colspan="2">
                      <router-link to="/user/spread/list" style="color:red;">
                        <img src="/static/images/tgzq.gif" style="width: 100%;">
                      </router-link>
                    </td>
                  </tr>            
                </table>
              </div>
            </el-card>
          </el-col>
          <el-col :span="24" style="margin-top:15px;">
            <el-card :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <span>关注公众号 <small>接收用户下单通知</small></span>
              </div>
              <el-row :gutter="40">
                <el-col :span="8">
                  <img :src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + wxInfo.bindQrcodeTicket" style="display: block;width:100%;">
                </el-col>
                <el-col :span="16">
                  <el-collapse v-model="collapseActiveName" accordion>
                    <el-collapse-item title="注意事项：" name="1">
                      <div>1、关注公众号后，您将能在第一时间获知系统最新动态及功能尝鲜；</div>
                      <div>2、最新的活动和优惠信息我们将会以微信的方式进行推送；</div>
                      <div>3、您将可获取到您的账户最新的通知（用户下单、付款通知发货等）；</div>
                    </el-collapse-item>
                  </el-collapse>
                  <div v-if="wxInfo.isBind" style="margin-top:10px;">
                    当前绑定： {{wxInfo.name}}
                    <el-button type="text" @click="unBindWX">「 解除绑定 」</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'
import { statisticsData } from '@/api/centerUser'
import { statistics } from '@/api/apiExtDfs'
import { changeDomain, changeName, resetKey, changePushUrl, wxInfo, unBindWX } from '@/api/centerUser'

export default {
  name: 'Dashboard',
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
      wxInfo:{},
      collapseActiveName:'1',
      statisticsData:{
        users:0,
        orders:0,
        goods:0,
        fileCapacity:'-'
      }
    }
  },
  mounted() {
    statisticsData().then(res => {
      if (res.code == 0) {
        this.statisticsData = Object.assign({}, this.statisticsData, res.data)
      }
    })
    statistics().then(res => {
      if (res.code == 0) {
        this.statisticsData.fileCapacity = res.data.capacityStr
      }
    })
    this.fetchWxInfo()
  },
  methods: {
    fetchWxInfo (){
      wxInfo().then(res => {
        if (res.code == 0) {
          this.wxInfo = res.data
        }
      })
    },
    modifyMobile(){
      this.$router.push({path: '/modifyMobile'})
    },
    changeDomain() {
      this.$prompt('您只需要输入类似 https://api.it120.cc/abc 的 abc 部分即可', '请输入新域名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:this.centerUserBase.domain
      }).then(({
        value
      }) => {
        if (!value) {
            this.$message({
              type: 'error',
              message: '域名不能为空'
            })
            return
          }
        changeDomain(value).then(response => {          
          if(response.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功',
              onClose:()=>{
                location.reload()
              }
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
    },
    changeName() {
      this.$prompt('请输入真实姓名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:this.centerUserBase.realName
      }).then(({
        value
      }) => {
        if (!value) {
            this.$message({
              type: 'error',
              message: '姓名不能为空'
            })
            return
          }
        changeName(value).then(response => {          
          if(response.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功',
              onClose:()=>{
                location.reload()
              }
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
    },
    resetKey(){
      this.$confirm('确定要重置商户秘钥吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetKey().then(res => {
          this.$message({
            type: 'success',
            message: '重置成功',
            onClose:()=>{
              location.reload()
            }
          })
        })
      }).catch(() => {});
    },
    unBindWX(){
      this.$confirm('确定要解除绑定吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unBindWX().then(res => {
          this.$message({
            type: 'success',
            message: '解除成功'
          })
          this.fetchWxInfo()
        })
      }).catch(() => {});
    },
    changePushUrl() {
      this.$prompt('工厂数据将会被推送至填写的地址：', '请输入推送地址', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:this.centerUserBase.pushUrl
      }).then(({
        value
      }) => {
        changePushUrl(value).then(response => {          
          if(response.code === 0) {
            this.$message({
              type: 'success',
              message: '配置成功',
              onClose:()=>{
                location.reload()
              }
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
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
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
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      width: 30%;
      height: 60px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      width: 68%;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: bold;
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
    &:hover {
      color: #fff;
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .card-panel-text{
        color: #fff;
      }
    }
  }
  .column-box{
    width: 2px;
    height: 60px;
    background: #e6e6e6;
  }
  .user-box:hover{
    background: #40c9c6;
  }
  .income-box:hover{
    background: #36a3f7;
  }
  .jkje-box:hover{
    background: #f4516c;
  }
  .pz-box:hover{
    background: #34bfa3;
  }  
}
.baseInfoTable {
  width: 100%;
  line-height:40px;
}
.baseInfoTable th {
  border-bottom: 1px solid #ebeef5;
}
.baseInfoTable td {
  border-bottom: 1px solid #ebeef5;
  color:green;
}
</style>
