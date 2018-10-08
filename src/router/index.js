import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/register', component: () => import('@/views/login/register'), hidden: true},
  {path: '/resetpwd', component: () => import('@/views/login/resetpwd'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},

  {
    name: '修改密码',
    path: '/editPwd',
    hidden: true,
    component: Layout,
    meta: {title: '修改密码', icon: 'setting'},
    children: [{
      path: '',
      component: () => import('@/views/editPwd/list')
    }]
  },

  {
    name: '首页',
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  },

  {
    name: '工厂设置',
    path: '/user',
    component: Layout,
    redirect: '/user/centerUserResourceBundle/list',
    meta: {title: '工厂设置', icon: 'setting'},
    children: [
      // {
      //   path: 'external-link', 外部链接添加模板
      //   component: Layout,
      //   children: [
      //     {
      //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
      //       meta: { title: 'externalLink', icon: 'link' }
      //     }
      //   ]
      // },
      {
        name: '模块管理',
        path: 'centerUserApi/list',
        component: () => import('@/views/centerUserApi/list'),
        meta: {title: '模块管理', icon: 'mokuai'}
      },
      {
        name: '推广赚钱',
        path: 'spread/list',
        component: () => import('@/views/spread'),
        meta: {title: '推广赚钱', icon: 'tuiguang', noKeepAlive: true}
      },      
      {
        name: '我的资源包',
        path: 'centerUserResourceBundle/list',
        component: () => import('@/views/centerUserResourceBundle/list'),
        meta: {title: '我的资源包', icon: 'ziyuan'}
      },      
      {
        name: '绑定域名',
        path: 'centerUserDomain/list',
        component: () => import('@/views/centerUserDomain/list'),
        meta: {title: '绑定域名', icon: 'domain'}
      }]
  },
  {
    name: '系统设置',
    path: '/user',
    component: Layout,
    redirect: '/user/apiExtDfs/list',
    meta: {title: '系统设置', icon: 'setting'},
    children: [{
      name: '系统参数',
      path: 'apiExtConfig/list',
      component: () => import('@/views/apiExtConfig/list'),
      meta: {title: '系统参数', icon: 'setting'}
    },
    {
      name: '友情链接',
      path: 'apiExtFriendlyPartner/list',
      component: () => import('@/views/apiExtFriendlyPartner/list'),
      meta: {title: '友情链接', icon: 'yqlj'}
    },
    {
      name: '签到积分规则',
      path: 'apiExtUserScoreSignRule/list',
      component: () => import('@/views/apiExtUserScoreSignRule/list'),
      meta: {title: '签到积分规则', icon: 'scoreSignRule'}
    },
    {
      name: '积分赠送规则',
      path: 'userScoreSendRule/list',
      component: () => import('@/views/userScoreSendRule/list'),
      meta: {title: '积分赠送规则', icon: 'scoreSignRule'}
    },
    {
      name: '图片验证码设置',
      path: 'apiExtVerificationPicConfig/list',
      component: () => import('@/views/apiExtVerificationPicConfig/list'),
      meta: {title: '图片验证码设置', icon: 'yzm'}
    },
    {
      name: '上传文件管理',
      path: 'apiExtDfs/list',
      component: () => import('@/views/apiExtDfs/list'),
      meta: {title: '上传文件管理', icon: 'files'}
    },
    {
      name: '三方小程序支付',
      path: 'centerUserSetSaobei/list',
      component: () => import('@/views/centerUserSetSaobei/list'),
      meta: {title: '三方小程序支付', icon: 'saobei'}
    },
    {
      name: 'Banner管理',
      path: 'apiExtBanner/list',
      component: () => import('@/views/apiExtBanner/list'),
      meta: {title: 'Banner管理', icon: 'banner'}
    },
    {
      name: 'Json接口数据',
      path: 'apiExtJson/list',
      component: () => import('@/views/apiExtJson/list'),
      meta: {title: 'Json数据管理', icon: 'json'}
    },
    {
      name: '接口转发',
      path: 'apiExtApiTransmit/list',
      component: () => import('@/views/apiExtApiTransmit/list'),
      meta: {title: '接口转发', icon: 'zhuanfa'}
    }]
  },
  {
    name: 'CMS模块',
    path: '/user',
    component: Layout,
    redirect: '/user/apiExtNewsCategory/list',
    meta: {title: 'CMS模块', icon: 'cms'},
    children: [
      {
        name: '分类管理',
        path: 'apiExtNewsCategory/list',
        component: () => import('@/views/apiExtNewsCategory/list'),
        meta: {title: '分类管理', icon: 'category'}
      },
      {
        name: '文章管理',
        path: 'apiExtNews/list',
        component: () => import('@/views/apiExtNews/list'),
        meta: {title: '文章管理', icon: 'articles'}
      },
      {
        name: '添加文章',
        path: 'apiExtNews/add',
        component: () => import('@/views/apiExtNews/add'),
        meta: {title: '添加文章', icon: 'articles', noKeepAlive: true},
        hidden: true
      },
      {
        name: '留言管理',
        path: 'apiExtComment/list',
        component: () => import('@/views/apiExtComment/list'),
        meta: {title: '留言管理', icon: 'liuyan'}
      },
      {
        name: '单页管理',
        path: 'apiExtPage/list',
        component: () => import('@/views/apiExtPage/list'),
        meta: {title: '单页管理', icon: 'page'}
      },
      {
        name: '添加单页',
        path: 'apiExtPage/add',
        component: () => import('@/views/apiExtPage/add'),
        meta: {title: '添加单页', icon: 'page', noKeepAlive: true},
        hidden: true
      },
      {
        name: '公告管理',
        path: 'apiExtNotice/list',
        component: () => import('@/views/apiExtNotice/list'),
        meta: {title: '公告管理', icon: 'gonggao'}
      },
      {
        name: '添加公告',
        path: 'apiExtNotice/add',
        component: () => import('@/views/apiExtNotice/add'),
        meta: {title: '添加公告', icon: 'gonggao', noKeepAlive: true},
        hidden: true
      }]
  },
  {
    name: '微信设置',
    path: '/user',
    component: Layout,
    redirect: '/user/centerUserWxKey/list',
    meta: {title: '微信设置', icon: 'wx'},
    children: [
      {
      name: '微信设置',
      path: 'centerUserWxKey/list',
      component: () => import('@/views/centerUserWxKey/list'),
      meta: {title: '微信设置', icon: 'setting'}
    },
    {
      name: '自动回复',
      path: 'wxAutoReply/list',
      component: () => import('@/views/wxAutoReply/list'),
      meta: {title: '自动回复', icon: 'dxsz'}
    },
    {
      name: '公众号菜单',
      path: 'wxMenu/list',
      component: () => import('@/views/wxMenu/list'),
      meta: {title: '公众号菜单', icon: 'table'}
    },
    {
      name: '客服设置',
      path: 'kefuMember/set',
      component: () => import('@/views/kefuMember/centerUserSetKefu'),
      meta: {title: '客服设置', icon: 'setting'}
    },
    {
      name: '客服人员管理',
      path: 'kefuMember/list',
      component: () => import('@/views/kefuMember/list'),
      meta: {title: '客服人员管理', icon: 'userList'}
    },
    {
      name: '销售记录',
      path: 'kefuBuyLog/list',
      component: () => import('@/views/kefuMember/kefuBuyLog'),
      meta: {title: '销售记录', icon: 'xstb'}
    }]
  },
  {
    name: '用户管理',
    path: '/user',
    component: Layout,
    redirect: '/user/apiExtUser/list',
    meta: {title: '用户管理', icon: 'user'},
    children: [{
      name: '会员等级',
      path: 'apiExtUserLevel/list',
      component: () => import('@/views/apiExtUser/apiExtUserLevel'),
      meta: {title: '会员等级', icon: 'userlevel'}
    },{
      name: '用户列表',
      path: 'apiExtUser/list',
      component: () => import('@/views/apiExtUser/list'),
      meta: {title: '用户列表', icon: 'userList'}
    },
    {
      name: '收货地址',
      path: 'apiExtUserShippingAddress/list',
      component: () => import('@/views/apiExtUserShippingAddress/list'),
      meta: {title: '收货地址', icon: 'address'}
    },{
      name: '收货地址',
      path: 'apiExtUserShippingAddress/add',
      component: () => import('@/views/apiExtUserShippingAddress/add'),
      meta: {noKeepAlive: true},
      hidden: true
    }]
  },
  {
    name: '排队叫号',
    path: '/user',
    component: Layout,
    redirect: '/user/queuingUpType/list',
    meta: {title: '排队叫号', icon: 'paiduijiaohao'},
    children: [{
      name: '队列维护',
      path: 'queuingUpType/list',
      component: () => import('@/views/queuingUpType/list'),
      meta: {title: '队列维护', icon: 'paiduijiaohao'}
    },
    {
      name: '取号列表',
      path: 'queuingUpLog/list',
      component: () => import('@/views/queuingUpLog/list'),
      meta: {title: '取号列表', icon: 'jiaohao'}
    }]
  },
  {
    name: '财务管理',
    path: '/user',
    component: Layout,
    redirect: '/user/extDiscountsCoupon/list',
    meta: {title: '财务管理', icon: 'caiwu'},
    children: [{
      name: '优惠券规则',
      path: 'extDiscountsCoupon/list',
      component: () => import('@/views/extDiscountsCoupon/list'),
      meta: {title: '优惠券规则', icon: 'juan'}
    },
    {
      name: '优惠券管理',
      path: 'extDiscountsCouponUser/list',
      component: () => import('@/views/extDiscountsCoupon/extDiscountsCouponUser'),
      meta: {title: '优惠券管理', icon: 'juan'}
    },
    {
      name: '积分券管理',
      path: 'userScoreTicket/list',
      component: () => import('@/views/userScoreTicket/list'),
      meta: {title: '积分券管理', icon: 'score'}
    },
    {
      name: '用户资产管理',
      path: 'apiExtUserCash/list',
      component: () => import('@/views/apiExtUserCash/list'),
      meta: {title: '用户资产管理', icon: 'caiwu'}
    },
    {
      name: '用户积分记录',
      path: 'apiExtUserScoreLog/list',
      component: () => import('@/views/apiExtUserScoreLog/list'),
      meta: {title: '用户积分记录', icon: 'score'}
    },
    {
      name: '支付记录',
      path: 'apiExtUserPay/list',
      component: () => import('@/views/apiExtUserPay/list'),
      meta: {title: '支付记录', icon: 'paylog'}
    },
    {
      name: '提现管理',
      path: 'extUserWithdraw/list',
      component: () => import('@/views/extUserWithdraw/list'),
      meta: {title: '提现管理', icon: 'tixian'}
    },
    {
      name: '支付宝收钱码',
      path: 'alipayTransferQrcode/list',
      component: () => import('@/views/alipayTransferQrcode/list'),
      meta: {title: '支付宝收钱码', icon: 'alipaySR'}
    },
    {
      name: '支付宝转账记录',
      path: 'alipayTransfer/list',
      component: () => import('@/views/alipayTransfer/list'),
      meta: {title: '支付宝转账记录', icon: 'alipaySR'}
    }]
  },
  {
    name: '短信设置',
    path: '/user',
    component: Layout,
    redirect: '/user/apiExtSmsConfig/list',
    meta: {title: '短信设置', icon: 'dxsz'},
    children: [{
      name: '验证码设置',
      path: 'apiExtSmsConfig/list',
      component: () => import('@/views/apiExtSmsConfig/list'),
      meta: {title: '验证码设置', icon: 'verificationCode'}
    },{
      name: '验证码设置add',
      path: 'apiExtSmsConfig/add',
      component: () => import('@/views/apiExtSmsConfig/add'),
      meta: {noKeepAlive: true},
      hidden: true
    },
      {
        name: '短信记录',
        path: 'logSms/list',
        component: () => import('@/views/logSms/list'),
        meta: {title: '短信记录', icon: 'sms'}
      }]
  },
  {
    name: '商城管理',
    path: '/user',
    component: Layout,
    redirect: '/user/apiExtShopSub/list',
    meta: {title: '商城管理', icon: 'shopping'},
    children: [{
      name: '店铺管理',
      path: 'apiExtShopSub/list',
      component: () => import('@/views/apiExtShopSub/list'),
      meta: {title: '店铺管理', icon: 'shop'}
    },
      {
        name: '店铺管理',
        path: 'apiExtShopSub/add',
        component: () => import('@/views/apiExtShopSub/add'),
        meta: {noKeepAlive: true},
        hidden: true
      },
      {
        name: '商品分类',
        path: 'apiExtShopGoodsCategory/list',
        component: () => import('@/views/apiExtShopGoodsCategory/list'),
        meta: {title: '商品分类', icon: 'category'}
      },
      {
        name: '规格尺寸',
        path: 'apiExtShopProperty/list',
        component: () => import('@/views/apiExtShopProperty/list'),
        meta: {title: '规格尺寸', icon: 'guigecicun'}
      },
      {
        name: '运费模板',
        path: 'apiExtShopFreightTemplate/list',
        component: () => import('@/views/apiExtShopFreightTemplate/list'),
        meta: {title: '运费模板', icon: 'yunfeimoban'}
      },
      {
        name: '添加修改运费模板',
        path: 'apiExtShopFreightTemplate/add',
        component: () => import('@/views/apiExtShopFreightTemplate/add'),
        meta: {title: '运费模板', icon: 'yunfeimoban', noKeepAlive: true},        
        hidden: true
      },
      {
        name: '商品管理',
        path: 'apiExtShopGoods/list',
        component: () => import('@/views/apiExtShopGoods/list'),
        meta: {title: '商品管理', icon: 'goods'}
      },
      {
        name: '商品管理',
        path: 'apiExtShopGoods/add',
        component: () => import('@/views/apiExtShopGoods/add'),
        meta: {noKeepAlive: true},
        hidden: true
      },
      {
        name: '订单列表',
        path: 'apiExtOrder/list',
        component: () => import('@/views/apiExtOrder/list'),
        meta: {title: '订单管理', icon: 'order'}
      },
      {
        name: '订单详情',
        path: 'apiExtOrder/detail',
        component: () => import('@/views/apiExtOrder/detail'),
        meta: {title: '订单管理', icon: 'order', noKeepAlive: true},
        hidden: true
      },
      {
        name: '评价管理',
        path: 'apiExtOrderEvaluate/list',
        component: () => import('@/views/apiExtOrderEvaluate/list'),
        meta: {title: '评价管理', icon: 'pingjia'}
      },
      {
        name: '达达门店',
        path: 'expressDadaShopCitycode/list',
        component: () => import('@/views/expressDadaShopCitycode/list'),
        meta: {title: '达达门店', icon: 'dada'}
      },
      {
        name: '知识交易设置',
        path: 'virtualTraderSet/list',
        component: () => import('@/views/virtualTraderSet/list'),
        meta: {title: '知识交易设置', icon: 'zhishi'}
      },
      {
        name: '添加知识交易',
        path: 'virtualTraderSet/add',
        component: () => import('@/views/virtualTraderSet/add'),
        meta: {title: '知识交易', icon: 'zhishi', noKeepAlive: true},        
        hidden: true
      },
      {
        name: '知识交易记录',
        path: 'virtualTraderBuyLog/list',
        component: () => import('@/views/virtualTraderBuyLog/list'),
        meta: {title: '知识交易记录', icon: 'zhishi'}
      }]
  },

  {
    name: '支付宝小程序',
    path: '/user',
    component: Layout,
    redirect: '/user/centerUserAliappKey/list',
    meta: {title: '支付宝小程序', icon: 'alipaySR'},
    children: [{
      name: 'Appid配置',
      path: 'centerUserAliappKey/list',
      component: () => import('@/views/centerUserAliappKey/list'),
      meta: {title: '支付宝小程序', icon: 'alipaySR'}
    }]
  },

  {
    name: '视频点播',
    path: '/user/apiExtVod',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '视频点播',
        component: () => import('@/views/apiExtVod/list'),
        meta: {title: '视频点播', icon: 'video'}
      }
    ]
  },
  {
    name: '预约报名',
    path: '/user',
    component: Layout,
    redirect: '/user/yuyueInfo/list',
    meta: {title: '预约报名', icon: 'yuyue'},
    children: [
      {
        name: '项目设置',
        path: 'yuyueInfo/list',
        component: () => import('@/views/yuyueInfo/list'),
        meta: {title: '项目设置', icon: 'yuyue'}
      },
      {
        name: '添加预约报名项目',
        path: 'yuyueInfo/add',
        component: () => import('@/views/yuyueInfo/add'),
        meta: {title: '添加预约报名项目', icon: 'yuyue', noKeepAlive: true},
        hidden: true
      },  
      {
        name: '预约记录',
        path: 'yuyueJoin/list',
        component: () => import('@/views/yuyueJoin/list'),
        meta: {title: '预约记录', icon: 'yuyue'}
      },    
      ]
  },
  {
    name: '营销辅助',
    path: '/user',
    component: Layout,
    redirect: '/user/kanjiaSet/list',
    meta: {title: '营销辅助', icon: 'yingxiao'},
    children: [{
      name: '砍价设置',
      path: 'kanjiaSet/list',
      component: () => import('@/views/kanjiaSet/list'),
      meta: {title: '砍价设置', icon: 'kanjia'}
    },
      {
        name: '砍价参与用户',
        path: 'kanjiaJoiner/list',
        component: () => import('@/views/kanjiaJoiner/list'),
        meta: {title: '砍价参与用户', icon: 'kanjia'}
      },
      {
        name: '砍价明细',
        path: 'kanjiaHelp/list',
        component: () => import('@/views/kanjiaHelp/list'),
        meta: {title: '砍价明细', icon: 'kanjia'}
      },
      {
        name: '拼团设置',
        path: 'pingtuanSet/list',
        component: () => import('@/views/pingtuanSet/list'),
        meta: {title: '拼团设置', icon: 'pingtuan'}
      },
      {
        name: '开团记录',
        path: 'pingtuanOpener/list',
        component: () => import('@/views/pingtuanOpener/list'),
        meta: {title: '开团记录', icon: 'pingtuan'}
      },
      {
        name: '拼团记录',
        path: 'pingtuanHelp/list',
        component: () => import('@/views/pingtuanHelp/list'),
        meta: {title: '拼团记录', icon: 'pingtuan'}
      }]
  },

  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
