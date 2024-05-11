// pages/managepost/managepost.js
const db=wx.cloud.database()
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    id:'',
    avatar:'',
    List:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.openid=wx.getStorageSync('openid')
    this.Get()
  },
  //获取自己发布的帖子和头像id
  Get(){
    db.collection('comment').where({openid:this.data.openid}).get({
      success:res=>{
        console.log(res)
        this.setData({
          List:res.data,
        })
      }
    })
    db.collection('userinfo').where({openid:this.data.openid}).get({
      success:res=>{
        console.log(res)
        this.setData({
          avatar:res.data[0].avatar,
          id:res.data[0].name
        })
      }
    })
  },
  //修改帖子
  classify(event){
    console.log(event)
    const id = event.currentTarget.dataset.item._id

  },
  //删除帖子
  delete(event){
    console.log(event)
    const id = event.currentTarget.dataset.item._id
    db.collection('comment').doc(id).remove().then(res => {
      console.log('删除成功', res);
      wx.showToast({
        title: '删除成功',
        duration: 800,
        icon:'success'
      })
      this.Get()
    }).catch(err => {
      console.error('删除失败', err);
      wx.showToast({
        title: '删除失败',
        duration: 800,
        icon:'loading'
      })
    });
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