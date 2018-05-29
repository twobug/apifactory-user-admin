<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model.number="pushData.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否包邮" prop="isFree" >
        <el-select v-model="pushData.isFree" placeholder="请选择">
          <el-option label="包邮" value="true"></el-option>
          <el-option label="不包邮" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计价方式" prop="feeType" >
        <el-select clearable v-model="pushData.feeType" placeholder="请选择">
          <el-option label="按件数" value="0"></el-option>
          <el-option label="按重量" value="1"></el-option>
          <el-option label="按体积" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运费设置">
        <div v-for="feeType in feeTypes" v-bind:key="feeType.type">
          <el-checkbox v-model="feeType.isChecked"> {{feeType.name}} </el-checkbox>
          <div v-if="feeType.isChecked">
            <el-form-item v-for="detail in feeType.details" v-bind:key="detail.name" :label="detail.name">
              <el-col :span="2">
                <el-form-item prop="firstNumber">
                  <el-input v-model.number="detail.firstNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2" style="text-align:center;">件内</el-col>
              <el-col :span="2">
                <el-form-item prop="firstAmount">
                  <el-input v-model.number="detail.firstAmount"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="3" style="text-align:center;">元，每增加</el-col>
              <el-col :span="2">
                <el-form-item prop="addNumber">
                  <el-input v-model.number="detail.addNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="3" style="text-align:center;">件，增加运费</el-col>
              <el-col :span="2">
                <el-form-item prop="addAmount">
                  <el-input v-model.number="detail.addAmount"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2" style="text-align:center;">元</el-col>
            </el-form-item>
            <el-button type="text" @click="addCityException()">为指定地区城市设置运费</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="selectCityForm" label-position="left">
        <el-select v-if="provinceShow" v-model="provinceSel" placeholder="请选择省份" @change="cityDataChanged(0)">
          <el-option v-for="province in provinces" :key="province.id" :label="province.name" :value="province.id"></el-option>
        </el-select>
        <el-select v-if="cityShow" v-model="pushData.status" placeholder="请选择城市">
          <el-option label="正常" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
        <el-select v-if="districtShow" v-model="pushData.status" placeholder="请选择区县">
          <el-option label="正常" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchProvinceList, fetchChildList } from '@/api/city'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {

      feeTypes:[
        {type:0, name:'快递', isChecked:false, details:[
          {name:'默认运费', cityType:0, cityId:0, firstNumber:undefined, firstAmount:undefined, addNumber:undefined, addAmount:undefined}
        ]},
        {type:1, name:'EMS', isChecked:false, details:[
          {name:'默认运费', cityType:0, cityId:0, firstNumber:undefined, firstAmount:undefined, addNumber:undefined, addAmount:undefined}
        ]},
        {type:2, name:'平邮', isChecked:false, details:[
          {name:'默认运费', cityType:0, cityId:0, firstNumber:undefined, firstAmount:undefined, addNumber:undefined, addAmount:undefined}
        ]},
      ],

      rules: {
        name: [
          { required: true, message: '不能为空'}
        ],
        isFree: [
          { required: true, message: '不能为空'}
        ],
        feeType: [
          { required: true, message: '不能为空'}
        ],
      },

      pushData: {
        id:undefined,
        name:undefined,
        isFree:undefined,
        feeType:undefined,
      },

      dialogTitle : undefined,
      dialogFormVisible:false,

      provinces:undefined,
      provinceSel:undefined,
      provinceShow:false,

      citys:undefined,
      citySel:undefined,
      cityShow:false,

      districts:undefined,
      districtSel:undefined,
      districtShow:false,

    }
  },
  mounted() {
    this.fetchProvinceList()
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$router.back();
    },
    addCityException(){
      this.dialogTitle = '请选择配送地'
      this.dialogFormVisible = true
    },
    fetchProvinceList(){
      fetchProvinceList().then(res => {
        this.provinces = res.data
        this.provinceShow = true
      })
    },
    cityDataChanged(type){
      if (type == 0) {
        
      }
    },
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

