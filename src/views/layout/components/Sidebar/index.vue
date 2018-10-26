<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu      
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { getInfo, myActions } from '@/api/login'
import { myInstallApiList } from '@/api/centerUserApi'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data() {
    return {
      routes :[]
    }
  },
  mounted() {
    let _this = this
    Promise.all([getInfo(), myInstallApiList(1, 10000, {isUse: true}), myActions()]).then(function(resArray) {
      if (!resArray[0].data.adminCenterUser) {
        isSubAdmin = false
      }
      if (resArray[1].code == 0) {
        resArray[1].data.result.forEach(ele => {
          myApiIds.push(ele.apiId)
        }) 
      }           
      resArray[2].data.forEach(ele => {
        myActionsUrls.push(ele.url)
      })      
      _this.$store.commit('SET_CENTER_USER_BASE',resArray[0].data)
      // 处理左侧菜单
      _this.routes = _this.filterRouters(_this.$router.options.routes, '')
    })    
  },
  methods: {
    filterRouters (routes, path) {
      let _this = this
      let _routes = []
      routes.filter(r => {
        // 模块权限过滤
        if (r.hidden) {
          return false
        }
        if (!r.meta) {
          return true
        }        
        // if (!isSubAdmin) {
        //   return true
        // }
        if (r.meta.isSuperAdmin && isSubAdmin) {
          return false
        }
        if (!r.meta.apiIds) {
          return true
        }
        let _r = false
        r.meta.apiIds.forEach(apiId => {
          if (myApiIds.includes(apiId)) {
            _r = true
            return
          }
        })
        return _r
      }).filter(r => {
        // 权限过滤
        if (!isSubAdmin) {
          return true
        }
        let fullPath = (path + (r.path.indexOf('/') == 0 ? r.path : '/' + r.path)).replace("//", "/") // 完整路径               
        if (!myActionsUrls.includes(fullPath)) {
          // console.log('84:', fullPath);
          return false
        }        
        return true
      }).forEach(r => {
        let fullPath = (path + (r.path.indexOf('/') == 0 ? r.path : '/' + r.path)).replace("//", "/") // 完整路径        
        if (r.children && r.children.length > 0) {
          r.children = _this.filterRouters(r.children, fullPath)
          if (r.children && r.children.length == 0) {
            r.children = undefined
          }
        }
        r.fullPath = fullPath
        _routes.push(r)
      })
      return _routes
    }
  }

}
</script>
