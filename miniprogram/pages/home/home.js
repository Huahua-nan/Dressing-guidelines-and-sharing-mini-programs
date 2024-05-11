// pages/home/home.js
const db=wx.cloud.database()
const APIKEY = "0cfe25a486654aed9a6ffdb76dbe5acb";// 和风天气的KEY
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // info:'hello world',
    // RandomNum1:Math.random()*10,//获得一个10以内的随机数
    // RandomNum2:Math.random().toFixed(2) ,//取两位小数
    // count:0,
    // msg:'你好，',
    // type:1,
    // flag:true,
    // arr1:['苹果','华为','小米'],
    // userlist:[
    //   {id:1,name:'小红'},
    //   {id:2,name:'小huang'},
    //   {id:3,name:'小lan'}
    // ],
    //mglist:[],
    loginstate:'',
    photos:[],
    maxPhotos:1,
    tempFiles:[],
    uploadphoto:[],
    uploadtype:'',
    uploadtypeinfo:'',
    conj:'',
    uploadgender:'',
    switch:'',
    switchdatabase:'adviser',
    adviserbg:'',
    userinfo:{

    },
    weatherInfo:{
      temperature:'',
    },
    outfit:[],
    coat:[],
    yifu:[],
    kuzi:[],
    shoe:[],
    a:'',
    b:'',
    c:'',
    d:'',
    bottomlen:'',
    toplen:'',
    shoelen:'',
    outerlen:'',
  },

//   //定义按钮的事件处理函数
//   btnTapHandler(e){
//   console.log(e)
// },
//   //+1按钮的点击事件处理函数
//   countchange(e){
//     this.setData({//为当前data中的值赋值
//       count:this.data.count /*当前count的值*/+1
//     })
//   },
//   //+2按钮的点击事件处理函数
//   btnTap2(e){
//     this.setData({
//       count:this.data.count+e.target.dataset.info
//     })
//   },
//   //input输入框事件处理函数
//   inputHandler(e){
//     // console.log(e.detail.value)
//     this.setData({
//       msg:e.detail.value
//     })
//   },
  //发起GET请求
  // getInfo(){
  //   wx.request({
  //     url: '',
  //     method='GET',
  //     data:{
  //       name:'zs',
  //       age:20
  //     },
  //     success:(res)=>{
  //       console.log(res)
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.data.userinfo.openid = wx.getStorageSync('openid')
    this.data.loginstate = wx.getStorageSync('loginstate')
    if(!this.data.loginstate){
      wx.showToast({
        title: '请先登录',
        icon:'loading',
        duration:2000
      })
      wx.switchTab({
      url: '../person/person',
    })}
    //this.getSwiperList(),
    //this.Gotoweather(),
    this.getadviserbg(),
    this.getLocation(),
    await this.Getuserinfo()
  },
  modify(){
    wx.navigateTo({
      url: '../personaladviser/personaladviser',
    })
  },
  //选择要上传的种类
  showTypeActionSheet() {
    const that = this;
    wx.showActionSheet({
      itemList: ['外套', '衣服', '裤子', '鞋子'],
      success(res) {
        that.setData({
          uploadtype: ['外套', '衣服', '裤子', '鞋子'][res.tapIndex]
        });
        that.Showtypeinfo()
      },
      fail(res) {
        console.log(res.errMsg);
      }
    });
  },
  Showtypeinfo(){
    var that = this
  //判断完是哪一个种类后，再选择具体种类
    if(this.data.uploadtype==='外套'){
      wx.showActionSheet({
        itemList: ['薄外套','厚外套'],
        success(res) {
          that.setData({
            uploadtypeinfo: ['薄外套','厚外套'][res.tapIndex]
          });
        }
      })
    }else if(this.data.uploadtype==='衣服'){
      wx.showActionSheet({
        itemList: ['T恤', '衬衫', '针织衫'],
        success(res) {
          that.setData({
            uploadtypeinfo: ['T恤', '衬衫', '针织衫'][res.tapIndex]
          });
        }
      })
    }else if(this.data.uploadtype==='裤子'){
      wx.showActionSheet({
        itemList: ['牛仔裤', '休闲裤', '短裤'],
        success(res) {
          that.setData({
            uploadtypeinfo: ['牛仔裤', '休闲裤', '短裤'][res.tapIndex]
          });
        }
      })
    }else if(this.data.uploadtype==='鞋子'){
      wx.showActionSheet({
        itemList: ['运动鞋', '休闲鞋'],
        success(res) {
          that.setData({
            uploadtypeinfo: ['运动鞋', '休闲鞋'][res.tapIndex]
          });
        }
      })
    }
  },
  //选择要上传的性别
  showGenderActionSheet() {
    const that = this;
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(res) {
        that.setData({
          uploadgender: ['男', '女'][res.tapIndex]
        });
      },
      fail(res) {
        console.log(res.errMsg);
      }
    });
  },
  //切换显示穿搭的数据库
  showswitchActionSheet(){
    const that = this
    wx.showActionSheet({
      itemList: ['个人穿搭', '推荐穿搭'],
      success(res) {
        that.setData({
          switch: ['个人穿搭', '推荐穿搭'][res.tapIndex]
        });
        //执行完showaction后的操作
        if(that.data.switch==='个人穿搭'){that.data.switchdatabase='personaladviser'}else{that.data.switchdatabase='adviser'}
        that.Adviser(that.data.switchdatabase)
        // 根据 switchdatabase 的值构建查询条件
        // if (switchdatabase === 'personaladviser') {
        //   // 当 switchdatabase 为 'personaladviser' 时查询 openid 和 gender
        //   query = {
        //     openid: that.data.userinfo.openid,
        //     gender: that.data.userinfo.gender
        //   };
        // } else {
        //   // 当 switchdatabase 为 'adviser' 时只查询 gender
        //   query = {
        //     gender: that.data.userinfo.gender
        //   };
        // }
        // db.collection(switchdatabase).where({gender: that.data.userinfo.gender}).get({
        //   success:res=>{
        //     console.log('获取数据库数据成功：', res);
        //     // 进行数据处理
        //     const data = res.data; // 获取到的数据库数据
        //     //把获取到的四种衣服分别放入四个数组内
        //     const yifu1=[],kuzi1=[],coat1=[],shoe1=[]
        //     data.forEach(item => {
        //       if (item.type === 'T恤' || item.type === '衬衫' || item.type === '针织衫') {
        //           yifu1.push(item.photo) 
        //       } else if (item.type === '牛仔裤' || item.type === '休闲裤' || item.type === '短裤') {
        //           kuzi1.push(item.photo);
        //       }else if (item.type === '薄外套' || item.type === '厚外套') {
        //           coat1.push(item.photo);
        //       }else if (item.type === item.type === '运动鞋' || item.type === '休闲鞋') {
        //           shoe1.push(item.photo);
        //       }
        //     });
        //     console.log(yifu1)
        //     const yifulen = yifu1.length
        //     const kuzilen = kuzi1.length
        //     const coatlen = coat1.length
        //     const shoelen = shoe1.length
        //     console.log(yifulen)
        //       //获取鞋子、裤子、衣服、外套的随机数
        //     const numberclothes = Math.floor(Math.random() * coatlen); // 获取随机数
        //     const numberclothes2 = Math.floor(Math.random() * yifulen); // 获取的随机数
        //     const numberclothes3 = Math.floor(Math.random() * kuzilen); // 获取的随机数
        //     const numberclothes4 = Math.floor(Math.random() * shoelen); // 获取的随机数
        //     this.setData({
        //       a:that.data.coat[numberclothes].photo,
        //       b:that.data.yifu[numberclothes2].photo,
        //       c:that.data.kuzi[numberclothes3].photo,
        //       d:that.data.shoe[numberclothes4].photo
        //     })//setdata
        //   }//get操作成功
        // })//get操作
      },
      fail(res) {
        console.log(res.errMsg);
      }
    })
  },
  Adviser(query){
    // 解析用户信息和天气信息
    const height = this.data.userinfo.height;
    const weight = this.data.userinfo.weight;
    const gender = this.data.userinfo.gender;
    //const colorPreference = userInfo.colorPreference;
    //console.log(this.data.weatherInfo)
    const temperature = this.data.weatherInfo.temperature;
  
    // 根据身高体重选择合适尺码的服装
    let size;
    if (height < 170||weight<40) {
        size = 'S';
    } else if (height < 180||40<weight<50) {
        size = 'M';
    } else {
        size = 'L';
    }
  
    // 根据性别选择服装类型
    let tops, bottoms, shoes;
    if (gender === '男') {
        tops = ['T恤', '衬衫', '针织衫'];
        bottoms = ['牛仔裤', '休闲裤', '短裤'];
        shoes = ['运动鞋', '休闲鞋'];
    } else {
        tops = ['T恤', '衬衫', '针织衫', '连衣裙'];
        bottoms = ['牛仔裤', '休闲裤', '长裤', '短裙'];
        shoes = ['运动鞋', '休闲鞋', '高跟鞋'];
    }
  
    // 根据天气情况选择外套
    let outerwear;
    if (temperature > 25) {
        outerwear = '无';
    } else if (temperature > 15) {
        outerwear = '薄外套';
    } else {
        outerwear = '厚外套';
    }
  
    // // 根据偏好颜色选择服装颜色
    // let color;
    // if (colorPreference === '明亮色') {
    //     color = '红色、橙色、黄色';
    // } else if (colorPreference === '暖色') {
    //     color = '粉色、紫色、棕色';
    // } else {
    //     color = '黑色、白色、灰色';
    // }
    
    // 随机选择一件服装
    const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
    const top = randomChoice(tops);
    const bottom = randomChoice(bottoms);
    const shoe = randomChoice(shoes);

    // 查询数据库获取底部（裤子）推荐
    const bottomQuery = db.collection(query).where({ type: bottom,gender: this.data.userinfo.gender }).get().then(res => {
      console.log(res)
        this.setData({ kuzi: res.data });
        //console.log(this.data.kuzi)
        return res.data
    }).catch(err => {
        console.error("获取底部（裤子）推荐失败：", err);
    });
  
    // 查询数据库获取顶部（上衣）推荐
    const topQuery = db.collection(query).where({ type: top,gender: this.data.userinfo.gender }).get().then(res => {
      console.log(res)
        this.setData({ yifu: res.data });
        return res.data
    }).catch(err => {
        console.error("获取顶部（上衣）推荐失败：", err);
    });
  
    // 查询数据库获取外套推荐
    const outerwearQuery = db.collection(query).where({ type: outerwear,gender: this.data.userinfo.gender }).get().then(res => {
        this.setData({ coat: res.data });
        return res.data
    }).catch(err => {
        console.error("获取外套推荐失败：", err);
    });
  
    // 查询数据库获取鞋子推荐
    const shoeQuery = db.collection(query).where({ type: shoe,gender: this.data.userinfo.gender }).get().then(res => {
        this.setData({ shoe: res.data });
        return res.data
    }).catch(err => {
        console.error("获取鞋子推荐失败：", err);
    });
    // 使用Promise.all等待所有查询完成
    Promise.all([bottomQuery, topQuery, outerwearQuery, shoeQuery]).then(PromiseResult => {
    const [bottomRes, topRes, outerwearRes, shoeRes] = PromiseResult;
    console.log(PromiseResult)
    this.setData({
      bottomlen:bottomRes.length,
      toplen:topRes.length,
      outerlen:outerwearRes.length,
      shoelen:shoeRes.length
    })
    //获取鞋子、裤子、衣服、外套的随机数
    const numberclothes = Math.floor(Math.random() * this.data.bottomlen); // 获取 0 或 1 的随机数
    const numberclothes2 = Math.floor(Math.random() * this.data.toplen); // 获取 0 或 1 的随机数
    const numberclothes3 = Math.floor(Math.random() * this.data.outerlen); // 获取 0 或 1 的随机数
    const numberclothes4 = Math.floor(Math.random() * this.data.shoelen); // 获取 0 或 1 的随机数
    //console.log(numberclothes)
    console.log(this.data.coat[numberclothes])
    this.setData({
      a:this.data.coat[numberclothes].photo,
      b:this.data.yifu[numberclothes2].photo,
      c:this.data.kuzi[numberclothes3].photo,
      d:this.data.shoe[numberclothes4].photo
    })
  })
    // 返回搭配结果
    return { top, bottom, shoe, outerwear, gender, size };
  },
  Gotoweather(){
    wx.navigateTo({
      url: '../weather/weather',
    })
  },
  //获取轮播图数据
  getSwiperList(){
  db.collection('banner').where({_id:'63ca5b1365e282bd00518ad66a81a5fb'}).get({
    success:res=>{
      console.log(res)
      this.setData({
        mglist:res.data
      })
    },fail(err){
      console.log('请求失败',err)
    }
  })
},
//获取背景
  getadviserbg(){
  db.collection('basedata').where({_id:"63ca5b13660170fd046bc7691b164382"}).get({
    success:res=>{
      //console.log(res.data[0].picture[0])
      this.setData({
        adviserbg:res.data[0].picture[0]
      })
    }
  })
},
//获取定位
  getLocation() {
  var that = this
  wx.getLocation({
    type: 'gcj02',
    success(res) {
      that.setData({
        location: res.longitude + "," + res.latitude
      })
      that.getWeather()
      that.getCityByLoaction()
    }, fail(err) {
      wx.showModal({
        title: '获取定位信息失败',
        content: '为了给您提供准确的天气预报服务,请在设置中授权【位置信息】',
        success(mRes) {
          if (mRes.confirm) {
            wx.openSetting({
              success: function (data) {
                if (data.authSetting["scope.userLocation"] === true) {
                  wx.showToast({
                    title: '授权成功',
                    icon: 'success',
                    duration: 1000
                  })
                  that.getLocation()
                } else {
                  wx.showToast({
                    title: '授权失败',
                    icon: 'none',
                    duration: 1000
                  })
                  that.setData({
                    location: "地理位置"
                  })
                  that.getWeather()
                  that.getCityByLoaction()
                }
              }, fail(err) {
                console.log(err)
                wx.showToast({
                  title: '唤起设置页失败，请手动打开',
                  icon: 'none',
                  duration: 1000
                })
                that.setData({
                  location: "地理位置"
                })
                that.getWeather()
                that.getCityByLoaction()
              }
            })
          } else if (mRes.cancel) {
            that.setData({
              location: "地理位置"
            })
            that.getWeather()
            that.getCityByLoaction()
          }
        }
      })
    }
  })
},
//获取天气
getWeather() {
  var that = this
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: 'https://devapi.qweather.com/v7/weather/now?key=' + APIKEY + "&location=" + that.data.location,
    success(result) {
      var res = result.data
      //console.log(res)
      that.setData({
        now: res.now,
        'weatherInfo.temperature':res.now.temp
      })
    }
  })
  wx.request({
    url: 'https://devapi.qweather.com/v7/weather/24h?key=' + APIKEY + "&location=" + that.data.location,
    success(result) {
      var res = result.data
      //console.log(res)
      res.hourly.forEach(function (item) {
        item.time = that.formatTime(new Date(item.fxTime)).hourly
      })
      that.setData({
        hourly: res.hourly
      })
    }
  })
  wx.request({
    url: 'https://devapi.qweather.com/v7/weather/7d?key=' + APIKEY + "&location=" + that.data.location,
    success(result) {
      var res = result.data
      //console.log(res)
      res.daily.forEach(function (item) {
        item.date = that.formatTime(new Date(item.fxDate)).daily
        item.dateToString = that.formatTime(new Date(item.fxDate)).dailyToString
      })
      that.setData({
        daily: res.daily
      })
      wx.hideLoading()
    }
  })
},
//选择定位
selectLocation() {
  var that = this
  wx.chooseLocation({
    success(res) {
      //console.log(res)
      that.setData({
        location: res.longitude + "," + res.latitude
      })
      that.getWeather()
      that.getCityByLoaction()
    }
    , fail() {
      wx.getLocation({
        type: 'gcj02',
        fail() {
          wx.showModal({
            title: '获取地图位置失败',
            content: '为了给您提供准确的天气预报服务,请在设置中授权【位置信息】',
            success(mRes) {
              if (mRes.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] === true) {
                      that.selectLocation()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }, fail(err) {
                    console.log(err)
                    wx.showToast({
                      title: '唤起设置页失败，请手动打开',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                })
              }
            }
          })
        }
      })

    }
  })
},
//获取城市
getCityByLoaction() {
  var that = this
  wx.request({
    url: 'https://geoapi.qweather.com/v2/city/lookup?key=' + APIKEY + "&location=" + that.data.location,
    success(result) {
      var res = result.data
      if (res.code == "200") {
        var data = res.location[0]
        that.setData({
          City: data.adm2,
          County: data.name
        })
      } else {
        wx.showToast({
          title: '获取城市信息失败',
          icon: 'none'
        })
      }

    }
  })
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
//获取用户数据
async Getuserinfo(){
    await db.collection('userinfo').where({openid:this.data.userinfo.openid}).get({
      success:res=>{
        //console.log(res)
        this.setData({
          userinfo:res.data[0]
        })
        this.data.outfit = this.Adviser(this.data.switchdatabase)
      }
    })
  },
//生成穿搭建议
// Adviser(){
//   // 解析用户信息和天气信息
//   const height = this.data.userinfo.height;
//   const weight = this.data.userinfo.weight;
//   const gender = this.data.userinfo.gender;
//   //const colorPreference = userInfo.colorPreference;
//   //console.log(this.data.weatherInfo)
//   const temperature = this.data.weatherInfo.temperature;

//   // 根据身高体重选择合适尺码的服装
//   let size;
//   if (height < 170||weight<40) {
//       size = 'S';
//   } else if (height < 180||40<weight<50) {
//       size = 'M';
//   } else {
//       size = 'L';
//   }

//   // 根据性别选择服装类型
//   let tops, bottoms, shoes;
//   if (gender === '男') {
//       tops = ['T恤', '衬衫', '针织衫'];
//       bottoms = ['牛仔裤', '休闲裤', '短裤'];
//       shoes = ['运动鞋', '休闲鞋'];
//   } else {
//       tops = ['T恤', '衬衫', '针织衫', '连衣裙'];
//       bottoms = ['牛仔裤', '休闲裤', '长裤', '短裙'];
//       shoes = ['运动鞋', '休闲鞋', '高跟鞋'];
//   }

//   // 根据天气情况选择外套
//   let outerwear;
//   if (temperature > 25) {
//       outerwear = '无';
//   } else if (temperature > 15) {
//       outerwear = '薄外套';
//   } else {
//       outerwear = '厚外套';
//   }

//   // // 根据偏好颜色选择服装颜色
//   // let color;
//   // if (colorPreference === '明亮色') {
//   //     color = '红色、橙色、黄色';
//   // } else if (colorPreference === '暖色') {
//   //     color = '粉色、紫色、棕色';
//   // } else {
//   //     color = '黑色、白色、灰色';
//   // }
  
//   // 随机选择一件服装
//   const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
//   const top = randomChoice(tops);
//   const bottom = randomChoice(bottoms);
//   const shoe = randomChoice(shoes);
  
//   // 查询数据库获取底部（裤子）推荐
//   const bottomQuery = db.collection('adviser').where({ type: bottom,gender: this.data.userinfo.gender }).get().then(res => {
//     //console.log(res)
//       this.setData({ kuzi: res.data });
//       //console.log(this.data.kuzi)
//   }).catch(err => {
//       console.error("获取底部（裤子）推荐失败：", err);
//   });

//   // 查询数据库获取顶部（上衣）推荐
//   const topQuery = db.collection('adviser').where({ type: top,gender: this.data.userinfo.gender }).get().then(res => {
//       this.setData({ yifu: res.data });
//   }).catch(err => {
//       console.error("获取顶部（上衣）推荐失败：", err);
//   });

//   // 查询数据库获取外套推荐
//   const outerwearQuery = db.collection('adviser').where({ type: outerwear,gender: this.data.userinfo.gender }).get().then(res => {
//       this.setData({ coat: res.data });
//   }).catch(err => {
//       console.error("获取外套推荐失败：", err);
//   });

//   // 查询数据库获取鞋子推荐
//   const shoeQuery = db.collection('adviser').where({ type: shoe,gender: this.data.userinfo.gender }).get().then(res => {
//       this.setData({ shoe: res.data });
//   }).catch(err => {
//       console.error("获取鞋子推荐失败：", err);
//   });
  
//   // 使用Promise.all等待所有查询完成
//   Promise.all([bottomQuery, topQuery, outerwearQuery, shoeQuery])
//   .then(results => {
//       const [bottomRes, topRes, outerwearRes, shoeRes] = results;
//   //获取鞋子、裤子、衣服、外套的随机数
//   const numberclothes = Math.floor(Math.random() * 2); // 获取 0 或 1 的随机数
//   const numberclothes2 = Math.floor(Math.random() * 2); // 获取 0 或 1 的随机数
//   const numberclothes3 = Math.floor(Math.random() * 2); // 获取 0 或 1 的随机数
//   const numberclothes4 = Math.floor(Math.random() * 2); // 获取 0 或 1 的随机数
//   //console.log(numberclothes)
//   console.log(this.data.coat[numberclothes])
//   this.setData({
    // a:this.data.coat[numberclothes].photo,
    // b:this.data.yifu[numberclothes2].photo,
    // c:this.data.kuzi[numberclothes3].photo,
    // d:this.data.shoe[numberclothes4].photo
//   })
// })
//   // 返回搭配结果
//   return { top, bottom, shoe, outerwear, gender, size };
// },
//点击按钮再次随机
random(){
  if(!this.data.loginstate){
    wx.showToast({
      title: '请先登录',
      icon:'loading',
      duration:2000
    })
    wx.switchTab({
    url: '../person/person',
  })}
  //获取鞋子、裤子、衣服、外套的随机数
  const numberclothes = Math.floor(Math.random() * this.data.bottomlen); // 获取 0 或 1 的随机数
  const numberclothes2 = Math.floor(Math.random() * this.data.toplen); // 获取 0 或 1 的随机数
  const numberclothes3 = Math.floor(Math.random() * this.data.outerlen); // 获取 0 或 1 的随机数
  const numberclothes4 = Math.floor(Math.random() * this.data.shoelen); // 获取 0 或 1 的随机数
  //console.log(numberclothes)
  //console.log(this.data.coat[numberclothes])
  this.setData({
    a:this.data.coat[numberclothes].photo,
    b:this.data.yifu[numberclothes2].photo,
    c:this.data.kuzi[numberclothes3].photo,
    d:this.data.shoe[numberclothes4].photo
  })
},
//上传衣服
async upload(){
  if(!this.data.uploadgender || !this.data.uploadtype){wx.showModal({
    title: '提示',
    content: '请选择种类和性别',
    showCancel:false
  })}else{
    const { photos, maxPhotos } = this.data;
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
    success: async (res) => {
      //console.log(res.tempFiles);
      this.setData({
        tempFiles: res.tempFiles.map(item => item.tempFilePath)
      })
      try {
      const promises = await this.uploadPhotoToCloud(this.data.tempFiles)
      console.log(promises)
      this.updateDatabase(this.data.userinfo,promises)
      }catch(err){
        console.log('上传失败')
      }
    },
  });
  }//else
},
async uploadPhotoToCloud(filePaths) {
  const promises = filePaths.map(filePath => {
    return new Promise((resolve, reject) => {
      const cloudPath = `personaladviser/${Date.now()}-${Math.floor(Math.random() * 1000)}` + filePath.match(/\.[^.]+?$/)[0];
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('上传成功', res);
          resolve(res.fileID); // Use the cloud file ID
        },
        fail: e => {
          console.error('上传失败', e);
          reject(e);
        }
      });
    });
  });
  // 使用 Promise.all() 等待所有文件上传完成
  return Promise.all(promises);
},
updateDatabase(userinfo, cloudPaths) {
  return new Promise((resolve, reject) => {
    const db = wx.cloud.database();
    db.collection('personaladviser').add({
      data: {
        openid: userinfo.openid,
        gender: userinfo.gender,
        type: this.data.uploadtypeinfo,
        photo: cloudPaths[0]
      },
      success: res => {
        console.log('数据库更新成功', res);
        resolve(res);
      },
      fail: e => {
        console.error(e);
        reject(e);
      }
    });
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