Page({
  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      // 用户点击了允许授权按钮
      const userInfo = e.detail.userInfo;
      console.log(userInfo); // 这里可以获取到用户头像和昵称等信息
      // 调用wx.login获取code
      wx.login({
        success: res => {
          const code = res.code;
          // 将code发送到服务器，由服务器请求openid
          // 这里需要你自行实现代码发送和请求openid的服务器逻辑
          console.log(code); // 打印code，实际开发中需发送到你的服务器
        }
      });
    } else {
      // 用户点击了拒绝按钮
      wx.showModal({
        title: '提示',
        content: '需要您的授权才能登录',
        showCancel: false
      });
    }
  }
});
  