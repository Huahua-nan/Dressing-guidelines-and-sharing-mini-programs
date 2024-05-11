// pages/detail/detail.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo:[],
    comment:'', 
    title:'', 
    postavatar:'', 
    openid:'', 
    id:'',
    Updatetime:0,
    Createtime:0,
    commentnumber:0,
    defaultinput:"爱评论的人运气都不差",
    date:'',
    showMask: false, // 控制遮罩和输入框的显示状态
    inputContent: '', // 输入框中的内容
    commentid:'',
    iscollected:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options中包含了传递过来的所有参数
    this.Getdetail(options)
    this.TransformTime(this.data.Createtime)
    this.GetComment()
    this.GetCollect()
  },
  //获取该commentid对应的评论
  GetComment(){
    db.collection('review').where({commentid:this.data.commentid}).get({
      success:res=>{
        console.log(res,'评论查找成功')
        this.setData({
          List:res.data,
          commentnumber:res.data.length
        })
        
      },fail:err=>{
        console.log(err,'查找失败')
      }
    })
  },
  //获取share页面传过来的options数据
  Getdetail(options){
    console.log(options)
    this.setData({
      id : options.id, // 获取id参数
      photo : options.photo, // 获取photo参数
      comment : options.comment, // 获取comment参数
      title : options.title, // 获取title参数
      postavatar : options.postavatar, // 获取postavatar参数
      openid : options.openid, // 获取openid参数
      Createtime : options.Createtime,// 获取Createtime参数
      Updatetime : options.Updatetime, // 获取Updatetime参数
      commentid:options.commentid,
      List:[],//评论列表
      iscollected:options.iscollected,
      })
  },
  //将unix时间戳变回年月日
  TransformTime(Createtime){
    //console.log(Createtime)                     
    const timestamp = parseInt(Createtime); // 假设时间戳是 1711948458659 
    //console.log(timestamp)
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    console.log(formattedDate);
    this.setData({
      time:formattedDate
    })
  },
  showKeyboard() {
    // 显示遮罩和输入框
    this.setData({
      showMask: true
    });
  },
  hideKeyboard() {
    // 隐藏遮罩和输入框
    this.setData({
      showMask: false
    });
  },
  // 监听输入框输入事件
  handleInput(event) {
    console.log(event)
    this.setData({
      inputContent: event.detail.value, // 更新输入框内容
    });
  },
  // 发送按钮点击事件
  sendMessage() {
    // 在这里处理发送评论的逻辑
    console.log('发送评论：', this.data.inputContent);
    const data={
      avatar:this.data.postavatar,
      userid:this.data.id,
      review:this.data.inputContent,
      commentid:this.data.commentid
    }
    console.log(data)
    db.collection('review').add({
      data:data,
      success: res => {
        console.log('添加成功', res);
        this.GetComment()
      },
      fail: err => {
        console.error('添加失败', err);
      }
    })
        // 清空输入框内容
        this.setData({
          inputContent: '',
        });
  },
  //获取收藏情况
  GetCollect(){
    db.collection('comment').where({_id:this.data.commentid}).get({
      success:res=>{
        console.log(res,'获取收藏成功')
        if(res.data[0].iscollected == true){this.setData({
          iscollected:true
        })
      }else{this.setData({iscollected:false})}
      },fail:err=>{
        console.log(err,'获取收藏失败')
      }
    })
  },
  //点击收藏
  Collect(){
    this.setData({
      iscollected:true
    })
    db.collection('comment').where({_id:this.data.commentid}).update({
      data:{
        iscollected:true,
      },
      success:res=>{
        console.log('收藏成功',res)
        wx.showToast({
          title: '收藏成功',
          duration: 1,
          icon: icon,
          image: 'image',
          mask: true,
          success: (res) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
      }
    })
  },
  discollect(){
    this.setData({
      iscollected:false
    })
    db.collection('comment').where({_id:this.data.commentid}).update({
      data:{
        iscollected:false,
      },
      success:res=>{
        console.log('取消收藏')
        wx.showToast({
          title: '取消收藏',
          duration: 1,
          icon: icon,
          image: 'image',
          mask: true,
          success: (res) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
      }
    })
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