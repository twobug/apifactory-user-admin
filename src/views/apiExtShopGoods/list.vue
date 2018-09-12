<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="商品编号"
                v-model="searchData.id">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="条码编号"
                v-model="searchData.barCode">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.shopId" placeholder="所属店铺">
        <el-option
          v-for="item in shopData"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.categoryIdSel"
                 placeholder="商品分类">
        <el-option
          v-for="item in categoryData"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="商品名称"
                v-model="searchData.nameLike">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="商品特色"
                v-model="searchData.characteristicLike">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="商品状态">
        <el-option label="上架" value="0"></el-option>
        <el-option label="下架" value="1"></el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.recommendStatus"
                 placeholder="是否推荐">
        <el-option label="不推荐" value="0"></el-option>
        <el-option label="推荐" value="1"></el-option>
      </el-select>
      <el-button class="filter-item" size="medium" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" size="medium" style="margin-left: 10px;" @click="handleCreate" type="success"
                 icon="el-icon-edit">添加
      </el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
              empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55" row-key="id"></el-table-column>
      <el-table-column label="编号/条码">
        <template slot-scope="scope">
          {{scope.row.id}}<br>
          {{scope.row.barCode ? scope.row.barCode : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="门店/分类">
        <template slot-scope="scope">
          {{scope.row.shopName ? scope.row.shopName : '-'}}
          <br>
          {{scope.row.categoryName ? scope.row.categoryName : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          <font v-if="scope.row.recommendStatus == 1" style="color:green">[推荐]&nbsp;</font>
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="图片" min-width="100px" align="center">
        <template slot-scope="scope" v-if="scope.row.pic">
          <img :src="scope.row.pic" width="100" height="100">
        </template>
      </el-table-column>
      <el-table-column label="库存/状态" align="center">
        <template slot-scope="scope">
          {{scope.row.stores}}<br>
          <el-tag v-if="scope.row.status == 0" type="success">上架</el-tag>
          <el-tag v-if="scope.row.status == 1" type="danger">下架</el-tag>        
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          商品原价 : {{scope.row.originalPrice}}<br>
          最低价格 : {{scope.row.minPrice}}<br>
          砍价底价 : {{scope.row.kanjiaPrice}}<br>
          团购价格 : {{scope.row.pingtuanPrice}}
        </template>
      </el-table-column>
      <el-table-column prop="linkPhone" label="数据统计">
        <template slot-scope="scope">
          浏览量 : {{scope.row.views}}<br>
          收藏量 : {{scope.row.numberFav}}<br>
          订单数 : {{scope.row.numberOrders}}<br>
          销售数 : {{scope.row.numberSells}}<br>
          好评数 : {{scope.row.numberGoodReputation}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%" align="center">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="modifyNumberOrders(scope.row)">修改订单数</el-dropdown-item>
              <el-dropdown-item @click.native="modifyNumberSells(scope.row)">修改销量</el-dropdown-item>
              <el-dropdown-item @click.native="handleUpdate(scope.row.id)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="rebateUpdate(scope.row.id)">会员折扣</el-dropdown-item>
              <el-dropdown-item @click.native="delData(scope.row.id)" style="color:red">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-button style='margin-top:20px' type="success" @click="modifystatus(0)">上架</el-button>
    <el-button style='margin-top:20px' type="danger" @click="modifystatus(1)">下架</el-button>
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
        <el-form-item v-for="l in rebateData.levels" :key="l.id" :label="l.name" required :show-message="false">
          <el-col :span="4">
            <el-input v-model="l.rebate" clearable @keyup.enter.native="rebateUpdateSave"></el-input>
          </el-col>
          <el-col :span="20"> &nbsp;折</el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="rebateUpdateSave">确定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {delData, fetchDataList, getShopData, getShopGoodsCategoryData, modifyNumberOrders, modifyNumberSells, rebate, saveRebate, modifystatus} from '@/api/apiExtShopGoods'
  import {Message} from 'element-ui'
  import {mapGetters} from 'vuex'

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

        categoryData: [],
        shopData: [{label: '全部', value: ''},
          {label: '未归属任何店铺', value: 0}],
        rules: {
          goodsId: [
            {required: true, message: '不能为空'},
            {type: 'integer', message: '必须为数字'}
          ],
          number: [
            {required: true, message: '不能为空'},
            {type: 'integer', message: '必须为数字'}
          ],
          originalPrice: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字'}
          ],
          minPrice: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字'}
          ],
          helpPriceMin: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字'}
          ],
          helpPriceMax: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字'}
          ],
          status: [
            {required: true, message: '不能为空'}
          ],
          dateAddStr: [
            {required: true, message: '不能为空'}
          ],
          dateEndStr: [
            {required: true, message: '不能为空'}
          ],
          rebate: [
            {required: true, message: '不能为空'}
          ]
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dateAdd: '',
        dateUpdate: '',

        searchData: {
          id: undefined,
          barCode: undefined,
          status: undefined,
          nameLike: undefined,
          shopId: undefined,
          categoryIdSel: undefined,
          characteristicLike: undefined,
          recommendStatus: undefined,
          categoryValue: ''
        },

        pushData: {
          dialogTitle: undefined,
          dialogFormVisible: false,

          id: undefined,
          type: undefined,
          status: undefined,
          nameLike: undefined,
          addressLike: undefined,
          dateAddStr: undefined,
          dateEndStr: undefined
        },

        multipleSelection: [],
        list: null,
        listLoading: true,
        rebateData: {}
      }
    },
    created() {
      this.pushDataTmp = Object.assign({}, this.pushData);

      this.fetchData();

      this.getShopData();
      this.getShopGoodsCategoryData();
    },
    mounted() {

    },
    methods: {
      getShopData() {
        getShopData().then(response => {
          if (response.code === 0) {
            response.data.result.forEach((a) => {
              let v = {};
              v.value = a.id;
              v.label = a.name;
              this.shopData.push(v);
            })
          }
        })
      },
      getShopGoodsCategoryData() {
        getShopGoodsCategoryData().then(response => {
          const data = [];
          if (response.code === 0) {
            response.data.forEach((a) => {
              let v = {}, s = '';
              v.value = a.id;
              if (a.level > 1) {
                for (let i = 2; i < a.level; i++) {
                  s += '　　　　'
                }
                s += '╚═══'
              }
              v.label = s + a.name;
              data.push(v)
            })
          }
          this.categoryData = data
        })
      },
      handleDateAdd(val) {
        this.searchData.dateAddBegin = val ? val[0] : undefined;
        this.searchData.dateAddEnd = val ? val[1] : undefined
      },
      handleDateUpdate(val) {
        this.searchData.dateUpdateBegin = val ? val[0] : undefined;
        this.searchData.dateUpdateEnd = val ? val[1] : undefined
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.page = val
        this.fetchData()
      },
      fetchData() {
        this.list = null;
        this.listLoading = true;
        fetchDataList(this.page, this.pageSize, this.searchData).then(response => {
          if (response.code === 0) {
            this.list = response.data.result
            this.totalRow = response.data.totalRow
          }
          this.listLoading = false
        })
      },
      handleCreate() {
        this.$router.push({path: '/user/apiExtShopGoods/add'})
      },
      handleUpdate(id) {
        this.$router.push({path: '/user/apiExtShopGoods/add', query: {id: id}})
      },
      delData(id) {
        this.$confirm('删除无法恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delData(id).then(() => {
            Message({
              message: '删除成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.fetchData()
              }
            })
          })
        }).catch(() => {
        })
      },
      modifyNumberOrders(data){
        this.$prompt('请输入订单数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[0-9]+/,
          inputErrorMessage: '销量格式不正确'
        }).then(({ value }) => {
          modifyNumberOrders({id:data.id, numberOrders:value}).then(() => {
            Message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            })
            this.fetchData()
          })
        })
      },
      modifyNumberSells(data){
        this.$prompt('请输入销量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[0-9]+/,
          inputErrorMessage: '销量格式不正确'
        }).then(({ value }) => {
          modifyNumberSells({id:data.id, numberSells:value}).then(() => {
            Message({
              message: '修改成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.fetchData()
              }
            })
          })
        })
      },
      rebateUpdate(id){
        rebate(id).then(res => {
          if (res.code != 0) {
            Message({
              message: res.msg,
              type: 'error',
              duration: 3 * 1000
            })
          } else {
            this.rebateData = res.data
            this.pushData.id = id
            this.pushData.dialogTitle = '设置会员等级享受折扣'
            this.pushData.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['addEditPopForm'].clearValidate()
            })
          }
        }).catch(e=>{
          console.error(e);
        })
      },
      rebateUpdateSave(){
        this.$refs['addEditPopForm'].validate((valid) => {
          if (valid) {
            let postData = {}
            postData.id = this.pushData.id
            postData.detailsJsonStr = JSON.stringify(this.rebateData.levels)
            saveRebate(postData).then((res) => {
              this.pushData.dialogFormVisible = false
              if (res.code == 0) {
                Message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1 * 1000
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
      modifystatus(status){
        if (!this.multipleSelection.length) {
          Message({
            message: '请先选择需要操作的记录',
            type: 'error',
            duration: 1 * 1000
          })
          return
        }
        let ids = []
        this.multipleSelection.forEach(obj => {
          ids.push(obj.id)
        })
        modifystatus(ids.join(), status).then(res => {
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
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

  .el-range-editor.el-input__inner {
    padding: 7px 11px;
  }


</style>
