<template>
  <div class="dashboard-container">
    <el-row :gutter="40" class="panel-group">
      <el-col v-checkInstalledApi="[1,2,3,4,7]" :xs="12" :sm="12" :lg="6" class="card-panel-col">
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
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel income-box">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="shouru" class-name="card-panel-icon" />
          </div>
          <div class="column-box" />
          <div class="card-panel-description">
            <div class="card-panel-text">订单数</div>
            <count-to :start-val="0" :end-val="1000" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel jkje-box">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="jiekuan" class-name="card-panel-icon" />
          </div>
          <div class="column-box" />
          <div class="card-panel-description">
            <div class="card-panel-text">借款金额</div>
            <count-to :start-val="0" :end-val="4000" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel pz-box">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <svg-icon icon-class="peizi" class-name="card-panel-icon" />
          </div>
          <div class="column-box" />
          <div class="card-panel-description">
            <div class="card-panel-text">配资规模</div>
            <count-to :start-val="0" :end-val="8000" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'
import { statisticsData } from '@/api/centerUser'

export default {
  name: 'Dashboard',
  components: {
    CountTo
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data() {
    return {
      statisticsData:{
        users:0
      }
    }
  },
  mounted() {
    statisticsData().then(res => {
      if (res.code == 0) {
        this.statisticsData = res.data
      }
    })
  },
  methods: {
    
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
</style>
