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
            <el-form-item label="默认运费">
              <el-col :span="3">
                <el-form-item prop="helpPriceMin">
                  <el-input v-model.number="pushData.helpPriceMin"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2" style="text-align:center;">件内</el-col>
              <el-col :span="3">
                <el-form-item prop="helpPriceMax">
                  <el-input v-model.number="pushData.helpPriceMax"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="4" style="text-align:center;">元，每增加</el-col>
              <el-col :span="3">
                <el-form-item prop="helpPriceMin">
                  <el-input v-model.number="pushData.helpPriceMin"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="4" style="text-align:center;">件，增加运费</el-col>
              <el-col :span="3">
                <el-form-item prop="helpPriceMin">
                  <el-input v-model.number="pushData.helpPriceMin"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2" style="text-align:center;">元</el-col>
            </el-form-item>
            <el-button type="text" @click="handleUpdate(scope.row.id)">为指定地区城市设置运费</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {

      feeTypes:[
        {type:0, name:'快递', isChecked:false},
        {type:1, name:'EMS', isChecked:false},
        {type:2, name:'平邮', isChecked:false},
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
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$router.back();
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

