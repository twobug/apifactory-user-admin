import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import { myInstallApiList } from '@/api/centerUserApi'

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

// Vue.prototype.tinymceUploadUrls = [] 原型变量，不是全局变量
window.tinymceUploadUrls = []
window.isSubAdmin = true // 当前登录用户是否为子账户
window.myActionsUrls = ['/', '/user', '/dashboard'] // 我的权限URLS
window.myApiIds = [] // 安装的模块编号


Vue.directive('checkInstalledApi', { // 判断是否有安装某些模块
  bind: function(el, binding) {
    el.style.display = 'none'
    if (myApiIds.length == 0) {
      myInstallApiList(1, 10000, {isUse: true}).then(res => {
        if (res.code == 0) {
          res.data.result.forEach(ele => {
            myApiIds.push(ele.apiId)
          })
          binding.value.forEach(v => {
            if (myApiIds.includes(v)) {
              el.style.display = ''
              return
            }
          })
        }
      })
    } else {
      binding.value.forEach(v => {
        if (myApiIds.includes(v)) {
          el.style.display = ''
          return
        }
      })
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

