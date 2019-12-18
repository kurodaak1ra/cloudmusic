<template>
  <div class="digital-album-page web-page">
    <div class="nav">
      <div class="left">
        <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
        <span>我的收藏</span>
      </div>
      <div class="right">兑换</div>
    </div>
    <ul class="main">
      <li v-for="(i, index) in data" :key="index" @click="goAlbum(i.albumId, i.albumName)">
        <div class="cover">
          <div :style="{ backgroundImage: `url(${i.cover}?imageView=1&thumbnail=290x0)` }"></div>
          <img src="../assets/img/collect/digital-album.svg" alt="">
        </div>
        <div class="info">
          <p>{{i.albumName}}</p>
          <p>{{i.artist.name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { digitalAlbumPurchasedApi } from '../utils/api'
import { goAlbum } from '../utils/function'

export default {
  name: 'digital-album',
  data() {
    return {
      goAlbum,
      data: {}
    }
  },
  created() {
    this.digitalAlbum()
  },
  methods: {
    ...mapMutations([
      'SET_PAGE_DATA'
    ]),

    // 获取数据
    digitalAlbum() {
      digitalAlbumPurchasedApi().then(succ => {
        console.log('获取我的数字专辑（success）：', succ)
        this.data = succ.paidAlbums
      }).catch(err => {
        console.warn('获取我的数字专辑（error）：', err)
      })
    }
  }
}
</script>

<style lang="scss">
.digital-album-page {
  .nav {
    height: 90px;
    font-size: 30px;
    padding: 0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      .back-icon {
        font-size: 35px;
        margin-right: 30px;
      }
    }
    .right {
      font-size: 25px;
    }
  }
  .main {
    padding: 35px 28px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    li {
      margin-bottom: 35px;
      .cover {
        display: flex;
        align-items: center;
        div {
          width: 290px;
          height: 290px;
          border-radius: 10px;
          background: no-repeat center center / cover;
        }
        img {
          width: unset;
          height: 280px;
        }
      }
      .info {
        p:first-child {
          line-height: 3em;
        }
        p:last-child {
          color: #969696;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
