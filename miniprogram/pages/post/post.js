// pages/post/post.js
const db=wx.cloud.database()
const _=db.command


Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    defaultImage:"https://7975-yueda-0g7hp5b16ff067e6-1306185940.tcb.qcloud.la/cloudbase-cms/upload/2024-03-17/b4wxiukuajvw3exmenppwkymkiaghfir_.png",
    photos: [], // 帖子图片
    title: '', // 帖子标题
    comment: '', // 帖子内容
    postId: '', // 用户ID
    postAvatar: "" ,// 用户头像
    min: 15,//最少字数
    max: 520, //最多字数 (根据自己需求改变) 
    currentWordNumber:0,
    maxPhotos: 3 ,// 最多可以添加的图片数量,
    texts:'',
    textss:'',
    num:'',
    time:"",
    timestamp:'',
    tempFiles:[],
    submitting:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.Getopenid()
    // const date = this.formatTime(new Date())
    // console.log(new Date())
    // const formattedDaily = date.daily;
    // const formattedHourly = date.hourly;
    // const time1 = formattedDaily + ' ' + formattedHourly
    // this.setData({
    //   time:time1
    // })

    //unix时间戳
    const now = new Date();
    const timestamp = now.getTime(); // 获取当前时间的 Unix 时间戳
    this.setData({
      timestamp:timestamp
    })
  },
 // 选择图片
 chooseMedia() {
  const { photos, maxPhotos, defaultImage } = this.data;
  if (photos.length >= maxPhotos) {
    wx.showToast({
      title: '最多只能添加' + maxPhotos + '张图片',
      icon: 'none'
    });
    return;
  }
  wx.chooseMedia({
    count: maxPhotos - photos.length, // 限制选择图片的数量为剩余可添加数量
    mediaType: ['image'],
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      //console.log(res.tempFiles);
      this.setData({
        tempFiles: res.tempFiles.map(item => item.tempFilePath)
      })
      //this.previewImages(this.data.tempFiles);
    },
  });
},

// 显示已上传的图片
previewImages(file) {
  console.log(file)
  wx.previewImage({
    current: file[0], // 当前预览的图片路径
    urls: file // 所有已上传的图片路径数组
  });
},
//删除图片
deleteImage(event) {
  const index = event.currentTarget.dataset.index;
  const { photos } = this.data;
  if (index >= 0 && index < photos.length) {
    photos.splice(index, 1);
    this.setData({ photos });
  }
},
//预览图片
TappreviewImage(event) {
  //  const src = event.currentTarget.dataset.src;
  //  console.log(src)
  wx.previewImage({
    current: event.currentTarget.dataset.src,
    urls: this.data.tempFiles
  });
},

  //获取openid、用户头像
  Getopenid(){
    var that = this;
    wx.getStorage({
      key:"openid",
      success:function(res){
        //console.log(res.data)
        if(res.data!=null){
          that.setData({
            openid:res.data
          })
          db.collection('userinfo').where({_openid:res.data}).get({
            success:ress=>{
              //console.log(ress.data)
              that.setData({
                postAvatar:ress.data[0].avatar,
                postId:ress.data[0].name
              })
            }
          })
        }
      }
    })
  },
  //获取标题和内容
  Gettitle(e){
    console.log(e.detail)
    if (e.detail.length > 20) {
      this.setData({
        title: e.detail.value.slice(0, 30)
      });
    } else {
      this.setData({
        title: e.detail.value
      });
    }
  },
  Getcontent(e){
    // 获取输入框的内容
  var value = e.detail.value;
  // 获取输入框内容的长度
  var len = parseInt(value.length);
  // console.log(len)
  //最少字数限制
  if (len < this.data.min){
    console.log(len)
    console.log(this.data.min)
    this.setData({
      texts: "至少还需要",
      textss: "字",
      num:this.data.min-len
    })
    console.log(this.data.num)
  }
  else if (len >= this.data.min)
    this.setData({
      texts: " ",
      textss: " ",
      num:''
    })
  this.setData({
    currentWordNumber: len //当前字数  
  });
  //最多字数限制
  if (len > this.data.max) return;
  // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
  // console.log(this.data)
    console.log(e.detail)
    this.setData({
      comment:e.detail
    })
  },

 // 提交帖子
 submitPost() {
   // 禁用提交按钮
  this.setData({
    submitting: true
  });
  this.data.tempFiles.forEach(file => {
    // 上传图片到数据库中的 commentpicture 文件夹中
    wx.cloud.uploadFile({
      cloudPath: 'commentpicture/' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000) + '.png', // 上传至云端的路径
      filePath: file, // 小程序临时文件路径
      success: uploadRes => {
        console.log('上传成功', uploadRes.fileID);
        // 获取图片的永久链接
        const imageUrl = uploadRes.fileID;
        // 将永久链接保存到 photos 数组中
        const newPhotos = [...this.data.photos, imageUrl];
        this.setData({ photos: newPhotos }, () => {
          // 图片选择完成后立即预览所有已上传的图片
          //this.previewImages();
        });
        const commentData = {
          photo: this.data.photos,
          Postavatar: this.data.postAvatar,
          comment: this.data.comment.value,
          title:this.data.title,
          openid: this.data.openid,
          Postid: this.data.postId,
          _createTime: this.data.timestamp,
          _updateTime: this.data.timestamp
        };
        console.log(commentData)
        this.addCommentToDB(commentData)
        .then(commentId => {
          if (commentId) {
            wx.showToast({
              title: '发帖成功',
              icon: 'success'
            })
            // 清空输入内容
            this.setData({
              photo: '',
              title: '',
              comment: '',
              submitting: false // 启用提交按钮
            })
          } else {
            wx.showToast({
              title: '发帖失败',
              icon: 'none'
            })
          }
        })
        .catch(err => {
          console.error('写入数据库失败', err);
          wx.showToast({
            title: '发帖失败',
            icon: 'none'
          })
        });
      },
      fail: error => {
        console.error('上传失败', error);
      }
    });
  });
},

// 将评论数据写入数据库
addCommentToDB(commentData) {
  return new Promise((resolve, reject) => {
    db.collection('comment').add({
      data: commentData
    })
    .then(res => {
      console.log('写入数据库成功', res)
      // 设置需要刷新标志
      wx.setStorageSync('needRefresh', true);
      resolve(res._id);
      wx.switchTab({
        url: '../../pages/share/share',
      })
    })
    .catch(err => {
      console.error('写入数据库失败', err);
      reject(err);
    });
  });
},

// 格式时间
formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
  const isToday = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
  return {
    hourly: [hour, minute].map(this.formatNumber).join(":"),
    daily: [month, day].map(this.formatNumber).join("-"),
    dailyToString: isToday ? "今天" : weekArray[date.getDay()]
  }
},
// 补零
formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
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