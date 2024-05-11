/**
 * 随机数组序列，洗牌
 * @param {*} arr 数组
 */
const db=wx.cloud.database()
const _ = db.command

let arrayShuffle = (arr = []) => {
  //console.log(arr)
  let m = arr.length
  let t
  let i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = arr[m]
    arr[m] = arr[i]
    arr[i] = t
  }
  return arr
}

let getMockData = async ({ page = 0, pagesize = 10 }) => {
  try {
    // 从云数据库中获取评论数据
    const res = await db.collection('comment')
    .where({comment:_.neq(null)})
    .orderBy('_createTime', 'desc') // 按照创建时间降序排列
    .skip(page * pagesize) // 跳过前面的数据
    .limit(pagesize) // 限制返回的数据数量
    .get()
    // 处理获取到的数据，将数据格式转换为与原数据格式一致
    let list = res.data.map(item => {
      //map就是对每一个item做一次操作 相当于一个小循环
      //console.log(res.data)
      return {
        photo: item.photo, // 假设数据库中的字段名为 photo
        title: item.title, // 假设数据库中的字段名为 title
        comment:item.comment,
        Createtime:item._createTime,
        Updatetime:item._updateTime,
        id:item.Postid,
        avatar:item.Postavatar,
        openid:item.openid,
        commentid:item._id,
        iscollected:item.iscollected,
        collected:item.collected
      }
    })
    //console.log(list)
    // 打乱列表顺序
    list = arrayShuffle(list)
    return list
  } catch (err) {
    console.error('获取评论数据失败', err)
    return [] // 返回空数组或其他默认值
  }
}
export {
  getMockData
}