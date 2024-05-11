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
    pagesize:1000,
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
    History:[],//浏览过的帖子的_id
    // userinfo:{},
    // avatar:'',
    // hasUserInfo: false,
    // canIUseGetUserProfile:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取虚拟数据
    this.getHistory(this.getLatestData);
  },

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
  getHistory(callback) {
    this.data.openid = wx.getStorageSync('openid')
    db.collection('Posthistory').where({openid: this.data.openid}).get({
      success: res => {
        const commentIds = res.data.map(item => item.commentid);
        this.setData({
          History: commentIds
        });
        // 调用回调函数，传递获取到的 History 数据
        if (typeof callback === 'function') {
          callback();
        }
      },
      fail: err => {
        console.error('获取浏览记录失败', err);
      }
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
      const History = this.data.History; // 获取 History 数组
      const filteredList = res.filter(item => History.includes(item.commentid));
      // 这样就会过滤出所有 commentid 包含在 History 中的数据
      console.log('过滤后的数据:', filteredList);
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