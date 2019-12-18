<template>
  <div v-if="cShow" ref="calendar" class="calendar calendar-show">
    <div class="main">
      <p class="title">请选择</p>
      <div class="panel">
        <div class="c-title">
          <span class="year" @click="yearPanelShow()">{{targetDate.cYear}}年</span>
          <p class="month-day" @click="backDate()">{{targetDate.cMonth}}月{{targetDate.cDate}}日({{weekList[targetDate.cDay]}})</p>
        </div>
        <div class="swiper-container calendar-swiper">
          <div class="swiper-wrapper">
            <template v-if="!panelSwitch">
              <div v-for="(i, index) in dateList" :key="index" class="swiper-slide">
                <div class="c-switch">
                  <span @click="swiper.slidePrev()">﹤</span>
                  <span>{{i.cYear}}年{{i.cMonth}}月</span>
                  <span @click="swiper.slideNext()">﹥</span>
                </div>
                <div class="c-date-panel">
                  <ul ref="weeks" class="weeks">
                    <li v-for="(j, index) in weekList" :key="index" :style="{ width: `${width}px`, height: `${width}px`, lineHeight: `${width}px` }">{{j}}</li>
                  </ul>
                  <ul class="date-list" :style="{ height: `${width * 6}px` }">
                    <li v-for="(j, index) in i.cList" :key="index" :class="{ 'active': i.cYear === markDate.cYear && i.cMonth === markDate.cMonth && targetDate.cDate === j }" :style="{ width: `${width}px`, height: `${width}px`, lineHeight: `${width}px` }" @click="j !== '' ? setTarget(j) : ''">{{j}}</li>
                  </ul>
                </div>
              </div>
            </template>
          </div>
        </div>
        <ul v-if="panelSwitch" ref="yearPanel" class="c-year-panel">
          <li v-for="(i, index) in yearList" :key="index" :class="{ 'active': targetDate.cYear === i }" @click="yearClick(i)">{{i}}</li>
        </ul>
      </div>
      <div class="btns">
        <span @click="cancel()">取消</span>
        <span @click="okay()">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'

export default {
  name: 'calendar',
  props: {
    cYear: {
      type: Number,
      default: 2019
    },
    cMonth: {
      type: Number,
      default: 7
    },
    cDate: {
      type: Number,
      default: 1
    },
    cDay: {
      type: Number,
      default: 6
    },
    cShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 星期、日期块宽高
      width: 0,
      // 年份面板和月份面板切换
      panelSwitch: false,
      // 目标数据
      targetDate: {
        cYear: 1970,
        cMonth: 1,
        cDate: 1,
        cDay: 4
      },
      // 目标保留日期
      markDate: {
        cYear: 1970,
        cMonth: 1
      },
      // 临时日期
      tempDate: {
        cYear: 1970,
        cMonth: 1
      },
      // 年、星期、日期
      yearList: [],
      // weekList: ['日', '月', '火', '水', '木', '金', '土'],
      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      dateList: [],
    }
  },
  watch: {
    cShow(newer, older) {
      if (newer) {
        // 不设置延迟会报一堆错
        setTimeout(() => {
          // 数据初始化
          this.panelSwitch = false
          this.targetDate = {
            cYear: this.cYear,
            cMonth: this.cMonth,
            cDate: this.cDate,
            cDay: this.cDay,
          }
          this.markDate = {
            cYear: this.cYear,
            cMonth: this.cMonth
          }
          this.tempDate = {
            cYear: this.cYear,
            cMonth: this.cMonth
          }
          // 初始化其他
          this.newSwiper()
          this.calendarSlide()
          this.width = this.$refs.weeks[0].offsetWidth / 7
          // 添加事件监听
          this.$refs.calendar.addEventListener('click', ev => {
            if (/calendar/i.test(ev.target.className)) this.cancel()
          })
        })
      } else {
        // 销毁 swiper，省内存
        this.swiper.destroy()
        // 移除事件监听
        this.$refs.calendar.removeEventListener('click', ev => {
          if (/calendar/i.test(ev.target.className)) this.cancel()
        })
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.targetDate = {
        cYear: this.cYear,
        cMonth: this.cMonth,
        cDate: this.cDate,
        cDay: this.cDay,
      }
      this.markDate = {
        cYear: this.cYear,
        cMonth: this.cMonth
      }
      this.tempDate = {
        cYear: this.cYear,
        cMonth: this.cMonth
      }
      for (let i = 0; i <= 2100; i++) {
        if (i >= 1920) this.yearList.push(i)
      }
      this.refresh(this.cYear, this.cMonth)
      this.setTarget(this.cDate)
    },

    // 创建 swiper
    newSwiper() {
      this.swiper = new Swiper('.calendar-swiper', {
        loop: false,
        autoplay: false,
        on: {
          // 上个月
          slidePrevTransitionEnd: () => {
            if (this.tempDate.cMonth === 1) {
              if (this.tempDate.cYear === 1920) return
              this.tempDate.cYear -= 1
              this.tempDate.cMonth = 13
            }
            this.refresh(this.tempDate.cYear, this.tempDate.cMonth - 1, 1)
            this.calendarSlide()
          },
          // 下个月
          slideNextTransitionEnd: () => {
            if (this.tempDate.cMonth === 12) {
              if (this.tempDate.cYear === 2100) return
              this.tempDate.cYear += 1
              this.tempDate.cMonth = 0
            }
            this.refresh(this.tempDate.cYear, this.tempDate.cMonth + 1, 1)
            this.calendarSlide()
          }
        }
      })
    },

    // 刷新日历
    refresh(Y, M) {
      this.dateList = []
      for (let i = 0; i < 3; i++) {
        if (i === 0) {
          if (Y === 1920 && M === 1) continue
          if (M === 1) {
            this.dateList.push({
              cYear: Y - 1,
              cMonth: 12,
              cList: this.createData(Y - 1, 12)
            })
          } else {
            this.dateList.push({
              cYear: Y,
              cMonth: M - 1,
              cList: this.createData(Y, M - 1)
            })
          }
        } else if (i === 1) {
          this.dateList.push({
            cYear: Y,
            cMonth: M,
            cList: this.createData(Y, M)
          })
        } else if (i === 2) {
          if (Y === 2100 && M === 12) continue
          if (M === 12) {
            this.dateList.push({
              cYear: Y + 1,
              cMonth: 1,
              cList: this.createData(Y + 1, 1)
            })
          } else {
            this.dateList.push({
              cYear: Y,
              cMonth: M + 1,
              cList: this.createData(Y, M + 1)
            })
          }
        }
      }
    },

    // 生成日历数据
    createData(Y, M) {
      if (Y === undefined || M === undefined) return
      let date = new Date(`${Y}/${M}/1`)
      let cList = []
      // 获取当月 1 号星期
      date.setDate(1)
      for (let i = 0; i < date.getDay(); i++) { cList.push('') }
      // 获取当月天数
      date.setMonth(M)
      date.setDate(0)
      for (let i = 0; i < date.getDate(); i++) { cList.push(i + 1) }
      return cList
    },

    // 设置目标日期
    setTarget(res) {
      let date = new Date(`${this.tempDate.cYear}/${this.tempDate.cMonth}/${res}`)
      // 目标日期
      this.targetDate = {
        cYear: this.tempDate.cYear,
        cMonth: this.tempDate.cMonth,
        cDate: res,
        cDay: date.getDay(),
      }
      // 目标保留日期
      this.markDate = {
        cYear: this.tempDate.cYear,
        cMonth: this.tempDate.cMonth
      }
    },

    // 日历滑动到目标位置
    calendarSlide() {
      if (this.dateList[0].cYear === 1920 && this.dateList[0].cMonth === 1 && this.dateList.length === 2) {
        this.swiper.slideTo(0, 0, false)
        this.tempDate = {
          cYear: this.dateList[0].cYear,
          cMonth: this.dateList[0].cMonth
        }
      } else {
        this.swiper.slideTo(1, 0, false)
        this.tempDate = {
          cYear: this.dateList[1].cYear,
          cMonth: this.dateList[1].cMonth
        }
      }
    },

    // 单独设置年
    yearClick(res) {
      this.panelSwitch = false
      this.tempDate.cYear = res
      // this.markDate.cYear = res    // 点击年份后要不要默认选中
      this.targetDate.cYear = res
      this.refresh(res, this.targetDate.cMonth)
    },

    // 返回当前日期
    backDate() {
      this.panelSwitch = false
      this.tempDate = {
        cYear: this.targetDate.cYear,
        cMonth: this.targetDate.cMonth
      }
      this.refresh(this.targetDate.cYear, this.targetDate.cMonth)
    },

    // 单独年份选择面板
    yearPanelShow() {
      this.panelSwitch = true
      // 年选择面板弹出自动拉到目标位置
      setTimeout(() => {
        let targetHeight = this.$refs.yearPanel.children[0].offsetHeight * (this.yearList.indexOf(this.targetDate.cYear) - 3)
        this.$refs.yearPanel.scrollTo(0, targetHeight)
      })
    },

    // 取消、确认
    cancel() {
      this.$refs.calendar.classList.remove('calendar-show')
      this.$refs.calendar.classList.add('calendar-hide')
      setTimeout(() => { this.$emit('update:cShow', false) }, 190)
    },
    okay() {
      this.$refs.calendar.classList.remove('calendar-show')
      this.$refs.calendar.classList.add('calendar-hide')
      setTimeout(() => { this.$emit('update:cShow', false) }, 190)
      this.$emit('update:cYear', this.targetDate.cYear)
      this.$emit('update:cMonth', this.targetDate.cMonth)
      this.$emit('update:cDate', this.targetDate.cDate)
      this.$emit('update:cDay', this.targetDate.cDay)
      console.log('新的日期：', `${this.targetDate.cYear}年${this.targetDate.cMonth}月${this.targetDate.cDate}日  星期${this.weekList[this.targetDate.cDay]}`)
    }
  }
}
</script>

<style lang="scss">
.calendar {
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
      margin-top: 30px;
      font-size: 23px;
      .c-title {
        color: #fff;
        background: #ce3d3e;
        padding: 30px 45px;
        font-weight: bold;
        .year {
          opacity: 0.8;
          font-size: 25px;
          line-height: 1em;
        }
        .month-day {
          font-size: 55px;
          line-height: 1em;
          margin-top: 12px;
        }
      }
      .c-switch {
        font-weight: bold;
        padding: 40px 65px;
        display: flex;
        justify-content: space-between;
      }
      .c-date-panel {
        padding: 0 45px;
        font-weight: bold;
        .weeks {
          display: flex;
          justify-content: space-between;
          li {
            text-align: center;
          }
        }
        .date-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          li {
            text-align: center;
            border-radius: 50%;
          }
          .active {
            color: #fff;
            background: #ce3d3e;
          }
        }
        .date-list:after {
          content: '';
          flex: auto;
        }
      }
      .c-year-panel {
        height: 85*7px;
        overflow: auto;
        font-weight: bold;
        li {
          text-align: center;
          line-height: 85px;
          border-bottom: 1.5px solid #999;
        }
        li:last-child {
          border-bottom: none;
        }
        .active {
          color: #ce3d3e;
          font-size: 35px;
        }
      }
    }
    .btns {
      color: #ff3a3a;
      float: right;
      font-size: 23px;
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      span {
        margin-left: 80px;
      }
    }
  }
}
.calendar-show {
  animation: opacity-show .2s linear;
}
.calendar-hide {
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
