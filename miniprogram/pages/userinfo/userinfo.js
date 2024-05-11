// pages/userinfo/userinfo.js
const db=wx.cloud.database()
const _=db.command
// 获取小程序实例
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    GetUserInfo:{
      name:"",
      mail:"",
      avatar:"",
      phonenumber:"",
      gender:"",
      height:"",
      weight:"",
      age:''
    },
    UserInfo:{
      name:"",
      mail:"",
      avatar:"",
      phonenumber:"",
      gender:"",
      height:"",
      weight:"",
      age:''
    }
  },

  //获取姓名
  Getname(e){
    console.log(e.detail)
    this.setData({
      'UserInfo.name':e.detail.value
    })
  },
  //获取邮箱
  Getemail(e){
    console.log(e.detail)
    this.setData({
      'UserInfo.mail':e.detail.value
    })
  },
  //获取年龄
  Getage(e){
    console.log(e.detail)
    this.setData({
      'UserInfo.age':e.detail.value
    })
  },
  //获取电话
  Getnumber(e){
    console.log(e.detail)
    this.setData({
      'UserInfo.phonenumber':e.detail.value
    })
  },
  //获取性别
  Getsex(e){
    console.log(e.detail)
    this.setData({
      'UserInfo.gender':e.detail.value
    })
  },
  //获取身高
  Getheight(e){
    console.log(e.detail)
    this.setData({
      'UserInfo.height':e.detail.value
    })
  },
  //获取体重
  Getweight(e){
    console.log(e.detail)
    this.setData({
      'UserInfo.weight':e.detail.value,
    })
  },
  async save(){
    //判断是否全部信息填写完整
    console.log(this.data.UserInfo.name)
    if(this.data.UserInfo.name&&this.data.UserInfo.mail&&this.data.UserInfo.phonenumber&&this.data.UserInfo.gender&&this.data.UserInfo.height&&this.data.UserInfo.weight&&this.data.UserInfo.age){  
      this.setData({
        'GetUserInfo.name':this.data.UserInfo.name,
        'GetUserInfo.mail':this.data.UserInfo.mail,
        'GetUserInfo.openid':this.data.openid,
        'GetUserInfo.phonenumber':this.data.UserInfo.phonenumber,
        'GetUserInfo.weight':this.data.UserInfo.weight,
        'GetUserInfo.height':this.data.UserInfo.height,
        'GetUserInfo.gender':this.data.UserInfo.gender,
        'GetUserInfo.age':this.data.UserInfo.age,
      })
      console.log(this.data.GetUserInfo)
      try {
        // 使用await等待查询结果
        const res = await wx.cloud.database().collection('userinfo').where({
          openid: this.data.UserInfo.openid
        }).get();
        
        // 检查查询结果
        if (res.data.length > 0) {
          // 如果找到了匹配的openid，执行这里的代码
          console.log('用户信息存在', res.data);
          db.collection('userinfo').where({openid: this.data.UserInfo.openid}).update({
            data:this.data.GetUserInfo,
            success: res => {
              console.log('数据更新成功', res);
              wx.setStorage('loginstate', true)
              wx.showToast({
                title: '保存成功',
              })
              wx.setStorageSync('loginstate', true)
              wx.switchTab({
                url: '../home/home',
              })
            },
            fail: err => {
              console.error('数据更新失败', err);
            }
          })  
        } else {
          // 如果没有找到匹配的openid，执行这里的代码
          console.log('用户信息不存在');
          db.collection('userinfo').add({
            data:this.data.GetUserInfo,
            success:res=>{
              wx.setStorageSync('loginstate', true)
            }
          })       
        }
      } catch (err) {
        console.error(err);
      }
       
        // then(res=>{
        //   console.log('保存成功',res)
        //   wx.switchTab({
        //     url: '../../pages/person/person',
        //   })
        // })  
    }else{wx.showToast({
      title: '请完整填写信息',
      icon:'error'
    })}
  },
  cancel(){
    wx.switchTab({
      url: '../person/person',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(app.globalData);
    this.data.openid = wx.getStorageSync('openid')
    db.collection('userinfo').where({openid:this.data.openid}).get().then(res=>{if(res.data.length>0){
      console.log(res.data)
      this.setData({
        UserInfo:res.data[0]
      })
    }})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})