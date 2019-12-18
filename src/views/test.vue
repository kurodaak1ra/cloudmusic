<template>
  <div class="test web-page">
    <button @click="download(src)">跨域下载</button>
    <img :src="src" alt="图片无法显示">
  </div>
</template>

<script>
import { download } from '../utils/tools'

export default {
  name: 'test',
  data() {
    return {
      download,
      link: 'http://p1.music.126.net/jNhg3v8ayCzL_k470qQyvQ==/3424978721550752.jpg',
      src: ''
    }
  },
  created() {
    this.imgToBlob(this.link)
  },
  methods: {
    imgToBlob(url, dlCall) {
      let img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.src = url
      img.onload = () => {
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)
        canvas.toBlob((blob) => {
          let url = URL.createObjectURL(blob)
          this.src = url
          // URL.revokeObjectURL(url)
        })
      }
    }
  }
}
</script>

<style lang="scss">
.test {
  button {
    color: #fff;
    display: block;
    width: 10em;
    line-height: 3em;
    margin: 100px auto;
    border-radius: 10px;
    background: #000;
  }
}
</style>