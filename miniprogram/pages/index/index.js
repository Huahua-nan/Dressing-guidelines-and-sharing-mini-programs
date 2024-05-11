import {
  getMockData
} from "../../components/mock/index"

const app = getApp()
const db=wx.cloud.database()

Page({
  data: {
    list: [],
    leftList: [],
    rightList: [],
  },
  onLoad() {
    getMockData().then((res) => {
      this.setData({
        list: res
      })
      this.setList(res)
    })
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
        console.log(res)
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
})