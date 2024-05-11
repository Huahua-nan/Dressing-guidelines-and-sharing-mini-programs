// pages/person/person.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp()
const db=wx.cloud.database()
const _=db.command
// const imageHash = require('image-hash');
// const fs = require('fs');

//const userInfo = app.globalData.userInfo
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    openid:'',
    name:'',
    weight:'0',
    height:'0',
    userInfoBar:[
      {
        icon: "../img/class.png",
        title: "身高",
        littleTitle: "cm",
        click: "info"
      },{
        icon: "../img/class.png",
        title: "体重",
        littleTitle: "kg",
        click: "info"
      }
    ],list:[
      {
        icon: "../img/aboutUs.png",
        title: "帖子浏览",
        click: "history"
      }, {
        icon: "../img/update.png",
        title: "帖子收藏",
        click: "collect"
      }, {
        icon: "../img/login.png",
        title: "帖子管理",
        click: "managepost"
      }
    ],
  },

//用户头像
  onChooseAvatar(e) {
    wx.getStorage({
        key:'loginstate',
        success:res=>{
          console.log('用户已登录')
        },fail:err=>{
          console.log('用户未登录')
          wx.navigateTo({
            url: '../userinfo/userinfo',
          })
      }
    })
    if(!this.data.name){
      wx.navigateTo({
        url: '../userinfo/userinfo',
      })
      return
    }
    let that = this
    wx.chooseMedia({
      count:1,
      mediaType: ['image'], // 可选择的媒体文件类型，可以是 'image'、'video' 或 'audio' 的组合
      sourceType: ['album', 'camera'], // 可选择的媒体文件来源，可以是 'album'、'camera' 的组合
      success(res){
        console.log(res)
        that.setData({
          avatarUrl:res.tempFiles[0].tempFilePath
        })
        wx.cloud.uploadFile({
          cloudPath: 'avatar/' + new Date().getTime() + '.png', // 上传至云端的路径
          filePath: that.data.avatarUrl, // 小程序临时文件路径
          success: res => {
            console.log('上传成功', res.fileID);
            const imageUrl = res.fileID; // 获取到图片的永久链接
            // 将图片链接保存到数据库中的 avatar 字段
            db.collection('userinfo').where({openid:that.data.openid}).update({
              data: {
                avatar: imageUrl
              },
              success(updateRes) {
                console.log('保存成功', updateRes);
              },
              fail(updateError) {
                console.error('保存失败', updateError);
              }
            });
          },
          fail: chooseError => {
            console.error('上传失败', chooseError);
          }
        });
      },fail(error) {
        console.error('选择文件失败:', error);
      }
    })
  // const newavatarUrl=e.detail.avatarUrl
  // //console.log(newavatarUrl)
  // this.setData({
  //   avatarUrl:newavatarUrl
  // })
  // //console.log(this.data.avatarUrl)
  // wx.setStorageSync("avatar", this.data.avatarUrl)
},
//用户名称
onInputNickname(e){
  wx.navigateTo({
    url: '../userinfo/userinfo',
  })
  // const newvalue = e.detail.value;
  // //console.log(newvalue)
  // this.setData({
  //   name: newvalue
  // })
  // // console.log(this.data.name)
  // wx.setStorageSync('name', this.data.name)
},
//身高、体重
  info(event) {
    // 处理 tap 事件的代码
    console.log("Tap event triggered");
    // 可以在这里执行你的操作，例如跳转页面等
    wx.navigateTo({
      url: '../../pages/userinfo/userinfo',
    })
  },
  //查看帖子收藏
  collect(){
    wx.navigateTo({
      url: '../collect/collect',
    })
  },
  //查看帖子浏览记录
  history(){
    wx.navigateTo({
      url: '../history/history',
    })
  },
  //管理自己发布的帖子
  managepost(){
    wx.navigateTo({
      url: '../managepost/managepost',
    })
  },
//   // 读取并计算图片的哈希值
//   computeHash(filePath) {
//     return new Promise((resolve, reject) => {
//       fs.readFile(filePath, (err, data) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(imageHash(data));
//         }
//       });
//     });
//   },
//   // 比较两张图片的哈希值
// async compareImages(filePath1, filePath2) {
//   try {
//     const hash1 = await computeHash(filePath1);
//     const hash2 = await computeHash(filePath2);
//     return hash1 === hash2;
//   } catch (error) {
//     console.error('Error:', error);
//     return false;
//   }
// },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.openid = wx.getStorageSync('openid')
    db.collection('userinfo').where({openid:this.data.openid}).get({
      success:res=>{
        wx.setStorageSync('loginstate', true)
        //同步用户的身高体重
        this.setData({
          name:res.data[0].name,
          avatarUrl:res.data[0].avatar,
          height:res.data[0].height,
          weight:res.data[0].weight
        })
        this.setData({
          'userInfoBar[0].littleTitle': this.data.height + "cm",
          'userInfoBar[1].littleTitle': this.data.weight + "kg"
        });
      },fail:err=>{
        console.error('失败', err);
      }
    })
    // this.info()
    // db.collection('userinfo').where({openid:this.data.userInfo}).get({
    //   success:res=>{
    //     console.log(res.data)
    //     this.setData({
    //       'userInfo.name':res.data.name
    //     })
    //   }
    // })
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