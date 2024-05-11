// app.js

App({
  globalData: {
    openid:'',
    avatar:"",
    name:"",
    key:''
  },
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        env:'yueda-0g7hp5b16ff067e6',
        traceUser: true,
      });
      const db=wx.cloud.database()
      const _=db.command
      //获取用户的openid
      wx.cloud.callFunction({
        name: "Getopenid"
      }).then(res => {
        //console.log("调用云函数成功：", res.result)
        // 在这里处理云函数返回的结果，例如将 OpenID 存储在本地或进行其他操作
        this.globalData.openid = res.result;
        wx.setStorageSync('openid', res.result)
      }).catch(err => {
        console.error("调用云函数失败：", err)
        // 在这里处理云函数调用失败的情况，例如显示错误提示
        wx.showToast({
          title: '获取 OpenID 失败，请稍后重试',
          icon: 'none'
        })
      })
      const abc = wx.getStorageSync('openid')
      //查询openid是否在数据库中存在
      db.collection('userinfo').where({openid:abc}).get({
        success: res => {
          //console.log(res.data)
          if (res.data.length > 0) {
            console.log('存在');
            this.globalData.key=true
            // 返回 key: true 或者进行其他操作
          } else {
            console.log('不存在');
            this.globalData.key=false
            // 返回 key: false 或者进行其他操作
            db.collection('userinfo').add({
              data:this.globalData
            })
          }
        },
        fail: err => {
          console.error('查询失败：', err);
          // 返回 key: false 或者进行其他操作
        }
      })
      const login = wx.getStorageSync('loginstate')
      if(!login){
        wx.switchTab({
        url: '../person/person'
      })}
      else if(this.globalData.key){
        wx.switchTab({
          url: '../miniprogram/pages/home/home',
        })
      }else{wx.switchTab({
        url: '/miniprogram/pages/person/person',
      })}
    }
    // // 将用户信息存储在全局数据中
    // const userInfo = wx.getStorageSync('userInfo')
    // this.globalData.userInfo = userInfo ? JSON.parse(userInfo) : null;
    
  },
  // 小程序启动时触发
  onShow(){
    // console.log('haha')
    
  }
  
});
