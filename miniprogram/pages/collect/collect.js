// pages/share/share.js
import {
  getMockData
} from "../../components/mock/index"

const db=wx.cloud.database()
const _ = db.command
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //colorList:[],
    // username:'zs'
    commentList:[],
    page:0,
    pagesize:10,
    total:0,
    list: [],
    leftList: [],
    rightList: [],
    
    photo:[],
    comment:'',
    title:'',
    postavatar:'',
    openid:'',
    id:'',
    Createtime:'',
    Updatetime:'',
    iscollected:'',
    nomore:false,// 是否没有更多数据的标志
    // userinfo:{},
    // avatar:'',
    // hasUserInfo: false,
    // canIUseGetUserProfile:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.getcolors()
    // this.getComments(),
    //获取虚拟数据
    this.getLatestData()
    // getMockData().then((res) => {
    //   this.setData({
    //     list: res
    //   })
    //   //console.log(res)
    //   //将虚拟数据填到小程序leftlist和rightlist中
    //   this.setList(res)
    // })
    // if(this.getuserprofile){
    //   this.setData({
    //     canIUseGetUserProfile:true
    //   })
    // }
  },
  // newGetInfo: function (e) {
  //   var that=this
  //   wx.getUserProfile({
  //     desc: '正在获取', //不写不弹提示框
  //     success: function (res) {
  //       console.log("获取成功:", res)
  //       that.setData({
  //         nickname:res.userInfo.nickName,
  //         avatar:res.userInfo.avatarUrl
  //       })
  //     },
  //     fail: function (err) {
  //       console.log("获取失败: ", err)
  //     }
  //   })
  // },
  // getuserprofile(){
  //   wx.getUserProfile({
  //     desc: '获取信息',
  //     success:res=>{
  //       hasUserInfo:true
  //       console.log(res.userInfo)
  //       this.setData({
  //         userinfo:res.userinfo,
          
  //       })
  //     },
      
  //   })
  // },
  // db.collection('todos')
  // .where({
  //   _openid: 'xxx', // 填入当前用户 openid
  // })
  // .skip(10) // 跳过结果集中的前 10 条，从第 11 条开始返回
  // .limit(10) // 限制返回数量为 10 条
  // .get()
  // .then(res => {
  //   console.log(res.data)
  // })
  // .catch(err => {
  //   console.error(err)
  // })
  // getcolors(){//获取颜色
  //   db.collection('color').where({color:db.command.neq(null)}).get({
  //     success:res=>{
  //       console.log("获取颜色数据成功",res)
  //       // const firstColor = res.data[0].colour;
  //       this.setData({
  //         colorList:res.data
  //       }),
  //       console.log(this.data.colorList)
  //     },fail(err){
  //       console.error('获取颜色数据失败', err)
  //   }
  //   })
  // },
  //获取评论数据
  
  // getComments(){
  //   db.collection('comment').limit(this.data.pagesize).skip(this.data.page).where({_updateTime:_.gte(1709782738493)}).get({
  //     success:res=>{
  //       console.log(res)
  //       this.setData({
  //         list:res.data,
  //         total:res.data.length
  //       })
        
  //     }
  //   })
  // },
  setList: async function (newList) {
    for (let i in newList) {
      await this.setItem(newList[i])
    }
  },
  setItem(item) {
    let leftList = this.data.leftList
    let rightList = this.data.rightList
    return new Promise((resolve) => {
      Promise.all([this.getElementSize('#leftList'), this.getElementSize('#rightList')]).then((res) => {
        let leftElement = res[0][0]
        let rightElement = res[1][0]
        //console.log(res) 打印左右list
        if (leftElement.height > rightElement.height) {
          rightList.push(item)
        } else {
          leftList.push(item)
        }
        this.setData({
          leftList,
          rightList
        }, function () {
          resolve()
        })
      })
    })
  },
  getElementSize(selector) {
    return new Promise((resolve) => {
      let query = wx.createSelectorQuery()
      query.select(selector).fields({
        size: true
      }).exec((res) => {
        resolve(res)
      })
    })
  },
  //添加帖子的悬浮按钮
  handleFloatButtonClick(){
    wx.navigateTo({
      url: '../post/post',
    })
  },
  //点击item将帖子item的值传到detail页面详细查看
  Detail(event){
    // 获取当前点击的 item 数据
    console.log(event)
    const currentItem = event.currentTarget.dataset.item;
    console.log(currentItem)
    // 从 currentItem 中获取需要的字段值
    const { comment, title, avatar, openid, id,Createtime,Updatetime,commentid,iscollected} = currentItem;
    // 跳转到新页面，并传递数据
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&photo=' + currentItem.photo + '&comment=' + comment + '&title=' + title + '&postavatar=' + avatar + '&openid=' + openid + '&Createtime=' + Createtime + '&Updatetime=' + Updatetime+'&commentid='+commentid +'&iscollected=' + iscollected,
    });
  },
  // 获取最新数据（前 10 条）
  getLatestData() {
    // 加载第一页的数据
    this.setData({
      page: 0,
      nomore: false // 重置没有更多数据的标志
    });
    getMockData({ page: 0, pagesize: this.data.pagesize }).then((res) => {
      const filteredList = res.filter(item => item.iscollected === true);
      this.setData({
        list: filteredList
      });
      this.setList(filteredList);
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
  // 检查是否需要刷新页面
  const needRefresh = wx.getStorageSync('needRefresh');
  if (needRefresh) {
    // 清除标志
    wx.removeStorageSync('needRefresh');
    // 获取最新数据并更新页面
    this.getLatestData();
  }
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
    console.log('触发了上拉触底事件')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log("触发了上拉触底事件")
    if (this.data.nomore) return; // 如果没有更多数据，则不执行加载操作

    // 加载下一页的数据
    const nextPage = this.data.page + 1;
    getMockData({ page: nextPage, pagesize: this.data.pagesize }).then((res) => {
      if (res.length > 0) {
        console.log(res)//获得了两条新数据
        // 如果有数据返回，则追加到原数据列表中
        const newList = this.data.list.concat(res);
        console.log(newList)
        this.setData({
          list: newList,
          page: nextPage
        });
        // 将新数据重新分配到左右列表中
        this.setList(res);
      } else {
        // 如果没有数据返回，设置没有更多数据的标志为 true，并提示用户
        this.setData({
          nomore: true
        });
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})