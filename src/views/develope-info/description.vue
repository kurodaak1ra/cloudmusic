<template>
  <div class="description-page web-page">
    <div class="nav">
      <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
      <span>项目说明</span>
    </div>
    <ul>
      <li>这是一个非官方的，前端基于 Vue，后端基于 node.js ( <a href="https://github.com/Binaryify/NeteaseCloudMusicApi"><b>NeteaseCloudMusicApi</b></a> 项目，大部分 API 由 <a href="https://github.com/nondanee/UnblockNeteaseMusic"><b>UnblockNeteaseMusic</b></a> 项目抓取 eapi 自行定制化而成，所以直接用 NeteaseCloudMusicApi 项目跑不起来)，开发的移动端网易云音乐 Web App 项目，请尽量使用手机访问</li>
      <li><span>本项目为非盈利项目，且禁止用于以盈利为目的的行为</span>，且仅追求极致复刻，并不追求性能（因为我太菜了），所以，配置差的手机会卡，目前功能有限，更多功能后续慢慢增加</li>
      <li>本项目还可以进行注册、登录操作，<span>但：如您觉的本项目不安全，或觉得有窃取您账号密码的骚操作，请不要登录</span></li>
      <li>界面 UI 参考安卓版 <s>v5.9.1.239129</s> v6.0客户端，内部小图标全部使用 AI 自行绘制的 svg 制成的 iconfont，为了您有更好的使用体验，请使用移动端 Chrome、Firefox 等浏览器，拒绝国产垃圾浏览器，从你我做起（Chrome：不是我针对谁，我是说在座各位都是垃圾），您还可以<span>三击屏幕任何地方进行全屏显示（IOS 用户请无视）</span></li>
      <li><span>当更新版本后发现功能不正常请清理缓存！！！</span></li>
      <br>
      <br>
      <li>开发日期：2019-02-25 09：58</li>
      <li>开发者：黒田  明</li>
      <li>GitHub：<a href="https://github.com/kurodaakira-jp">kurodaakira-jp</a></li>
      <li>邮箱：kurodaakira@163.com</li>
    </ul>
  </div>
</template>

<style lang="scss">
.description-page {
  overflow: auto;
  .nav {
    height: 90px;
    font-size: 30px;
    line-height: 90px;
    padding: 0 28px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    background: #fff;
    .back-icon {
      font-size: 35px;
      margin-right: 30px;
    }
  }
  ul {
    padding: 90px 1.5em 1.5em;
    text-indent: 2em;
    li {
      font-size: 28px;
      line-height: 2em;
      text-align: justify;
      span {
        color: #dd4137;
        font-weight: bold;
      }
      s {
        text-decoration: line-through;
      }
    }
  }
}
</style>