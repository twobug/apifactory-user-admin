<template>
  <div class="app-container">
    
    <el-collapse v-model="collapseActiveName" accordion>
      <el-collapse-item title="独立后台域名说明" name="1">
        <div>1、您的免费专属二级独立域名为: http://{{centerUserBase.domain}}.it120.cc ；</div>
        <div>2、更加体现你的个性化，可以绑定你自己的独立域名；</div>
        <div>3、绑定的域名必须是通过 ICP 备案通过的，有合法的备案号，否则将被取消接入；</div>
        <div>4、请将域名解析至 106.14.43.122</div>
        <div>5、独立域名绑定费用为 1000 元/个域名，不限使用期限；</div>
        <div>6、请使用“权限模块”中创建的管理员进行登录, <a style="color:red" href="https://www.it120.cc/info/faq/4827" target="_blank">「查看使用说明」</a>；</div>
      </el-collapse-item>
      <el-collapse-item title="api接口域名说明" name="2">
        <div>1、您可以修改默认的 api.it120.cc 域名；</div>
        <div>2、支付后请联系我们，我们将安排技术人员为您配置；</div>
      </el-collapse-item>
      <el-collapse-item title="Ajax域名说明" name="3">
        <div>1、绑定后可通过 ajax 方式调用工厂的接口；</div>
        <div>2、比如您自己的网站 www.yoursite.com 需要调用工厂接口，需要在此绑定 www.yoursite.com ；</div>
        <div>3、绑定后实时生效；</div>
      </el-collapse-item>
    </el-collapse>

    <div class="filter-container" style="margin-top:20px;">
      <el-button class="filter-item" size="medium" @click="handleCreate()" type="success" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="domain" label="域名"></el-table-column>
      <el-table-column prop="typeStr" label="类型"></el-table-column>
      <el-table-column prop="siteName" label="网站名称"></el-table-column>
      <el-table-column label="状态" width="100%">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == 0">待审核</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 1">不通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 3">过期</el-tag>
          <el-tag type="success" v-if="scope.row.status == 2">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="绑定时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope" v-if="scope.row.type == 0 || scope.row.type == 1">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button v-if="!scope.row.isPay" type="text" @click="buyDomain(scope.row.id)" style="color:red">支付</el-button>
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
        
        <el-form-item label="域名" prop="domain" >
          <el-input v-if="!pushData.id" v-model="pushData.domain" clearable @keyup.enter.native="handleCreateSave"></el-input>
          <div v-if="pushData.id">{{pushData.domain}}</div>
        </el-form-item>
        <el-form-item label="类型" prop="type" >
          <el-select v-model="pushData.type" placeholder="请选择">
            <el-option label="后台域名" :value="0"></el-option>
            <el-option label="Api域名" :value="1"></el-option>
            <el-option label="Ajax域名" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="pushData.type == 0 || pushData.type == 1" label="网站名称" prop="siteName" >
          <el-col :span="12">
            <el-input v-model="pushData.siteName" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="11" :offset="1" style="color:red;">
            显示在独立登录页面上方
          </el-col>
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
import { fetchDataList, infoData, getPayData, saveData } from '@/api/centerUserDomain'
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
      collapseActiveName:'1',


      page:1,
      pageSize:10,
      totalRow:0,

      imageUrl:undefined,
      uploadUrl:process.env.BASE_API + '/fileUpload',
      uploadUrlHeaders:{
        "X-Token":getToken()
      },

      rules: {
        domain: [
          { required: true, message: '不能为空'},
        ],
        siteName: [
          { required: true, message: '不能为空'},
        ],
        type: [
          { required: true, message: '不能为空'},
        ],
        picUrl: [
          { required: true, message: '不能为空'},
        ],
        status: [
          { required: true, message: '不能为空'},
        ],
        paixu: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        type:0,
      },

      dialogTableVisiblePay:false,
      alipayPostData:{},

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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.pushData.picUrl = res.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type.indexOf('image/') != -1);
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error('只能是图片格式!');
      }
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB!');
      }
      return isJPG && isLt1M;
    },
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
      this.imageUrl = undefined
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '绑定域名'
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
          this.pushData = Object.assign({}, this.pushDataTmp, res.data, {status:'' + res.data.status})
          this.imageUrl = res.data.picUrl
          this.pushData.dialogTitle = '修改域名信息'
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
    buyDomain(id){
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
