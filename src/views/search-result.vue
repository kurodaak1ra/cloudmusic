<template>
  <div class="search-result-page web-page">
    <div class="bar">
      <div class="nav">
        <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
        <div>
          <input ref="input" v-model="tempKeyWords" type="tetx" :placeholder="placeholder" maxlength="20" autofocus="autofocus" @keyup.enter="enterSearch" @input="keywordsInput" @focus="keywordsFocus">
          <span v-if="tempKeyWords !== ''" class="clear" @click="clearFun()">&#xe62b;</span>
        </div>
        <span></span>
      </div>
      <!-- 搜索建议 -->
      <ul v-if="suggestWin" class="suggest-float-resault-win">
        <li @click="suggestClick()">搜索 “{{tempKeyWords}}”</li>
        <li v-for="(i, index) in suggest" :key="index" @click="suggestClick(i.keyword)">
          <span>&#xe677; &nbsp;</span>
          <span>{{i.keyword}}</span>
        </li>
      </ul>
      <!-- 二级导航 -->
      <ul ref="secNav" class="sec-nav no-scroll-bar">
        <li :class="{ 'active': navIndex === 0 }" @click="swiper.slideTo(0, 300)">
          <span>综合</span>
          <span class="line"></span>
        </li>
        <li :class="{ 'active': navIndex === 1 }" @click="swiper.slideTo(1, 300)">
          <span>单曲</span>
          <span class="line"></span>
        </li>
        <li :class="{ 'active': navIndex === 2 }" @click="swiper.slideTo(2, 300)">
          <span>云村</span>
          <span class="line"></span>
        </li>
        <li :class="{ 'active': navIndex === 3 }" @click="swiper.slideTo(3, 300)">
          <span>视频</span>
          <span class="line"></span>
        </li>
        <li :class="{ 'active': navIndex === 4 }" @click="swiper.slideTo(4, 300)">
          <span>歌手</span>
          <span class="line"></span>
        </li>
        <li :class="{ 'active': navIndex === 5 }" @click="swiper.slideTo(5, 300)">
          <span>专辑</span>
          <span class="line"></span>
        </li>
        <li :class="{ 'active': navIndex === 6 }" @click="swiper.slideTo(6, 300)">
          <span>歌单</span>
          <span class="line"></span>
        </li>
        <li :class="{ 'active': navIndex === 7 }" @click="swiper.slideTo(7, 300)">
          <span>主播电台</span>
          <span class="line"></span>
        </li>
        <li :class="{ 'active': navIndex === 8 }" @click="swiper.slideTo(8, 300)">
          <span>用户</span>
          <span class="line"></span>
        </li>
      </ul>
    </div>
    <swiper ref="mySwiper" class="content" :options="swiperOption()">
      <!-- 综合 -->
      <swiper-slide>
        <scroll ref="complexScroll" class="complex" :up="getComplexScrollUp()">
          <!--/\ 单曲 /\-->
          <ul v-if="list.complex.order.indexOf('song') !== -1" class="complex-songs">
            <div class="s-title">
              <span>单曲</span>
            </div>
            <li v-for="(i, index) in list.complex.song.songs" :key="index">
              <div class="left" @click="goPlay(i.song.id, i.privilege.pl, musicList[index], null, 'search')">
                <p class="title one-line-ellipsis">
                  <span :class="{ 'can': i.privilege.pl !== 0 }" v-html="i.song.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></span>
                  <span v-if="i.alia !== ''">({{i.alia}}</span>
                </p>
                <p class="artist one-line-ellipsis">
                  <span v-if="i.privilege.fee === 1" class="icon vip">&#xe68b;</span>
                  <span v-if="i.privilege.flag === 1092" class="icon listen">&#xe68d;</span>
                  <span v-if="/64|68|1092/.test(i.privilege.flag)" class="icon only">&#xe68c;</span>
                  <span v-if="i.privilege.maxbr === 999000" class="icon sq">&#xe659;</span>
                  <span>{{i.artist}}</span>&nbsp;-&nbsp;
                  <span v-html="i.album.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></span>
                </p>
                <p class="alia one-line-ellipsis">{{i.alia}}</p>
              </div>
              <div class="right">
                <span v-if="i.mv !== 0" class="mv" @click="mv(i.mv)">&#xe609;</span>
                <span class="info" @click="SET_PAGE_DATA(['info', 'id', i.song.id]);SET_WINDOWS(['info', true])">&#xe61f;</span>
              </div>
            </li>
            <p v-if="list.complex.song.more" class="more">{{list.complex.song.moreText}} &#xe624;</p>
          </ul>
          <!--/\ 歌单 /\-->
          <ul v-if="list.complex.order.indexOf('playList') !== -1" class="complex-playlists">
            <div class="s-title">
              <span>歌单</span>
            </div>
            <li v-for="(i, index) in list.complex.playList.playLists" :key="index" @click="goPlaylist(i.id, i.name)">
              <div class="cover" :style="{ backgroundImage: `url(${i.coverImgUrl}?imageView=1&thumbnail=145x0)` }"></div>
              <div class="info">
                <p v-html="i.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></p>
                <p>{{i.trackCount}}首，播放{{formatCount(i.playCount)}}次</p>
              </div>
            </li>
            <p v-if="list.complex.playList.more" class="more" @click="navChange(6)">{{list.complex.playList.moreText}} &#xe624;</p>
          </ul>
          <!--/\ 相关搜索 /\-->
          <div v-if="list.complex.order.indexOf('sim_query') !== -1" class="related-search">
            <div class="s-title">
              <span>相关搜索</span>
            </div>
            <ul>
              <li v-for="(i, index) in list.complex.sim_query.sim_querys" :key="index" @click="keyWords = i.keyword;tempKeyWords = i.keyword;enterSearch()">{{i.keyword}}</li>
            </ul>
          </div>
          <!--/\ 视频 /\-->
          <ul v-if="list.complex.order.indexOf('video') !== -1" class="complex-videos">
            <div class="s-title">
              <span>视频</span>
            </div>
            <li v-for="(i, index) in list.complex.video.videos" :key="index" @click="goVideo(i.vid)">
              <div class="cover">
                <div :style="{ backgroundImage: `url(${i.coverUrl}?imageView=1&thumbnail=220x0)` }"></div>
                <span>&#xe667;{{formatCount(i.playTime)}}</span>
              </div>
              <div class="info">
                <p class="two-line-ellipsis">
                  <span v-if="!isNaN(i.vid)" class="mv-icon">&#xe693;</span>
                  <span v-html="i.title.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></span>
                </p>
                <p class="two-line-ellipsis">{{durationFormat(i.durationms)}} by <template v-for="i in i.creator">{{i.userName}}</template></p>
              </div>
            </li>
            <p v-if="list.complex.video.more" class="more" @click="navChange(3)">{{list.complex.video.moreText}} &#xe624;</p>
          </ul>
          <!--/\ 歌手 /\-->
          <ul v-if="list.complex.order.indexOf('artist') !== -1" class="complex-artists">
            <div class="s-title">
              <span>歌手</span>
            </div>
            <li v-for="(i, index) in list.complex.artist.artists" :key="index" @click="goUser('artist', i.id)">
              <div class="cover" :style="{ backgroundImage: `url(${i.img1v1Url}?imageView=1&thumbnail=145x0)` }"></div>
              <div class="info">
                <p>
                  <span v-html="i.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></span>
                  <span class="alias">{{i.alias.length === 0 ? '' : `（${i.alias.toString().replace(/,/g, '/')}）`}}</span>
                </p>
              </div>
            </li>
            <p v-if="list.complex.artist.more" class="more" @click="navChange(4)">{{list.complex.artist.moreText}} &#xe624;</p>
          </ul>
          <!--/\ 专辑 /\-->
          <ul v-if="list.complex.order.indexOf('album') !== -1" class="complex-albums">
            <div class="s-title">
              <span>专辑</span>
            </div>
            <li v-for="(i, index) in list.complex.album.albums" :key="index" @click="goAlbum(i.id, i.name)">
              <div class="cover">
                <div :style="{ backgroundImage: `url(${i.picUrl}?imageView=1&thumbnail=145x0)` }"></div>
                <img src="../assets/img/collect/digital-album.svg" alt="">
              </div>
              <div class="info">
                <p v-html="i.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></p>
                <p>{{i.artist.name}} {{timestampToTime(i.publishTime, 'YMD', '.')}}</p>
              </div>
            </li>
            <p v-if="list.complex.album.more" class="more" @click="navChange(5)">{{list.complex.album.moreText}} &#xe624;</p>
          </ul>
          <!--/\ 电台 /\-->
          <ul v-if="list.complex.order.indexOf('djRadio') !== -1" class="complex-djRadio">
            <div class="s-title">
              <span>电台</span>
            </div>
            <li v-for="(i, index) in list.complex.djRadio.djRadios" :key="index" @click="goDjRadios(i.id)">
              <div class="cover" :style="{ backgroundImage: `url(${i.picUrl}?imageView=1&thumbnail=145x0)` }"></div>
              <div class="info">
                <p v-html="i.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></p>
                <p>{{i.dj.nickname}}</p>
              </div>
            </li>
            <p v-if="list.complex.djRadio.more" class="more">{{list.complex.djRadio.moreText}} &#xe624;</p>
          </ul>
          <!--/\ 用户 /\-->
          <ul v-if="list.complex.order.indexOf('user') !== -1" class="complex-user">
            <div class="s-title">
              <span>用户</span>
            </div>
            <li v-for="(i, index) in list.complex.user.users" :key="index" @click="goUser('user', i.userId)">
              <div class="cover" :style="{ backgroundImage: `url(${i.avatarUrl}?imageView=1&thumbnail=145x0)` }"></div>
              <div class="info">
                <div>
                  <p><span v-html="i.nickname.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></span>&nbsp;<span :style="{ color: i.gender === 1 ? '#3da8dd' : i.gender === 2 ? '#ff80b3' : '' }">{{i.gender === 1 ? '&#xe665;' : i.gender === 2 ? '&#xe664;' : ''}}</span></p>
                  <p class="signature">{{i.signature}}</p>
                </div>
                <span v-if="i.followed" class="follow-yes" @click.stop="followUser()">&#xe634; 已关注</span>
                <span v-else class="follow-no" @click.stop="followUser()">&#xe666; 关注</span>
              </div>
            </li>
            <p v-if="list.complex.user.more" class="more" @click="navChange(8)">{{list.complex.user.moreText}} &#xe624;</p>
          </ul>
        </scroll>
      </swiper-slide>
      <!-- 单曲 -->
      <swiper-slide>
        <scroll ref="songScroll" class="songs" :up="getScrollUp(1)">
          <li v-for="(i, index) in list.song.data" :key="index">
            <div class="left" @click="goPlay(i.song.id, i.privilege.pl, musicList[index], null, 'search')">
              <p class="title one-line-ellipsis">
                <span :class="{ 'can': i.privilege.pl !== 0 }" v-html="i.song.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></span>
                <span v-if="i.alia !== ''">({{i.alia}}</span>
              </p>
              <p class="artist one-line-ellipsis">
                <span v-if="i.privilege.fee === 1" class="icon vip">&#xe68b;</span>
                <span v-if="i.privilege.flag === 1092" class="icon listen">&#xe68d;</span>
                <span v-if="/64|68|1092/.test(i.privilege.flag)" class="icon only">&#xe68c;</span>
                <span v-if="i.privilege.maxbr === 999000" class="icon sq">&#xe659;</span>
                <span>{{i.artist}}</span>&nbsp;-&nbsp;
                <span v-html="i.album.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></span>
              </p>
              <p class="alia one-line-ellipsis">{{i.alia}}</p>
            </div>
            <div class="right">
              <span v-if="i.mv !== 0" class="mv" @click="mv(i.mv)">&#xe609;</span>
              <span class="info" @click="SET_PAGE_DATA(['info', 'id', i.song.id]);SET_WINDOWS(['info', true])">&#xe61f;</span>
            </div>
          </li>
        </scroll>
      </swiper-slide>
      <!-- 云村 -->
      <swiper-slide>
        <scroll ref="kumoMuraScroll" class="kumo-mura" :up="getKumoMuraScrollUp()">
          <!--  -->
          <ul v-if="list.kumoMuraTalk.totalCount !== 0" class="talk">
            <p class="title">主题</p>
            <li v-for="(i, index) in list.kumoMuraTalk.resources" :key="index">
              <div class="cover" :style="{ backgroundImage: `url(${i.showCover.url}?imageView=1&thumbnail=185x0)` }"></div>
              <div class="info">
                <p>&#xe694; {{i.talkName}}</p>
                <p>
                  <span v-if="i.follows !== 0">{{i.follows}}人关注</span>
                  <span>{{i.mlogCount}}人参与</span>
                </p>
              </div>
            </li>
            <p v-if="list.kumoMuraTalk.more" class="more">{{list.kumoMuraTalk.moreText}} &#xe624;</p>
          </ul>
          <!--  -->
          <div class="mlog">
            <p v-if="list.kumoMuraMlog.totalCount !== 0" class="title">Mlog</p>
            <ul>
              <li v-for="(i, index) in list.kumoMuraMlog.resources" :key="index">
                <div class="cover" :style="{ backgroundImage: `url(${i.resource.mlogBaseData.coverUrl}?imageView=1&thumbnail=335x0)` }">
                  <div v-if="i.matchFieldContent !== null">
                    <span class="one-line-ellipsis">&#xe695; {{i.matchFieldContent}}</span>
                  </div>
                </div>
                <div class="info">
                  <p class="two-line-ellipsis">{{i.resource.mlogBaseData.text}}</p>
                  <p>
                    <span>
                      <i class="avatar" :style="{ backgroundImage: `url(${i.resource.userProfile.avatarUrl})` }"></i>
                      <span class="one-line-ellipsis">{{i.resource.userProfile.nickname}}</span>
                    </span>
                    <span>{{i.resource.mlogExtVO.likedCount}}赞</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </scroll>
      </swiper-slide>
      <!-- 视频 -->
      <swiper-slide>
        <scroll ref="mvScroll" class="videos" :up="getScrollUp(1014)">
          <li v-for="(i, index) in list.mv.data" :key="index" @click="goMv(i.vid)">
            <div class="cover">
              <div :style="{ backgroundImage: `url(${i.coverUrl}?imageView=1&thumbnail=220x0)` }"></div>
              <span>&#xe667;{{formatCount(i.playTime)}}</span>
            </div>
            <div class="info">
              <p class="two-line-ellipsis">
                <span v-if="!isNaN(i.vid)" class="mv-icon">&#xe693;</span>
                <span v-html="i.title.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></span>
              </p>
              <p class="two-line-ellipsis">{{durationFormat(i.durationms, 1000)}} by {{i.creator[0].userName}}</p>
            </div>
          </li>
        </scroll>
      </swiper-slide>
      <!-- 歌手 -->
      <swiper-slide>
        <scroll ref="artistScroll" class="artists" :up="getScrollUp(100)">
          <li v-for="(i, index) in list.artist.data" :key="index" @click="goUser('artist', i.id)">
            <div class="cover" :style="{ backgroundImage: `url(${i.img1v1Url}?imageView=1&thumbnail=90x0)` }"></div>
            <div class="info">
              <p>
                <span v-html="i.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></span>
                <span class="alias">{{i.alias.length === 0 ? '' : `(${i.alias.toString().replace(/,/g, '/')})`}}</span>
              </p>
            </div>
          </li>
        </scroll>
      </swiper-slide>
      <!-- 专辑 -->
      <swiper-slide>
        <scroll ref="albumScroll" class="albums" :up="getScrollUp(10)">
          <li v-for="(i, index) in list.album.data" :key="index" @click="goAlbum(i.id, i.name)">
            <div class="cover">
              <div :style="{ backgroundImage: `url(${i.blurPicUrl}?imageView=1&thumbnail=90x0)` }"></div>
              <img src="../assets/img/collect/digital-album.svg" alt="">
            </div>
            <div class="info">
              <p class="one-line-ellipsis" v-html="i.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></p>
              <p><span :style="{ color: i.artist.name === keyWords ? keyWordsColor : 'unset' }">{{i.artist.name}}</span> {{timestampToTime(i.publishTime, 'YMD', '.')}}</p>
            </div>
          </li>
        </scroll>
      </swiper-slide>
      <!-- 歌单 -->
      <swiper-slide>
        <scroll ref="playlistScroll" class="playlists" :up="getScrollUp(1000)">
          <li v-for="(i, index) in list.playlist.data" :key="index" @click="goPlaylist(i.id, i.name)">
            <div class="cover" :style="{ backgroundImage: `url(${i.coverImgUrl}?imageView=1&thumbnail=90x0)` }"></div>
            <div class="info">
              <p v-html="i.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></p>
              <p>{{i.trackCount}}首 by {{i.creator.nickname}}，播放{{formatCount(i.playCount)}}次</p>
            </div>
          </li>
        </scroll>
      </swiper-slide>
      <!-- 电台 -->
      <swiper-slide>
        <scroll ref="djRadioScroll" class="dj-radios" :up="getScrollUp(1009)">
          <span v-if="list.djRadio.data.length !== 0" class="s-title">电台</span>
          <li v-for="(i, index) in list.djRadio.data" :key="index" @click="goDjRadios(i.id)">
            <div class="cover" :style="{ backgroundImage: `url(${i.picUrl}?imageView=1&thumbnail=90x0)` }"></div>
            <div class="info">
              <span v-html="i.name.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></span>
              <p>{{i.dj.nickname}}</p>
            </div>
          </li>
        </scroll>
      </swiper-slide>
      <!-- 用户 -->
      <swiper-slide>
        <scroll ref="userScroll" class="user-profiles" :up="getScrollUp(1002)">
          <li v-for="(i, index) in list.user.data" :key="index" @click="goUser('user', i.userId)">
            <div class="avatar" :style="{ backgroundImage: `url(${i.avatarUrl}?imageView=1&thumbnail=90x0)` }"></div>
            <div class="info">
              <div>
                <p>
                  <span v-html="i.nickname.replace(keyWords, `<span style='color: ${keyWordsColor}'>${keyWords}</span>`)"></span>
                  <span v-if="i.gender === 1" class="male"> &#xe665;</span>
                  <span v-if="i.gender === 2" class="female"> &#xe664;</span>
                </p>
                <p class="one-line-ellipsis">{{i.signature}}</p>
              </div>
              <span v-if="i.followed" class="followed">&#xe634; 已关注</span>
              <span v-else class="follow" @click.stop="followUser(index, i.userId, i.followed)">&#xe666; 关注</span>
            </div>
          </li>
        </scroll>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import scroll from './plugins/scroll'
import { mapMutations } from 'vuex'
import { goPlay, goAlbum, goPlaylist, goUser, goArtist, goLogin } from '../utils/function'
import { getGLOBAL } from '../utils/store'
import { searchDefaultApi, searchApi, searchSuggestApi, followApi, searchResourceTalkApi, searchResourceMlogApi } from '../utils/api'
import { formatCount, durationFormat, timestampToTime, projectMainCoreData } from '../utils/tools'

export default {
  name: 'search-result',
  inject: ['reload'],
  components: { scroll },
  data() {
    return {
      // 方法
      formatCount,
      durationFormat,
      timestampToTime,
      getGLOBAL,
      goPlay,
      goAlbum,
      goPlaylist,
      // 数据
      defaultKeywords: '',
      keyWords: '',
      placeholder: '音乐、视频、歌词、电台',
      tempKeyWords: '',
      keyWordsColor: '#3f70a7',
      type: 1018,
      navIndex: 0,
      // 歌曲主数据
      musicList: [],
      // 搜索建议
      suggest: [],
      suggestWin: false,
      // 搜索
      list: {
        complex: { order: [], data: [] },
        song: { offset: 0, data: [] },
        kumoMuraTalk: { more: false, moreText: '', totalCount: 0, resources: [] },
        kumoMuraMlog: { offset: 0, totalCount: 0, resources: [] },
        mv: { offset: 0, data: [] },
        artist: { offset: 0, data: [] },
        album: { offset: 0, data: [] },
        playlist: { offset: 0, data: [] },
        djRadio: { offset: 0, data: [] },
        user: { offset: 0, data: [] }
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    },

    // songTitleComputed() {  // 闭包传参
    //   return function (name, alia) {
    //     let newReg = new RegExp(this.keyWords, 'i')
    //     let data_1 = name.replace(newReg, `<span style='color: ${this.keyWordsColor}'>${name}</span>`)
    //     let data_2 = alia.toString().replace(/,/g, '/')
    //     data_2.replace(newReg, `<span style='color: ${this.keyWordsColor}'>${name}</span>`)
    //     if (alia.length === 0) {
    //       return data_1
    //     } else {
    //       return data_1 + `（${data_2}）`
    //     }
    //   }
    // }
  },
  created() {
    this.type = getGLOBAL('search').type
    this.keyWords = getGLOBAL('search').keywords
    this.tempKeyWords = getGLOBAL('search').keywords
    this.searchDefault()
  },
  mounted() {
    // @blur 报错，没法用，曲线救国
    this.$refs.input.addEventListener('blur', () => {
      setTimeout(() => { this.suggestWin = false }) // 防止一点击搜索建议直接隐藏导致没点到
    })

    // 初始化加载
    if (this.type === 1018) {
      this.$refs.complexScroll.init()
    } else {
      this.swiper.slideTo(this.exchange(1, this.type), 0)
    }

    // 二级导航滑动
    this.navSlide()

    // 安卓关闭键盘自动失去焦点
    // if (/iPhone|iPad|iPod|Mac/i.test(window.navigator.userAgent)) return
    // const originHeight = document.documentElement.clientHeight || document.body.clientHeight
    // window.addEventListener('resize', () => {
    //   const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
    //   if (resizeHeight === originHeight) this.$refs.input.blur()
    // }, false)
  },
  methods: {
    ...mapMutations([
      'SET_WINDOWS',
      'SET_PAGE_DATA'
    ]),

    // swiper
    swiperOption() {
      let _this = this
      return {
        on: {
          slideChangeTransitionEnd: function() {
            _this.musicList = []
            _this.navIndex = this.activeIndex
            _this.navSlide()
            _this.type = _this.exchange(0, this.activeIndex)
            if (this.activeIndex === 0 && _this.list.complex.data.length === 0) {
              _this.$refs.complexScroll.init()
            } else if (this.activeIndex === 1 && _this.list.song.data.length === 0) {
              _this.$refs.songScroll.init()
            } else if (this.activeIndex === 2 && _this.list.kumoMuraMlog.resources.length === 0) {
              _this.kumoMuraTalk()
              _this.$refs.kumoMuraScroll.init()
            } else if (this.activeIndex === 3 && _this.list.mv.data.length === 0) {
              _this.$refs.mvScroll.init()
            } else if (this.activeIndex === 4 && _this.list.artist.data.length === 0) {
              _this.$refs.artistScroll.init()
            } else if (this.activeIndex === 5 && _this.list.album.data.length === 0) {
              _this.$refs.albumScroll.init()
            } else if (this.activeIndex === 6 && _this.list.playlist.data.length === 0) {
              _this.$refs.playlistScroll.init()
            } else if (this.activeIndex === 7 && _this.list.djRadio.data.length === 0) {
              _this.$refs.djRadioScroll.init()
            } else if (this.activeIndex === 8 && _this.list.user.data.length === 0) {
              _this.$refs.userScroll.init()
            }
          }
        }
      }
    },

    // scroll
    getComplexScrollUp() {
      return {
        auto: false,
        empty: `未找到与${this.keyWords}相关的内容`,
        callback: () => { this.complexFun() }
      }
    },
    getScrollUp(type) {
      return {
        auto: false,
        empty: `未找到与${this.keyWords}相关的内容`,
        callback: () => { this.searchFun(type) }
      }
    },
    getKumoMuraScrollUp() {
      return {
        auto: false,
        empty: `未找到与${this.keyWords}相关的内容`,
        callback: () => { this.kumoMuraMlog() }
      }
    },

    // nav 滑动切换
    navSlide() {
      if (this.navIndex < 2) return
      let bodyHalf = document.body.offsetWidth / 2
      let selfHalf = this.$refs.secNav.childNodes[this.navIndex].offsetWidth / 2
      let selfLeft = this.$refs.secNav.childNodes[this.navIndex].offsetLeft
      let offsetLeft = bodyHalf - selfHalf
      let toLeft = selfLeft - offsetLeft
      this.$refs.secNav.scrollTo({
        left: toLeft,
        behavior: 'smooth'
      })
    },

    // 清空输入框
    clearFun() {
      this.tempKeyWords = ''
      this.suggestWin = false
      this.$refs.input.focus()
    },

    // 各种转换
    exchange(type, index) {
      let arr = [1018, 1, 0, 1014, 100, 10, 1000, 1009, 1002]
      if (type === 0) {
        return arr[index]
      } else if (type === 1) {
        return arr.indexOf(index)
      }
    },

    // type 转 字段名
    fieldName(type) {
      return {
        1: { count: 'songCount', arr: 'songs', name: 'song' },
        10: { count: 'albumCount', arr: 'albums', name: 'album' },
        100: { count: 'artistCount', arr: 'artists', name: 'artist' },
        1000: { count: 'playlistCount', arr: 'playlists', name: 'playlist' },
        1002: { count: 'userprofileCount', arr: 'userprofiles', name: 'user' },
        1009: { count: 'djRadiosCount', arr: 'djRadios', name: 'djRadio' },
        1014: { count: 'videoCount', arr: 'videos', name: 'mv' }
      }[type]
    },

    // 默认搜索关键字
    searchDefault() {
      searchDefaultApi().then(succ => {
        console.log('默认搜索关键词（succees）：', succ)
        this.defaultKeywords = succ.data.realkeyword
        this.placeholder = succ.data.showKeyword
      }).catch(err => {
        console.warn('默认搜索关键词（error）：', err)
      })
    },

    // 回车搜索
    enterSearch() {
      let words = ''
      if (this.tempKeyWords === '') {
        words = this.defaultKeywords
      } else {
        words = this.tempKeyWords
      }
      // 保留历史记录
      let tempHistory = getGLOBAL('search').history
      let index = tempHistory.indexOf(this.keyWords)
      if (index !== -1) tempHistory.splice(index, 1)
      tempHistory.unshift(this.keyWords)
      this.SET_PAGE_DATA(['search', 'history', tempHistory])
      // 设为默认搜索值
      this.SET_PAGE_DATA(['search', 'type', this.type])
      this.SET_PAGE_DATA(['search', 'keywords', words])
      // 刷新当前页面
      this.reload()
    },

    // 综合
    complexFun() {
      searchApi({
        keywords: this.keyWords,
        type: 1018,
      }).then(succ => {
        console.log('综合搜索（success）：', succ)
        this.list.complex = succ.result
        if (succ.result.order.indexOf('song') !== -1) this.list.complex.song.songs = this.mainCoreData(succ.result.song.songs)
        this.$refs.complexScroll.upEndSucc({ more: false, empty: succ.result.order.length === 0 ? true : false })
      }).catch(err => {
        console.warn('综合搜索（error）：', err)
        this.$refs.complexScroll.upEndErr()
      })
    },

    // 云村搜索
    kumoMuraTalk() {
      searchResourceTalkApi({
        keywords: this.keyWords
      }).then(succ => {
        console.log('歌曲搜索「云村 主题」（success）：', succ)
        this.list.kumoMuraTalk = succ.data
      }).catch(err => {
        console.warn('歌曲搜索「云村 主题」（error）：', err)
      })
    },
    kumoMuraMlog() {
      searchResourceMlogApi({
        keywords: this.keyWords,
        limit: 20,
        offset: this.list.kumoMuraMlog.offset
      }).then(succ => {
        console.log('歌曲搜索「云村 mlog」（success）：', succ)
        // 无数据 return
        if (succ.data.resources === null || Object.keys(succ.data.resources).length === 0) {
          this.$refs.kumoMuraScroll.upEndSucc({ more: false, empty: true })
          return
        }
        // 设置数据
        this.list.kumoMuraMlog.totalCount = succ.data.totalCount
        this.list.kumoMuraMlog.resources = this.list.kumoMuraMlog.resources.concat(succ.data.resources)
        this.list.kumoMuraMlog.offset += 20
        // loading结束
        this.$refs.kumoMuraScroll.upEndSucc({ more: succ.data.more, empty: succ.data.totalCount === 0 ? true : false })
      }).catch(err => {
        console.warn('歌曲搜索「云村 mlog」（error）：', err)
        this.$refs.kumoMuraScroll.upEndErr()
      })
    },

    /**
     * 搜索
     * 1: 单曲，10: 专辑，100: 歌手，1000: 歌单，1002: 用户，1004: MV，1006: 歌词，1009: 电台，1014: 视频，1018: 综合
     */
    searchFun(type) {
      searchApi({
        type: type,
        limit: 20,
        offset: this.list[this.fieldName(type).name].offset,
        keywords: this.keyWords,
        strategy: type === 1 ? 5 : ''   // 单曲高亮字段，加与不加返回值很不同
      }).then(succ => {
        // 转换字段名
        let field = this.fieldName(type)
        console.log(`歌曲搜索「${field.name}」（success）：`, succ)
        // 无数据 return
        if (succ.result === null || Object.keys(succ.result).length === 0 || succ.result[field.count] === 0) {
          this.reqEnd(this.navIndex, true, false, true)
          return
        }
        // 设置数据
        if (type === 1) {
          this.list.song.data = this.list.song.data.concat(this.mainCoreData(succ.result[field.arr]))
        } else {
          this.list[field.name].data = this.list[field.name].data.concat(succ.result[field.arr])
        }
        // 设置偏移
        this.list[field.name].offset += 20
        let more = this.list[field.name].data.length >= succ.result[field.count] ? false : true
        let empty = succ.result[field.count] === 0 ? true : false
        // loading 结束
        this.reqEnd(this.navIndex, true, more, empty)
      }).catch(err => {
        // 转换字段名
        let field = this.fieldName(type)
        console.warn(`歌曲搜索「${field.name}」（error）：`, err)
        this.reqEnd(this.navIndex, false)
      })
    },

    // 请求结束
    reqEnd(index, status, more, empty) {
      if (index === 1) {
        if (status) {
          this.$refs.songScroll.upEndSucc({ more: more, empty: empty })
        } else {
          this.$refs.songScroll.upEndErr()
        }
      } else if (index === 3) {
        if (status) {
          this.$refs.mvScroll.upEndSucc({ more: more, empty: empty })
        } else {
          this.$refs.mvScroll.upEndErr()
        }
      } else if (index === 4) {
        if (status) {
          this.$refs.artistScroll.upEndSucc({ more: more, empty: empty })
        } else {
          this.$refs.artistScroll.upEndErr()
        }
      } else if (index === 5) {
        if (status) {
          this.$refs.albumScroll.upEndSucc({ more: more, empty: empty })
        } else {
          this.$refs.albumScroll.upEndErr()
        }
      } else if (index === 6) {
        if (status) {
          this.$refs.playlistScroll.upEndSucc({ more: more, empty: empty })
        } else {
          this.$refs.playlistScroll.upEndErr()
        }
      } else if (index === 7) {
        if (status) {
          this.$refs.djRadioScroll.upEndSucc({ more: more, empty: empty })
        } else {
          this.$refs.djRadioScroll.upEndErr()
        }
      } else if (index === 8) {
        if (status) {
          this.$refs.userScroll.upEndSucc({ more: more, empty: empty })
        } else {
          this.$refs.userScroll.upEndErr()
        }
      }
    },

    // 设置数据
    mainCoreData(data) {
      let tempArr = []
      for (let i = 0; i < data.length; i++) {
        // 艺术家信息
        let tempArtist = []
        for (let j = 0; j < data[i].ar.length; j++) {
          tempArtist.push(data[i].ar[j].name)
        }
        // 当前页数据
        tempArr.push({
          song: {
            id: data[i].id,
            name: data[i].name
          },
          album: {
            name: data[i].al.name
          },
          artist: tempArtist.toString().replace(/,/g, '/'),
          mv: data[i].mv,
          alia: data[i].alia.toString().replace(/,/g, '/'),
          privilege: {
            pl: data[i].privilege.pl,
            fee: data[i].privilege.fee,
            flag: data[i].privilege.flag,
            maxbr: data[i].privilege.maxbr
          }
        })
        this.musicList.push(projectMainCoreData(
          data[i],
          {
            id: null,
            name: '搜索',
            from: 'search'
          }
        ))
      }
      return tempArr
    },

    // 输入
    keywordsInput(ev) {
      this.noResult = false
      this.tempKeyWords = ev.target.value
      if (ev.target.value === '') {
        this.suggestWin = false
        return
      }
      this.suggestWin = true
      searchSuggestApi({
        type: this.type,
        limit: 10,
        keywords: ev.target.value
      }).then(succ => {
        console.log('搜索建议（success）：', succ)
        this.suggest = succ.result.allMatch
      }).catch(err => {
        console.warn('搜索建议（error）：', err)
      })
    },

    // 获取焦点
    keywordsFocus(ev) {
      if (this.tempKeyWords !== '') this.suggestWin = true
    },

    // 搜索建议点击
    suggestClick(keywords) {
      if (keywords !== undefined) {
        this.keyWords = keywords
        this.tempKeyWords = keywords
      } else {
        this.keyWords = this.tempKeyWords
      }
      this.enterSearch()
    },

    // 跳用户、艺术家
    goUser(type, id) {
      if (type === 'user') {
        goUser(id)
      } else if (type === 'artist') {
        goArtist(id)
      }
    },

    // 跳视频播放
    goVideo(id) {
      console.log(id)
      this.$toast('还没做')
    },

    // 跳 DJ
    goDjRadios(id) {
      console.log(id)
      this.$toast('还没做')
    },

    // 关注用户
    followUser(index, uid, follow) {
      if (index === undefined) {
        this.$toast('还没弄')
        return
      }
      if (!getGLOBAL('isLogin')) goLogin('user', uid)
      this.$loading()
      followApi({
        id: uid,
        t: follow ? 0 : 1   // 0: 取消, 1: 关注
      }).then(succ => {
        console.log('关注（success）：', succ)
        this.$rloading()
        if (follow) {
          this.search[index].followed = false
          this.$toast('取消关注成功')
        } else {
          this.search[index].followed = true
          this.$toast('关注成功')
        }
      }).catch(err => {
        console.warn('关注（error）：', err)
        this.$rloading()
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    this.SET_PAGE_DATA(['search', 'type', this.type])
    this.SET_PAGE_DATA(['search', 'keywords', this.keyWords])
    next()
  }
}
</script>

<style lang="scss">
.search-result-page {
  .bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    background: #fff;
    .nav {
      height: 90px;
      padding: 0 10px 0 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .back-icon {
        font-size: 35px;
        margin-right: 30px;
      }
      div {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1.5px solid #bebebe;
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
        span {
          font-size: 30px;
          margin: 0 15px 0 30px;
        }
      }
    }
    // 搜索建议
    .suggest-float-resault-win {
      width: 694px;
      background: #fff;
      position: absolute;
      top: 95px;
      left: 28px;
      z-index: 1;
      box-shadow: 0px 0px 10px 0px #888888;
      li {
        color: #707070;
        padding: 0 25px;
        line-height: 85px;
        border-top: 1px solid #f5f5f5;
        display: flex;
        align-items: center;
        span:first-child {
          font-size: 30px;
        }
      }
      li:first-child {
        color: #537fb0;
        border: none;
      }
    }
    .sec-nav {
      height: 70px;
      border-bottom: 1.5px solid #f5f5f5;
      overflow: auto;
      white-space: nowrap;
      padding: 0 28px;
      li {
        display: inline-block;
        height: 100%;
        margin-right: 55px;
        padding: 0 15px;
        line-height: 70px;
        position: relative;
        span:last-child {
          position: absolute;
          left: 50%;
          bottom: 0;
          margin-left: -1em;
        }
      }
      li:last-child {
        margin: 0;
      }
      .active {
        color: #ff3939;
        font-weight: bold;
        .line {
          display: block;
          width: 2em;
          height: 4px;
          background: #ff3939;
          border-radius: 4px;
        }
      }
    }
  }
  // content
  .content {
    position: absolute;
    top: 160px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  // complex
  .complex {
    padding: 0 28px 25px;
    .s-title {
      padding-top: 50px;
      span {
        font-size: 30px;
        font-weight: bold;
      }
    }
    .more {
      color: #aeaeae;
      text-align: center;
      font-size: 22px;
      margin-top: 30px;
    }
    // 单曲
    .complex-songs {
      li {
        overflow: hidden;
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          color: #aeaeae;
          width: 100%;
          overflow: hidden;
          .title {
            .can {
              color: #333;
            }
          }
          .artist {
            display: flex;
            align-items: center;
            font-size: 20px;
            margin-top: 5px;
            .icon {
              margin-right: 5px;
              font-size: 35px;
              vertical-align: middle;
            }
            .sq, .hq {
              font-size: 30px;
            }
            .vip, .sq, .hq {
              color: #fe672e;
            }
            .listen, .only {
              color: #ff3a3a;
            }
          }
          .alia {
            font-size: 18px;
          }
          .more {
            display: inline-block;
            font-size: 20px !important;
            margin-top: 15px;
          }
        }
        .right {
          color: #b3b3b3;
          flex-shrink: 0;
          span {
            margin-left: 25px;
          }
          .mv {
            font-size: 35px;
          }
          .info {
            font-size: 30px;
          }
        }
      }
      li:last-child {
        border: none;
        padding-bottom: 0;
      }
    }
    // 歌单
    .complex-playlists {
      li {
        padding-top: 25px;
        display: flex;
        .cover {
          width: 145px;
          height: 145px;
          flex-shrink: 0;
          border-radius: 8px;
          background: no-repeat center center / cover;
        }
        .info {
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          p:first-child {
            margin-bottom: 10px;
          }
          p:last-child {
            color: #808080;
            font-size: 20px;
          }
        }
      }
    }
    // 相关搜索
    .related-search {
      ul {
        overflow: hidden;
        margin-top: 6px;
        li {
          float: left;
          border-radius: 50PX;
          line-height: 55px;
          margin: 18px 15px 0 0;
          padding: 0 20px;
          background: rgba(0, 0, 0, 0.08);
        }
      }
    }
    // 视频
    .complex-videos {
      li {
        padding-top: 25px;
        display: flex;
        .cover {
          position: relative;
          flex-shrink: 0;
          div {
            width: 220px;
            height: 125px;
            flex-shrink: 0;
            border-radius: 15px;
            background: no-repeat center center / cover;
          }
          span {
            color: #fff;
            width: 100%;
            text-align: right;
            box-shadow: 0px 20px 20px -8px rgba(0, 0, 0, 0.4) inset;
            position: absolute;
            top: 0;
            right: 0;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 20px;
          }
        }
        .info {
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          p:first-child {
            .mv-icon {
              color: #ff3a3a;
              font-size: 35px;
              vertical-align: middle;
              padding-right: 5px;
            }
          }
          p:last-child {
            color: #808080;
            margin-top: 10px;
            font-size: 20px;
          }
        }
      }
    }
    // 歌手
    .complex-artists {
      li {
        display: flex;
        padding-top: 25px;
        .cover {
          width: 145px;
          height: 145px;
          flex-shrink: 0;
          border-radius: 50%;
          background: no-repeat center center / cover;
        }
        .info {
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .alias {
            color: #808080;
          }
        }
      }
    }
    // 专辑
    .complex-albums {
      li {
        padding-top: 25px;
        display: flex;
        .cover {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          div {
            width: 145px;
            height: 145px;
            border-radius: 10px;
            background: no-repeat center center / cover;
          }
          img:last-child {
            width: unset;
            height: 130px;
          }
        }
        .info {
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          p:first-child {
            margin-bottom: 10px;
          }
          p:last-child {
            color: #808080;
            font-size: 20px;
          }
        }
      }
    }
    // 电台
    .complex-djRadio {
      li {
        padding-top: 25px;
        display: flex;
        .cover {
          width: 145px;
          height: 145px;
          flex-shrink: 0;
          border-radius: 10px;
          background: no-repeat center center / cover;
        }
        .info {
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          p:first-child {
            margin-bottom: 10px;
          }
          p:last-child {
            color: #808080;
            font-size: 20px;
          }
        }
      }
    }
    // 用户
    .complex-user {
      li {
        display: flex;
        padding-top: 25px;
        .cover {
          width: 145px;
          height: 145px;
          flex-shrink: 0;
          border-radius: 50%;
          background: no-repeat center center / cover;
        }
        .info {
          width: 100%;
          margin-left: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          div {
            .signature {
              color: #808080;
              font-size: 20px;
            }
          }
          >span {
            width: 110px;
            height: 40px;
            flex-shrink: 0;
            line-height: 40px;
            text-align: center;
            border-radius: 50PX;
            font-size: 20px;
            margin-left: 35px;
            border: 1.5px solid;
          }
          .follow-no {
            color: #ff3a3a;
            border-color: #ff3a3a;
          }
          .follow-yes {
            color: rgba(255, 255, 255, 0.5);
            border: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }
  // songs
  .songs {
    padding: 0 28px;
    // .bar {
    //   height: 90px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    //   div {
    //     display: flex;
    //     align-items: center;
    //     span:first-child {
    //       margin-right: 10px;
    //     }
    //   }
    //   div:first-child {
    //     span:first-child {
    //       font-size: 40px;
    //     }
    //     span:last-child {
    //       font-size: 30px;
    //       font-weight: bold;
    //     }
    //   }
    // }
    li {
      overflow: hidden;
      padding: 20px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        color: #aeaeae;
        width: 100%;
        overflow: hidden;
        .title {
          .can {
            color: #333;
          }
        }
        .artist {
          font-size: 18px;
          line-height: 2em;
          display: flex;
          align-items: center;
          .icon {
            margin-right: 5px;
            font-size: 35px;
            vertical-align: middle;
          }
          .sq, .hq {
            font-size: 30px;
          }
          .vip, .sq, .hq {
            color: #fe672e;
          }
          .listen, .only {
            color: #ff3a3a;
          }
        }
        .alia {
          font-size: 18px;
        }
        .more {
          display: inline-block;
          font-size: 20px !important;
          margin-top: 15px;
        }
      }
      .right {
        color: #b3b3b3;
        flex-shrink: 0;
        span {
          margin-left: 25px;
        }
        .mv {
          font-size: 35px;
        }
        .info {
          font-size: 30px;
        }
      }
    }
    li:last-child {
      border: none;
    }
  }
  .kumo-mura {
    padding: 55px 28px 0;
    .title {
      font-weight: bold;
      font-size: 30px;
    }
    .talk {
      padding-bottom: 60px;
      li {
        padding-top: 20px;
        display: flex;
        .cover {
          width: 185px;
          height: 125px;
          border-radius: 15px;
          background: no-repeat center center / cover;
        }
        .info {
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          p:last-child {
            color: #888;
            font-size: 22px;
            margin-top: 10px;
            span:first-child {
              margin-right: 15px;
              padding-right: 15px;
              border-right: 1.5px solid #f5f5f5;
            }
          }
        }
      }
      .more {
        color: #888;
        font-size: 22px;
        text-align: center;
        margin-top: 30px;
      }
    }
    .mlog {
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
          width: 335px;
          overflow: hidden;
          border-radius: 15px;
          margin-top: 20px;
          box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.15);
          .cover {
            width: 100%;
            height: 335px;
            background: no-repeat center center / cover;
            position: relative;
            div {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              padding: 0 15px 3px;
              span {
                color: #fff;
                max-width: 100%;
                display: inline-block;
                font-size: 22px;
                font-weight: bold;
                background: rgba(0, 0, 0, 0.3);
                line-height: 40px;
                padding: 0 15px;
                border-radius: 50PX;
              }
            }
          }
          .info {
            padding: 15px;
            p:first-child {
              height: 3.4em;
              font-size: 22px;
              line-height: 1.7em;
            }
            p:last-child {
              color: #888;
              font-size: 20px;
              margin-top: 5px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              span:first-child {
                display: flex;
                align-items: center;
                overflow: hidden;
                .avatar {
                  display: inline-block;
                  width: 25px;
                  height: 25px;
                  flex-shrink: 0;
                  margin-right: 6px;
                  border-radius: 50%;
                  background: no-repeat center center / cover;
                }
              }
              span:last-child {
                white-space: nowrap;
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
  .videos {
    padding: 15px 28px 0;
    li {
      padding-bottom: 25px;
      display: flex;
      .cover {
        position: relative;
        div {
          width: 220px;
          height: 125px;
          flex-shrink: 0;
          border-radius: 15px;
          background: no-repeat center center / cover;
        }
        span {
          color: #fff;
          width: 100%;
          text-align: right;
          box-shadow: 0px 20px 20px -8px rgba(0, 0, 0, 0.4) inset;
          position: absolute;
          top: 0;
          right: 0;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 20px;
        }
      }
      .info {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        p:first-child {
          .mv-icon {
            color: #ff3a3a;
            font-size: 35px;
            padding-right: 5px;
            vertical-align: middle;
          }
        }
        p:last-child {
          color: #808080;
          margin-top: 10px;
          font-size: 20px;
        }
      }
    }
  }
  .artists {
    padding: 15px 28px 0;
    li {
      display: flex;
      align-items: center;
      margin-bottom: 35px;
      .cover {
        width: 90px;
        height: 90px;
        flex-shrink: 0;
        border-radius: 50%;
        background: no-repeat center center / cover;
      }
      .info {
        margin-left: 20px;
        .alias {
          color: #808080;
        }
      }
    }
  }
  .albums {
    padding: 15px 28px 0;
    li {
      display: flex;
      padding-bottom: 20px;
      .cover {
        display: flex;
        align-items: center;
        div {
          width: 90px;
          height: 90px;
          border-radius: 10px;
          background: no-repeat center center / cover;
        }
        img:last-child {
          width: unset;
          height: 80px;
        }
      }
      .info {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        p:first-child {
          margin-bottom: 10px;
        }
        p:last-child {
          color: #808080;
          font-size: 15px;
        }
      }
    }
  }
  .playlists {
    padding: 15px 28px 0;
    li {
      padding-bottom: 20px;
      display: flex;
      .cover {
        width: 90px;
        height: 90px;
        border-radius: 8px;
        background: no-repeat center center / cover;
      }
      .info {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        p:first-child {
          margin-bottom: 10px;
        }
        p:last-child {
          color: #808080;
          font-size: 20px;
        }
      }
    }
  }
  .dj-radios {
    padding: 15px 28px 0;
    .s-title {
      display: block;
      font-weight: bold;
      margin: 15px 0 30px;
    }
    li {
      padding-bottom: 20px;
      display: flex;
      align-items: center;
      .cover {
        width: 90px;
        height: 90px;
        flex-shrink: 0;
        border-radius: 8px;
        background: no-repeat center center / cover;
      }
      .info {
        margin-left: 20px;
        p:last-child {
          color: #808080;
          font-size: 20px;
          margin-top: 10px;
        }
      }
    }
  }
  .user-profiles {
    padding: 15px 28px 0;
    li {
      padding-bottom: 30px;
      display: flex;
      align-items: center;
      .avatar {
        width: 90px;
        height: 90px;
        flex-shrink: 0;
        border-radius: 50%;
        background: no-repeat center center / cover;
      }
      .info {
        width: 100%;
        margin-left: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        div {
          overflow: hidden;
          p {
            .male {
              color: #3da8dd;
            }
            .female {
              color: #ff80b3;
            }
          }
          p:last-child {
            color: #808080;
            font-size: 20px;
            margin-top: 10px;
          }
        }
        .followed, .follow {
          width: 110px;
          height: 40px;
          flex-shrink: 0;
          text-align: center;
          border-radius: 50PX;
          font-size: 19px;
          line-height: 40px;
          margin-left: 20px;
        }
        .followed {
          color: #808080;
          border: 1.5px solid rgba(128, 128, 128, 0.5);
        }
        .follow {
          color: #ff3939;
          border: 1.5px solid #ff3939;
        }
      }
    }
  }
}
</style>
