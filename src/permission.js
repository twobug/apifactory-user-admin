import router from './router'
import { checkToken, logout } from '@/api/login'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { setToken, getToken, removeToken } from '@/utils/auth' // 验权

const whiteList = ['/login', '/register', '/resetpwd'] // 不判断权限白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.query.token) {
    setToken(to.query.token)
  }  
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      checkToken().then(res => { // 判断token有效性
        next()
      }).catch((err) => {
        logout().then(() => {
          Message.error(err || '已成功退出')
          removeToken()
          next({ path: '/' })
        })
      })
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
