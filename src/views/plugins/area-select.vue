<template>
  <div v-if="areaShow" ref="areaSelect" class="area-select area-select-show">
    <div class="main">
      <p class="title">请选择省市</p>
      <div class="panel">
        <p v-if="AREACODE === {}" class="net-err">数据异常</p>
        <div ref="prov" class="prov">
          <ul>
            <li v-for="(i, index) in provNameArr" :key="index" :style="{ color: index === provIndex ? '#ff3a3a' : '#acacac' }">{{i}}</li>
          </ul>
        </div>
        <div ref="city" class="city">
          <ul>
            <li v-for="(i, index) in cityNameArr" :key="index" :style="{ color: index === cityIndex ? '#ff3a3a' : '#acacac' }">{{i}}</li>
          </ul>
        </div>
      </div>
      <div class="btns">
        <span @click="cancel()">取消</span>
        <span @click="okay()">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import codeJson from '../../assets/area-code'

export default {
  name: 'area-select',
  props: {
    provCode: {
      type: Number,
      default: 99999999
    },
    cityCode: {
      type: Number,
      default: 99999999
    },
    provName: {
      type: String,
      default: ''
    },
    cityName: {
      type: String,
      default: ''
    },
    areaShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      AREACODE: codeJson,
      provIndex: 0,
      cityIndex: 0,
      pageFirstLoad: true,
      provFirstLoad: true,
      cityFirstLoad: true,
      provCodeArr: [],
      cityCodeArr: [],
      provNameArr: [],
      cityNameArr: [],
      finalData: {}
    }
  },
  watch: {
    areaShow(newer, older) {
      if (newer) {
        // 不设置延迟会报一堆错
        setTimeout(() => {
          this.pageFirstLoad = true
          this.provFirstLoad = true
          this.cityFirstLoad = true
          // 初始化 bscroll
          this.initScroll()
          // 添加事件监听
          this.$refs.areaSelect.addEventListener('click', ev => {
            if (/area-select/i.test(ev.target.className)) this.cancel()
          })
        })
      } else {
        // 移除 bscroll
        this.provScroll.destroy()
        this.cityScroll.destroy()
        // 移除事件监听
        this.$refs.areaSelect.removeEventListener('click', ev => {
          if (/area-select/i.test(ev.target.className)) this.cancel()
        })
      }
    },
    provIndex(newer, older) {
      let cityList = this.AREACODE[this.provCodeArr[newer]].children
      this.cityCodeArr = []
      this.cityNameArr = []
      for (let i in cityList) {
        if (Object.prototype.hasOwnProperty.call(cityList, i)) {
          this.cityCodeArr.push(cityList[i].code)
          this.cityNameArr.push(cityList[i].name)
        }
      }
      // 省份变动市拉到第一个
      if (this.pageFirstLoad) {
        this.pageFirstLoad = false
      } else {
        this.cityIndex = 0
        this.cityScroll.scrollToElement('.city ul li:nth-child(1)', 200, true, true)
      }
      // 创建结果数据
      this.areaWatch(newer)
    },
    cityIndex(newer, older) {
      // 创建结果数据
      this.areaWatch()
    }
  },
  created() {
    this.init()

    // 设置目标数据（传来的数据
    this.finalData['provCode'] = this.provCode
    this.finalData['cityCode'] = this.cityCode
    this.finalData['provName'] = this.provName
    this.finalData['cityName'] = this.cityName
  },
  methods: {
    // 初始化
    init() {
      // 省数据
      for (let i in codeJson) {
        if (Object.prototype.hasOwnProperty.call(codeJson, i)) {
          this.provCodeArr.push(codeJson[i].code)
          this.provNameArr.push(codeJson[i].name)
        }
      }
      // 省 index
      if (/110000|120000|310000|500000/.test(this.provCode)) {
        this.provIndex = 0
        this.pageFirstLoad = false  // 当 provIndex 为 0 时，第一次进入不会触发 provIndex 的 provFirstLoad
      } else if (/810000|820000/.test(this.provCode)) {
        this.provIndex = 1
      } else {
        this.provIndex = this.provCodeArr.indexOf(this.provCode)
      }

      // 市数据
      let cityList = codeJson[this.provCodeArr[this.provIndex]].children
      for (let i in cityList) {
        if (Object.prototype.hasOwnProperty.call(cityList, i)) {
          this.cityCodeArr.push(cityList[i].code)
          this.cityNameArr.push(cityList[i].name)
        }
      }
      // 市 index
      if (/110000|120000|310000|500000|810000|820000/.test(this.provCode)) {
        this.cityIndex = this.cityCodeArr.indexOf(this.provCode)
      } else {
        this.cityIndex = this.cityCodeArr.indexOf(this.cityCode)
      }
    },

    // 省市数据变动重置
    areaWatch(index = this.provIndex) {
      if (this.AREACODE[this.provCodeArr[index]].code === 0) {
        this.finalData['provCode'] = parseInt(this.cityCodeArr[this.cityIndex], 10)
        this.finalData['provName'] = '直辖市'
        this.finalData['cityCode'] = parseInt(`${this.cityCodeArr[this.cityIndex].toString().substr(0, 3)}101`, 10)
      } else if (this.AREACODE[this.provCodeArr[index]].code === 1) {
        this.finalData['provCode'] = parseInt(this.cityCodeArr[this.cityIndex], 10)
        this.finalData['provName'] = '特别行政区'
        this.finalData['cityCode'] = parseInt(`${this.cityCodeArr[this.cityIndex].toString().substr(0, 3)}100`, 10)
      } else {
        this.finalData['provCode'] = parseInt(this.provCodeArr[this.provIndex], 10)
        this.finalData['provName'] = this.provNameArr[this.provIndex]
        this.finalData['cityCode'] = parseInt(this.cityCodeArr[this.cityIndex], 10)
      }
      this.finalData['cityName'] = this.cityNameArr[this.cityIndex]
    },

    // 初始化 bscroll
    initScroll() {
      // 创建 prov scroll 对象
      this.provScroll = new BScroll(this.$refs.prov, {
        bounce: false,
        mouseWheel: true
      })
      // 创建 city scroll 对象
      this.cityScroll = new BScroll(this.$refs.city, {
        bounce: false,
        mouseWheel: true
      })

      // 获取列表单块高度
      let lineHeight = this.$refs.prov.offsetHeight

      // prov 监听滑动结束事件
      this.provScroll.on('scrollEnd', pos => {
        if (this.provIndex !== 0 && this.provFirstLoad) {
          this.provFirstLoad = false
          this.provScroll.scrollToElement(`.prov ul li:nth-child(${this.provIndex + 1})`, 200, true, true)
        } else {
          let length1 = Math.floor(Math.abs(pos.y) / lineHeight)
          let length2 = Math.abs(pos.y) % lineHeight
          if (length2 > (lineHeight / 2)) {
            this.provIndex = length1 + 1
            this.provScroll.scrollToElement(`.prov ul li:nth-child(${length1 + 1 + 1})`, 200, true, true)
          } else {
            this.provIndex = length1
            this.provScroll.scrollToElement(`.prov ul li:nth-child(${length1 + 1})`, 200, true, true)
          }
        }
      })
      // city 监听滑动结束事件
      this.cityScroll.on('scrollEnd', pos => {
        if (this.cityIndex !== 0 && this.cityFirstLoad) {
          this.cityFirstLoad = false
          this.cityScroll.scrollToElement(`.city ul li:nth-child(${this.cityIndex + 1})`, 200, true, true)
        } else {
          let length1 = Math.floor(Math.abs(pos.y) / lineHeight)
          let length2 = Math.abs(pos.y) % lineHeight
          if (length2 > (lineHeight / 2)) {
            this.cityIndex = length1 + 1
            this.cityScroll.scrollToElement(`.city ul li:nth-child(${length1 + 1 + 1})`, 200, true, true)
          } else {
            this.cityIndex = length1
            this.cityScroll.scrollToElement(`.city ul li:nth-child(${length1 + 1})`, 200, true, true)
          }
        }
      })
    },

    // 取消确认
    cancel() {
      this.$refs.areaSelect.classList.remove('area-select-show')
      this.$refs.areaSelect.classList.add('area-select-hide')
      setTimeout(() => { this.$emit('update:areaShow', false) }, 190)
    },
    okay() {
      this.$refs.areaSelect.classList.remove('area-select-show')
      this.$refs.areaSelect.classList.add('area-select-hide')
      setTimeout(() => { this.$emit('update:areaShow', false) }, 190)
      this.$emit('update:provCode', this.finalData.provCode)
      this.$emit('update:cityCode', this.finalData.cityCode)
      this.$emit('update:provName', this.finalData.provName)
      this.$emit('update:cityName', this.finalData.cityName)
      console.log('新的地区：', this.finalData)
    }
  }
}
</script>

<style lang="scss">
.area-select {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  .main {
    width: 655px;
    background: #fff;
    border-radius: 15px;
    padding: 40px;
    .title {
      font-weight: bold;
      font-size: 30px;
    }
    .panel {
      height: 450px;
      margin: 50px 0;
      padding: 0px 50px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .net-err {
        color: #ff3a3a;
        width: 100%;
        text-align: center;
        font-size: 35px;
      }
      .city {
        margin-left: 25px;
      }
      .prov, .city {
        height: 90px;
        border-top: 2.5px solid #acacac;
        border-bottom: 2.5px solid #acacac;
      }
      ul {
        color: #acacac;
        text-align: center;
        li {
          width: 7em;
          line-height: 90px;
          font-size: 30px;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
    .btns {
      color: #ff3a3a;
      float: right;
      font-size: 23px;
      display: flex;
      justify-content: space-between;
      span {
        margin-left: 80px;
      }
    }
  }
}
.area-select-show {
  animation: opacity-show .2s linear;
}
.area-select-hide {
  animation: opacity-hide .2s linear;
}
@keyframes opacity-show {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes opacity-hide {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
