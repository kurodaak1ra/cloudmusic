<template>
  <div class="playlist-edit-page web-page">
    <div class="nav">
      <div>
        <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
        <div>编辑歌单信息</div>
      </div>
    </div>
    <div class="main">
      <div class="cover">
        <span class="left">更换封面</span>
        <div class="pic" :style="{ backgroundImage: `url(${cover})` }"></div>
      </div>
      <div class="name" @click="tempName = name;renameWin = true">
        <span class="left">名称</span>
        <span class="right">{{name}}</span>
      </div>
      <div class="tags" @click="tagsWinShow()">
        <span class="left">标签</span>
        <div class="list">
          <p v-if="tags.length === 0">请输入歌单标签</p>
          <span v-for="(i, index) in tags" :key="index">{{i}}</span>
        </div>
      </div>
      <div class="description" @click="tempDescription = description;redescriptionWin = true">
        <span class="left">描述</span>
        <span class="right">{{description === '' || description === null ? '暂无描述' : description}}</span>
      </div>
    </div>
    <!-- 名称 -->
    <div v-if="renameWin" class="rename-win">
      <div class="nav">
        <div>
          <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
          <div>歌单名称</div>
        </div>
        <span @click="renameSava()">保存</span>
      </div>
      <div class="nickname">
        <input v-model="tempName" type="text" placeholder="编辑歌单名称" maxlength="15" autofocus="autofocus">
        <span v-if="tempName !== ''" @click="tempName = ''">&#xe62b;</span>
      </div>
    </div>
    <!-- 描述 -->
    <div v-if="redescriptionWin" class="redescription-win">
      <div class="nav">
        <div>
          <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
          <div>歌单介绍</div>
        </div>
        <span @click="redescriptionSava()">保存</span>
      </div>
      <div class="description">
        <textarea v-model="tempDescription" maxlength="1000" placeholder="歌单介绍" autofocus="autofocus"></textarea>
        <span>{{1000 - tempDescription.length}}</span>
      </div>
    </div>
    <!-- 标签 -->
    <div v-if="retagsWin" class="retags-win">
      <div class="nav">
        <div>
          <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
          <div>选择标签</div>
        </div>
        <span @click="retagsSave()">保存</span>
      </div>
      <div class="tags">
        <p class="tips">请选择合适的标签，最多选择3个，已选{{tempTags.length}}个</p>
        <template v-for="(value, name, index_1) in renderingTags">
          <table :key="index_1">
            <tr v-for="(i, index_2) in value" :key="index_2">
              <template v-for="(j, index_3) in i">
                <td v-if="index_3 === 0 && index_2 === 0" :key="index_3 + 'A'" rowspan="2"><span :style="{ border: value.length === 2 ? 'none' : '1px solid #f5f5f5;' }">{{name}}</span></td>
                <td :key="index_3 + 'B'" :class="{ 'active': tempTags.indexOf(j) !== -1 }">
                  <span @click="select($event)">{{j}}</span>
                  <i></i>
                  <em>&#xe634;</em>
                </td>
              </template>
            </tr>
          </table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getGLOBAL } from '../utils/store'
import { playlistDetailApi, playlistNameUpdateApi, playlistDescUpdateApi, playlistTagsUpdateApi } from '../utils/api'

export default {
  name: 'playlist-edit',
  data() {
    return {
      name: '',
      tags: [],
      description: '',
      cover: getGLOBAL('1px')['eeeeee'],
      // 名称
      renameWin: false,
      nameFlag: false,
      tempName: '',
      // 描述
      redescriptionWin: false,
      descriptionFlag: false,
      tempDescription: '',
      // 标签
      retagsWin: false,
      tagsFlag: false,
      tempTags: [],
      tagsList: {
        '语种': ['华语', '欧美', '日语', '韩语', '粤语', '小语种'],
        '风格': ['流行', '摇滚', '民谣', '电子', '舞曲', '说唱', '轻音乐', '爵士', '乡村', 'R&B/Soul', '古典', '民族', '英伦', '金属', '朋克', '蓝调', '雷鬼', '世界音乐', '拉丁', '另类/独立', 'New Age', '古风', '后摇', 'Bossa Nova'],
        '场景': ['清晨', '夜晚', '学习', '工作', '午休', '下午茶', '地铁', '驾车', '运动', '旅行', '散步', '酒吧'],
        '情感': ['怀旧', '清新', '浪漫', '性感', '伤感', '治愈', '放松', '孤独', '感动', '兴奋', '快乐', '安静', '思念'],
        '主题': ['影视原声', 'ACG', '儿童', '校园', '游戏', '70后', '80后', '90后', '网络歌曲', 'KTV', '经典', '翻唱', '吉他', '钢琴', '器乐', '榜单', '00后']
      }
    }
  },
  computed: {
    // tags 转换
    renderingTags() {
      let tagsData = {}
      for (let i in this.tagsList) {
        if (Object.prototype.hasOwnProperty.call(this.tagsList, i)) {
          let data = []
          let secData = []
          for (let j = 0; j < this.tagsList[i].length; j++) {
            secData.push(this.tagsList[i][j])
            if (data.length === 0 || data.length === 1) {
              if (secData.length === 3) {
                data.push(secData)
                secData = []
              }
            } else {
              if (secData.length === 4) {
                data.push(secData)
                secData = []
              }
            }
          }
          if (secData.length !== 0) {
            data.push(secData)
          }
          tagsData[i] = data
        }
      }
      return tagsData
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 开始
    init() {
      playlistDetailApi({
        id: getGLOBAL('playlistEdit').id,
        s: 0
      }).then(succ => {
        console.log('修改歌单信息获取歌单数据（success）：', succ)
        this.name = succ.playlist.name
        this.tags = succ.playlist.tags
        this.description = succ.playlist.description
        this.cover = succ.playlist.coverImgUrl
      }).catch(err => {
        console.warn('修改歌单信息获取歌单数据（error）：', err)
      })
    },

    // 改名
    renameSava() {
      if (this.tempName === '') {
        this.$toast('请输入歌单标题')
        return
      }
      playlistNameUpdateApi({
        id: getGLOBAL('playlistEdit').id,
        name: this.tempName
      }).then(succ => {
        console.log('歌单改名（success）：', succ)
        if (succ.code === 407) {
          this.$toast(succ.msg)
        } else {
          this.$toast('歌单名更新成功')
          this.name = this.tempName
          this.nameFlag = true
          this.renameWin = false
        }
      }).catch(err => {
        console.warn('歌单改名（error）：', err)
      })
    },

    // 介绍
    redescriptionSava() {
      playlistDescUpdateApi({
        id: getGLOBAL('playlistEdit').id,
        desc: this.tempDescription
      }).then(succ => {
        console.log('歌单改描述（success）：', succ)
        if (succ.code === 407) {
          this.$toast(succ.msg)
        } else {
          this.$toast('歌单描述更新成功')
          this.description = this.tempDescription
          this.descriptionFlag = true
          this.redescriptionWin = false
        }
      }).catch(err => {
        console.warn('歌单改描述（error）：', err)
      })
    },

    // 显示标签选择面板
    tagsWinShow() {
      // 避免操作 临时数组 联动 原数组（活久见
      this.tempTags = []
      for (let i = 0; i < this.tags.length; i++) this.tempTags.push(this.tags[i])
      this.retagsWin = true
    },

    // 标签
    retagsSave() {
      playlistTagsUpdateApi({
        id: getGLOBAL('playlistEdit').id,
        tags: this.tempTags.toString().replace(/,/g, ';')
      }).then(succ => {
        console.log('歌单改标签（success）：', succ)
        this.$toast('歌单标签更新成功')
      }).catch(err => {
        console.warn('歌单改标签（error）：', err)
      })
      this.tags = this.tempTags
      this.tagsFlag = true
      this.retagsWin = false
    },

    // 标签选择
    select(ev) {
      let index = this.tempTags.indexOf(ev.target.innerText)
      if (index !== -1) {
        this.tempTags.splice(index, 1)
      } else {
        if (this.tempTags.length >= 3) {
          this.$toast('最多只允许添加3个标签！')
          return
        }
        this.tempTags.push(ev.target.innerText)
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.renameWin || this.redescriptionWin || this.retagsWin) {
      this.renameWin = this.redescriptionWin = this.retagsWin = false
      return next(false)
    }

    next()
  }
}
</script>

<style lang="scss">
.playlist-edit-page {
  .nav {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    div {
      font-size: 30px;
      display: flex;
      align-items: center;
      .back-icon {
        font-size: 35px;
        margin-right: 30px;
      }
    }
    span {
      font-size: 26px;
    }
  }
  .main {
    margin-top: 90px;
    padding-left: 28px;
    border-top: 15px solid #f5f5f5;
    >div {
      height: 95px;
      padding-right: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid #f5f5f5;
      .left {
        font-size: 28px;
      }
      .right {
        color: #666;
        font-size: 25px;
      }
      .list {
        color: #666;
        span {
          font-size: 20px;
          border-radius: 50PX;
          border: 1.5px solid #f5f5f5;
          padding: 0.5em 1em;
          margin-left: 15px;
        }
      }
    }
    >div:last-child {
      border: none;
    }
    .cover {
      height: 125px;
      .pic {
        width: 90px;
        height: 90px;
        background: no-repeat center center / cover;
        translate: background-image .2s;
      }
    }
  }
  .rename-win {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: #fff;
    .nickname {
      height: 80px;
      margin: 110px 28px 0;
      border-bottom: 1.5px solid #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      input {
        font-size: 30px;
      }
      input::-webkit-input-placeholder {
        color: #c8c8c8;
      }
      input:-moz-placeholder {
        color: #c8c8c8;
      }
      input::-moz-placeholder {
        color: #c8c8c8;
      }
      input:-ms-input-placeholder {
        color: #c8c8c8;
      }
    }
  }
  .redescription-win {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: #fff;
    .description {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      textarea {
        width: 100%;
        height: 100%;
        resize: none;
        font-size: 27px;
        text-align: justify;
        line-height: 1.3em;
        border: none;
        padding: 120px 20px 0;
        border-bottom: 1.5px solid #f5f5f5;
      }
      span {
        color: #ccc;
        line-height: 3em;
        text-align: right;
        margin-right: 0.5em;
        flex-shrink: 1;
      }
    }
  }
  .retags-win {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: #fff;
    .tags {
      position: absolute;
      top: 90px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: auto;
      .tips {
        color: #555;
        font-size: 22px;
        line-height: 60px;
        padding-left: 28px;
      }
      table {
        width: 100%;
        text-align: center;
        table-layout: fixed;
        margin-bottom: 25px;
        border-collapse: collapse;
        tr {
          td {
            overflow: hidden;
            position: relative;
            border: 1.5px solid #f5f5f5;
            span {
              height: 75px;
              display: block;
              line-height: 75px;
              box-sizing: border-box;
              border: 2px solid transparent;
            }
            em {
              color: #fff;
              position: absolute;
              right: 6px;
              bottom: 1px;
              font-size: 15px;
              font-weight: bold;
            }
          }
          .active {
            span {
              border-color: #ff3a3a;
            }
            i {
              display: block;
              width: 49.5px;
              height: 49.5px;
              background: #ff3a3a;
              transform: rotate(45deg);
              position: absolute;
              right: -25px;
              bottom: -25px;
            }
          }
        }
        tr:first-child {
          td {
            border-top: none;
          }
        }
        tr:last-child {
          td {
            border-bottom: none;
          }
        }
      }
    }
  }
}
</style>
