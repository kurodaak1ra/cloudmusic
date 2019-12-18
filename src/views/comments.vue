<template>
  <div class="comments-page web-page">
    <div class="title">
      <div>
        <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
        <span>{{titleText}}</span>
        <span v-if="total !== 0">({{total}})</span>
      </div>
      <span v-if="innerPage !== 1" class="share" @click="shareImg()">&#xe674;</span>
      <div v-if="innerPage === 1 && reply.owner !== null && !reply.owner.user.liked" class="follow">
        <div class="cover" :style="{ backgroundImage: `url(${reply.owner.user.avatarUrl}?imageView=1&thumbnail=45x0)` }" @click="goUser(reply.owner.user.userId)"></div>
        <span @click="follow()">关注</span>
      </div>
    </div>
    <!-- 一级回复 -->
    <scroll v-if="innerPage === 0" ref="firstScroll" class="in" :up="firstScrollUp()">
      <div v-if="normal.total !== 0 || !normal.more" class="head" @click="$router.go(-1)">
        <div class="cover" :style="{ backgroundImage: `url(${getGLOBAL('comments').coverUrl})` }"></div>
        <div>
          <div>
            <p class="two-line-ellipsis">{{getGLOBAL('comments').title}}</p>
            <p @click.stop="goUser(getGLOBAL('comments').uid)"><span v-if="getGLOBAL('comments').type === 2">by </span><span class="author">{{getGLOBAL('comments').author}}</span></p>
          </div>
          <span>&#xe624;</span>
        </div>
      </div>
      <div v-if="normal.total !== 0 || !normal.more" class="line"></div>
      <p v-if="normal.hotComments.length !== 0" class="text">精彩评论</p>
      <ul v-if="normal.hotComments.length !== 0" class="hot-comments">
        <li v-for="(i, index) in normal.hotComments" :key="index" @click="firstWinShow(i.commentId, i.user, i.content)">
          <div>
            <div class="avatar" :style="{ backgroundImage: `url(${i.pendantData === null ? '' : i.pendantData.imageUrl}?imageView=1&thumbnail=55x0)` }" @click.stop="goUser(i.user.userId)">
              <div :style="{ backgroundImage: `url(${i.user.avatarUrl}?imageView=1&thumbnail=55x0)` }"></div>
            </div>
            <div class="info">
              <div>
                <div class="nickname">
                  <span>{{i.user.nickname}}</span>
                  <span v-if="i.user.userId === creatorId" class="creator">作者</span>
                  <span v-if="i.user.locationInfo !== null" class="onaji-city">{{i.user.locationInfo}}</span>
                  <img v-if="i.user.vipType === 11 && i.user.userType === 0" src="../assets/img/comments/1.svg" alt="">
                  <img v-if="i.user.vipType === 11 && i.user.userType === 4" src="../assets/img/comments/2.svg" alt="">
                  <img v-if="i.user.vipType === 10" src="../assets/img/comments/3.svg" alt="">
                </div>
                <p>{{sendTimeConversion(i.time)}}</p>
              </div>
              <div :style="{ color: i.liked ? '#dd4137' : '#949494' }" @click.stop="like('hotComments', index, i.commentId, i.liked)">
                <p>{{i.likedCount}}</p>
                <p>&nbsp;&#xe662;</p>
              </div>
            </div>
          </div>
          <div>
            <p v-for="(j, index) in i.content.split('\n')" :key="index">{{j === '' ? '&nbsp;' : j}}</p>
            <div v-if="i.beReplied.length !== 0">
              <span @click.stop="goUser(i.beReplied[0].user.userId)">@{{i.beReplied[0].user.nickname}}</span>：
              <span v-if="i.beReplied[0].content === null">该评论已删除</span>
              <template v-else>
                <span v-for="(j, index) in i.beReplied[0].content.split('\n')" :key="index">{{j === '' ? '&nbsp;' : j}}</span>
              </template>
            </div>
            <span v-if="i.showFloorComment.comments !== null || i.showFloorComment.replyCount !== 0" class="reply" @click.stop="moreComments(i.commentId, i.showFloorComment.replyCount)">{{i.showFloorComment.replyCount}}条回复 &#xe624;</span>
          </div>
        </li>
        <div v-if="normal.moreHot" class="more-hot" @click="getMoreHot()">
          <span>全部精彩评论</span>
          <span>&#xe624;</span>
        </div>
      </ul>
      <p v-if="normal.comments.length !== 0 || !normal.more" class="text">最新评论 <span>{{total}}</span></p>
      <ul id="comments-list" class="comments-style">
        <li v-for="(i, index) in normal.comments" :key="index" @click="firstWinShow(i.commentId, i.user, i.content)">
          <div>
            <div class="avatar" :style="{ backgroundImage: `url(${i.pendantData === null ? '' : i.pendantData.imageUrl}?imageView=1&thumbnail=40x0)` }" @click.stop="goUser(i.user.userId)">
              <div :style="{ backgroundImage: `url(${i.user.avatarUrl}?imageView=1&thumbnail=30x0)` }"></div>
            </div>
            <div class="info">
              <div>
                <div class="nickname">
                  <span>{{i.user.nickname}}</span>
                  <span v-if="i.user.userId === creatorId" class="creator">作者</span>
                  <span v-if="i.user.locationInfo !== null" class="onaji-city">{{i.user.locationInfo}}</span>
                  <img v-if="i.user.vipType === 11 && i.user.userType === 0" src="../assets/img/comments/1.svg" alt="">
                  <img v-if="i.user.vipType === 11 && i.user.userType === 4" src="../assets/img/comments/2.svg" alt="">
                  <img v-if="i.user.vipType === 10" src="../assets/img/comments/3.svg" alt="">
                </div>
                <p>{{sendTimeConversion(i.time)}}</p>
              </div>
              <div :style="{ color: i.liked ? '#dd4137' : '#818181' }" @click.stop="like('comments', index, i.commentId, i.liked)">
                <p>{{i.likedCount === 0 ? '' : i.likedCount}}</p>
                <p>&nbsp;&#xe662;</p>
              </div>
            </div>
          </div>
          <div>
            <p v-for="(j, index) in i.content.split('\n')" :key="index">{{j === '' ? '&nbsp;' : j}}</p>
            <div v-if="i.beReplied.length !== 0">
              <span @click.stop="goUser(i.beReplied[0].user.userId)">@{{i.beReplied[0].user.nickname}}</span>：
              <span v-if="i.beReplied[0].content === null">该评论已删除</span>
              <template v-else>
                <span v-for="(j, index) in i.beReplied[0].content.split('\n')" :key="index">{{j === '' ? '&nbsp;' : j}}</span>
              </template>
            </div>
            <span v-if="i.showFloorComment.comments !== null || i.showFloorComment.replyCount !== 0" class="reply" @click.stop="moreComments(i.commentId, i.showFloorComment.replyCount)">{{i.showFloorComment.replyCount}}条回复 &#xe624;</span>
          </div>
        </li>
      </ul>
    </scroll>
    <!-- 二级回复 -->
    <scroll v-else-if="innerPage === 1" ref="secScroll" class="in" :up="secScrollUp()">
      <ul v-if="reply.owner !== null" class="comments">
        <li>
          <div>
            <div class="avatar" :style="{ backgroundImage: `url(${reply.owner.pendantData === null ? '' : reply.owner.pendantData.imageUrl}?imageView=1&thumbnail=55x0)` }" @click.stop="goUser(reply.owner.user.userId)">
              <div :style="{ backgroundImage: `url(${reply.owner.user.avatarUrl}?imageView=1&thumbnail=55x0)` }"></div>
            </div>
            <div class="info">
              <div>
                <div class="nickname">
                  <span>{{reply.owner.user.nickname}}</span>
                  <span v-if="reply.owner.user.userId === creatorId" class="creator">作者</span>
                  <span v-if="reply.owner.user.locationInfo !== null" class="onaji-city">{{reply.owner.user.locationInfo}}</span>
                  <img v-if="reply.owner.user.vipType === 11 && reply.owner.user.userType === 0" src="../assets/img/comments/1.svg" alt="">
                  <img v-if="reply.owner.user.vipType === 11 && reply.owner.user.userType === 4" src="../assets/img/comments/2.svg" alt="">
                  <img v-if="reply.owner.user.vipType === 10" src="../assets/img/comments/3.svg" alt="">
                </div>
                <p>{{sendTimeConversion(reply.owner.time)}}</p>
              </div>
              <div :style="{ color: reply.owner.liked ? '#dd4137' : '#949494' }" @click.stop="like('hotComments', index, reply.owner.commentId, reply.owner.liked)">
                <p>{{reply.owner.likedCount}}</p>
                <p>&nbsp;&#xe662;</p>
              </div>
            </div>
          </div>
          <div>
            <p v-for="(i, index) in reply.owner.content.split('\n')" :key="index">{{i === '' ? '&nbsp;' : i}}</p>
          </div>
        </li>
      </ul>
      <p class="text">全部回复</p>
      <ul class="comments-style">
        <li v-for="(i, index) in reply.comments" :key="index" @click="firstWinShow(i.commentId, i.user, i.content)">
          <div>
            <div class="avatar" :style="{ backgroundImage: `url(${i.pendantData === null ? '' : i.pendantData.imageUrl}?imageView=1&thumbnail=55x0)` }" @click.stop="goUser(i.user.userId)">
              <div :style="{ backgroundImage: `url(${i.user.avatarUrl}?imageView=1&thumbnail=55x0)` }"></div>
            </div>
            <div class="info">
              <div>
                <div class="nickname">
                  <span>{{i.user.nickname}}</span>
                  <span v-if="i.user.userId === creatorId" class="creator">作者</span>
                  <span v-if="i.user.locationInfo !== null" class="onaji-city">{{i.user.locationInfo}}</span>
                  <img v-if="i.user.vipType === 11 && i.user.userType === 0" src="../assets/img/comments/1.svg" alt="">
                  <img v-if="i.user.vipType === 11 && i.user.userType === 4" src="../assets/img/comments/2.svg" alt="">
                  <img v-if="i.user.vipType === 10" src="../assets/img/comments/3.svg" alt="">
                </div>
                <p>{{sendTimeConversion(i.time)}}</p>
              </div>
              <div :style="{ color: i.liked ? '#dd4137' : '#949494' }" @click.stop="like('hotComments', index, i.commentId, i.liked)">
                <p>{{i.likedCount}}</p>
                <p>&nbsp;&#xe662;</p>
              </div>
            </div>
          </div>
          <div>
            <p v-for="(j, index) in i.content.split('\n')" :key="index">{{j === '' ? '&nbsp;' : j}}</p>
            <div v-if="i.beReplied.length !== 0 && reply.owner.commentId !== i.beReplied[0].beRepliedCommentId">
              <span @click.stop="goUser(i.beReplied[0].user.userId)">@{{i.beReplied[0].user.nickname}}</span>：
              <span v-if="i.beReplied[0].content === null">该评论已删除</span>
              <template v-else>
                <span v-for="(j, index) in i.beReplied[0].content.split('\n')" :key="index">{{j === '' ? '&nbsp;' : j}}</span>
              </template>
            </div>
          </div>
        </li>
      </ul>
    </scroll>
    <!-- 更多热门回复 -->
    <scroll v-else-if="innerPage === 2" ref="secScroll" class="in" :up="thirdScrollUp()">
      <ul class="comments-style">
        <li v-for="(i, index) in hotComments" :key="index" @click="firstWinShow(i.commentId, i.user, i.content)">
          <div>
            <div class="avatar" :style="{ backgroundImage: `url(${i.pendantData === null ? '' : i.pendantData.imageUrl}?imageView=1&thumbnail=40x0)` }" @click.stop="goUser(i.user.userId)">
              <div :style="{ backgroundImage: `url(${i.user.avatarUrl}?imageView=1&thumbnail=30x0)` }"></div>
            </div>
            <div class="info">
              <div>
                <div class="nickname">
                  <span>{{i.user.nickname}}</span>
                  <span v-if="i.user.userId === creatorId" class="creator">作者</span>
                  <span v-if="i.user.locationInfo !== null" class="onaji-city">{{i.user.locationInfo}}</span>
                  <img v-if="i.user.vipType === 11 && i.user.userType === 0" src="../assets/img/comments/1.svg" alt="">
                  <img v-if="i.user.vipType === 11 && i.user.userType === 4" src="../assets/img/comments/2.svg" alt="">
                  <img v-if="i.user.vipType === 10" src="../assets/img/comments/3.svg" alt="">
                </div>
                <p>{{sendTimeConversion(i.time)}}</p>
              </div>
              <div :style="{ color: i.liked ? '#dd4137' : '#818181' }" @click.stop="like('comments', index, i.commentId, i.liked)">
                <p>{{i.likedCount === 0 ? '' : i.likedCount}}</p>
                <p>&nbsp;&#xe662;</p>
              </div>
            </div>
          </div>
          <div>
            <p v-for="(j, index) in i.content.split('\n')" :key="index">{{j === '' ? '&nbsp;' : j}}</p>
            <div v-if="i.beReplied.length !== 0">
              <span @click.stop="goUser(i.beReplied[0].user.userId)">@{{i.beReplied[0].user.nickname}}</span>：
              <span v-if="i.beReplied[0].content === null">该评论已删除</span>
              <template v-else>
                <span v-for="(j, index) in i.beReplied[0].content.split('\n')" :key="index">{{j === '' ? '&nbsp;' : j}}</span>
              </template>
            </div>
            <span v-if="i.showFloorComment.comments !== null || i.showFloorComment.replyCount !== 0" class="reply" @click.stop="moreComments(i.commentId, i.showFloorComment.replyCount)">{{i.showFloorComment.replyCount}}条回复 &#xe624;</span>
          </div>
        </li>
      </ul>
    </scroll>
    <!-- 发送评论 -->
    <div v-if="inputBar" class="send">
      <input ref="input" v-model="inputText" type="text" :placeholder="inputPlaceholder" @blur="blur()">
      <button :style="{ color: inputText === '' ? '#ccc' : '#333' }" @click="sendComment()">发送</button>
    </div>
    <!-- 评论分享 -->
    <div v-if="sharePage" class="share-img">
      <div class="close" @click="sharePage = false">
        <img src="../assets/img/comments/close.svg" alt="">
      </div>
      <div ref="shareImg" class="inner" :style="{ backgroundImage: `url(${shareBg})` }">
        <p>网易云音乐·歌单评论分享</p>
        <div class="img-comments-list">
          <div class="img-title">
            <div class="img-cover" :style="{ backgroundImage: `url(${getGLOBAL('comments').coverUrl})` }"></div>
            <div class="img-info">
              <p class="one-line-ellipsis">{{getGLOBAL('comments').title}}</p>
              <p class="one-line-ellipsis">by {{getGLOBAL('comments').author}}</p>
            </div>
          </div>
          <p class="total">共{{total}}条精彩评论</p>
          <ul class="hot-comments" style="border: none;padding-bottom: 0.5em;">
            <li v-for="(i, index) in imgShareArr" :key="index">
              <div>
                <div class="avatar" :style="{ backgroundImage: `url(${i.pendantData === null ? '' : i.pendantData.imageUrl}?imageView=1&thumbnail=40x0)` }">
                  <div :style="{ backgroundImage: `url(${i.user.avatarUrl}?imageView=1&thumbnail=30x0)` }"></div>
                </div>
                <div class="info">
                  <div>
                    <div class="nickname">
                      <span>{{i.user.nickname}}</span>
                      <img v-if="i.user.vipType === 11 && i.user.userType === 0" src="../assets/img/comments/png/1.png" alt="">
                      <img v-if="i.user.vipType === 11 && i.user.userType === 4" src="../assets/img/comments/png/2.png" alt="">
                      <img v-if="i.user.vipType === 10" src="../assets/img/comments/png/3.png" alt="">
                    </div>
                    <p>{{sendTimeConversion(i.time)}}</p>
                  </div>
                  <div :style="{ color: i.liked ? '#dd4137' : '#818181' }">
                    <p>{{i.likedCount === 0 ? '' : i.likedCount}}</p>
                    <p>&nbsp;&#xe662;</p>
                  </div>
                </div>
              </div>
              <div>
                <p v-for="(j, index) in i.content.split('\n')" :key="index">{{j === '' ? '&nbsp;' : j}}</p>
                <div v-if="i.beReplied.length !== 0">
                  <span>@{{i.beReplied[0].user.nickname}}</span>：
                  <span v-if="i.beReplied[0].content === null">该评论已删除</span>
                  <template v-else>
                    <span v-for="(j, index) in i.beReplied[0].content.split('\n')" :key="index">{{j === '' ? '&nbsp;' : j}}</span>
                  </template>
                </div>
                <p v-if="i.showFloorComment.comments !== null || i.showFloorComment.replyCount !== 0" class="reply" style="color: #999;">{{i.showFloorComment.replyCount}}条回复</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="qr">
          <vue-qr :logoSrc="commentOne.logo" :logoScale="0.275" :correctLevel="2" :margin="0" :text="commentOne.link" :size="300" :dotScale="1"></vue-qr>
          <p>长按识别可在网易云音乐播放</p>
        </div>
      </div>
      <div class="btns ">
        <p>分享</p>
        <ul class="no-scroll-bar">
          <li @click="shareBtn('fg')">
            <img src="../assets/img/comments/fg.png" alt="">
            <p>微信朋友圈</p>
          </li>
          <li @click="shareBtn('wx')">
            <img src="../assets/img/comments/wx.png" alt="">
            <p>微信好友</p>
          </li>
          <li @click="shareBtn('qz')">
            <img src="../assets/img/comments/qz.png" alt="">
            <p>QQ空间</p>
          </li>
          <li @click="shareBtn('qq')">
            <img src="../assets/img/comments/qq.png" alt="">
            <p>QQ好友</p>
          </li>
          <li @click="shareBtn('wb')">
            <img src="../assets/img/comments/wb.png" alt="">
            <p>微博</p>
          </li>
          <li @click="shareBtn('ds')">
            <img src="../assets/img/comments/ds.png" alt="">
            <p>大神圈子</p>
          </li>
          <li @click="shareBtn('df')">
            <img src="../assets/img/comments/df.png" alt="">
            <p>大神好友</p>
          </li>
          <li @click="shareBtn('yf')">
            <img src="../assets/img/comments/wx.png" alt="">
            <p>易信朋友圈</p>
          </li>
          <li @click="shareBtn('yx')">
            <img src="../assets/img/comments/yx.png" alt="">
            <p>易信好友</p>
          </li>
          <li @click="shareBtn('save')">
            <img src="../assets/img/comments/save.png" alt="">
            <p>本地保存</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 一级弹窗 -->
    <div v-if="firstWin" ref="firstWin" class="first-win win-show" @click="winHide()">
      <div>
        <div class="inner">
          <p class="reply" @click="commentsReplyClick()">回复评论</p>
          <p v-clipboard:copy="commentOne.share" v-clipboard:success="shareCopySucc" v-clipboard:error="shareCopyErr" class="share">分享评论</p>
          <p v-clipboard:copy="commentOne.content" v-clipboard:success="shareCopySucc" v-clipboard:error="shareCopyErr" class="copy">复制评论</p>
          <p v-if="commentOne.uid === getGLOBAL('userInfo').uid" class="delete" @click="delComments()">删除评论</p>
          <p v-else class="taiho" @click.stop="firstWin = false;secWin = true">举报评论</p>
        </div>
      </div>
    </div>
    <!-- 二级弹窗 -->
    <div v-if="secWin" ref="secWin" class="sec-win win-show" @click="winHide()">
      <div>
        <div class="inner">
          <span>举报原因</span>
          <p @click="report('段子或无意义的评论')">段子或无意义的评论</p>
          <p @click="report('恶意攻击谩骂')">恶意攻击谩骂</p>
          <p @click="report('营销广告')">营销广告</p>
          <p @click="report('淫秽色请')">淫秽色请</p>
          <p @click="report('政治反动')">政治反动</p>
          <p @click="report('其他原因')">其他原因</p>
          <span>评论区规则&#xe624;&#xe624;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQr from 'vue-qr'
import scroll from './plugins/scroll'
import html2canvas from 'html2canvas'
import { mapMutations } from 'vuex'
import { imgToBlob, download, sendTimeConversion } from '../utils/tools'
import { getGLOBAL } from '../utils/store'
import { batchApi, reportApi, commentApi, commentReplyApi, commentHotApi, commentDelApi, commentLikeApi, followApi } from '../utils/api'
import { goUser, goArtist, goLogin } from '../utils/function'

export default {
  name: 'comments',
  inject: ['reload'],
  components: { VueQr, scroll },
  data() {
    return {
      // 方法
      getGLOBAL,
      sendTimeConversion,
      // 数据
      inputText: '',
      inputPlaceholder: '千头万绪，落笔汇成评论一句',
      total: 0,
      titleText: '评论',
      offset: 0,
      firstWin: false,
      secWin: false,
      sharePage: false,
      innerPage: 0,   // 0: 主评论  1: 二级评论  2: 更多热门评论
      shareBg: '',
      commentType: 'normal',
      creatorId: null,
      inputBar: true,
      placeholder: true,
      // 被点击的单条评论
      commentOne: {
        id: null,
        uid: null,
        nickname: '',
        content: '',
        share: '',
        logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURf///////////////////////////0xpcf///////////wAAAP///xEREVZWVvj4+CUlJUFBQQsLCxgYGOHh4UtLSwQEBP39/b+/v5ubm9TU1O7u7oWFhTc3N2ZmZrCwsHx8fC4uLvPz829vb+fn58TExM3NzWBgYLy8vI6Ojre3t6ioqOs74IgAAAALdFJOU+5EQRrcprsA8x2/gJkebAAAArVJREFUSMell+miazAQgJ21p0dI7FutbSnn/d/vZhIiLbFc8wNVn2T2oZ2YvH1rm+X7jTMaHM5faJd8nQf0/Il2yueZo/tJzmqnD04+LGOTWA/OflCU6ema+mYxXabvSXuH843oO4TcgHnXfuFk6rvEBOZX+6HHcPlJf3InpNAPQ60FzorqOCxeFLIEaqsXbANm0Kp9esYWqKFEI+HJXN62sYD6XubQkydFQTlBtRnUz2KEYsrm4PLGKqgnb84Lqs2haYi4x2yKBB54MsqfTKlCm4pbhuhGQtFyxgQK9MLAoINl7vTquhnlZJeKH/lW1AQ/4mEli/66NamzBSWgZ+X1jm94gqFb7q2jHazZJ4MZS159lCsoC4GiVzp4qguJuYyCQ+++ZC7uJnbEzRJaBn0I0PXZmnlDPYsyi8UINhfQgl7X3EKgJ8648q3uXzAPEiUaCk2Z0pn0tgbYTomyuEtFst1ZPNONY9K/Q9SECQqqJo5Yn8UFZAArXT4EZaRCYZcxt28tat3fQDSQgLYCNYddymg23HTA2Ok6Coa9PKNMiUaBpuOWwCisLkgq5mMGTlBCHYC5mUrwxT01Ungeeasos6Ynl8KExVQfml3v6tmQyFnoMHHGtKl40vjx2GGmaCbZn9Q9GVuSOkSFOpVUi+xrjQNcF8OfVwhJX5l0oKEryolPSiJqvuEKf82izLB/sy2kReN+ZwsMPCDe/dRSsRTCs6gBZgyKCelVSO4ds8U0hbej6KWVXOFuYK6UcLYz5GZSP/V4Tb2sNg7OIrc1iWM4xLv0Dm43tCtrCCScJAkeQuo6rcMzrdmJ8Ot09kgn1V/R1dMokbjgYc70HOUYQrK/uKKBWLldMe2w9srwYzs0EJ3Z6WYcfkJ9p/CR68Cgd2C8PDDUHhmlDwzwRz4bjnys/Ocn0j+Up6NDIQgU1AAAAABJRU5ErkJggg==',
        link: `https://m.music.163.com/m/applink/?scheme=orpheus://${{ 0: 'song', 1: 'mv', 2: 'playlist', 3: 'album', 4: 'dj', 5: 'video', 6: 'A_EV_2_' }[getGLOBAL('comments').type]}/${getGLOBAL('comments').id}&go=1&res=1`,
        blob: ''
      },
      // 回复
      normal: {
        more: true,
        total: 0,
        moreHot: true,
        comments: [],
        hotComments: []
      },
      // 回复的回复
      reply: {
        owner: null,
        comments: [],
        currentComment: null
      },
      // 更多热评
      hotComments: []
    }
  },
  computed: {
    imgShareArr() {
      let finalArr = []
      if (this.normal.hotComments.length !== 0) {
        if (this.normal.hotComments.length >= 15) {
          finalArr = this.normal.hotComments.splice(0, 15)
        } else {
          finalArr = finalArr.concat(this.normal.hotComments)
          for (let i = 0; i < (15 - this.normal.hotComments.length); i++) {
            finalArr.push(this.normal.comments[i])
          }
        }
      } else {
        finalArr = this.normal.comments.splice(0, 15)
      }
      console.log('二维码链接：', this.commentOne.link)
      return finalArr
    }
  },
  watch: {
    'commentOne.uid'(newer, older) {
      this.commentOne.share = `分享评论: http://music.163.com/playlist/${getGLOBAL('comments').id}/${this.commentOne.uid}/?userid=${this.commentOne.uid} (来自@网易云音乐 by KA) `
    }
  },
  methods: {
    ...mapMutations([
      'SET_WINDOWS',
      'SET_PAGE_DATA'
    ]),

    // blur
    blur() {
      if (this.inputText !== '') return
      if (this.innerPage === 2) this.inputBar = false
      this.commentType = 'normal'
      this.inputPlaceholder = '千头万绪，落笔汇成评论一句'
    },

    // 一级 scroll
    firstScrollUp() {
      return {
        auto: true,
        empty: '暂无评论，欢迎抢沙发',
        placeholder: true,
        callback: () => { this.getComments() }
      }
    },

    // 二级 scroll
    secScrollUp() {
      return {
        auto: true,
        placeholder: true,
        callback: () => { this.getFloor() }
      }
    },

    // 三级 scroll
    thirdScrollUp() {
      return {
        auto: true,
        placeholder: false,
        callback: () => { this.getMoreHot() }
      }
    },

    // copy
    shareCopySucc() {
      this.$toast('复制成功')
    },
    shareCopyErr() {
      this.$toast('复制失败')
    },

    // 跳用户
    goUser(id) {
      this.innerPage = 0
      this.firstWin = false
      this.secWin = false
      this.sharePage = false
      if (getGLOBAL('comments').type === 2) {
        goUser(id)
      } else if (getGLOBAL('comments').type === 0 || getGLOBAL('comments').type === 3) {
        goArtist(id)
      }
    },

    // 一级弹窗
    firstWinShow(id, user, content) {
      this.$mask()
      this.firstWin = true
      this.commentOne.id = id
      this.commentOne.uid = user.userId
      this.commentOne.nickname = user.nickname
      this.commentOne.content = content
    },
    winHide() {
      if (this.firstWin) {
        this.$refs.firstWin.classList.remove('win-show')
        this.$refs.firstWin.classList.add('win-hide')
      } else if (this.secWin) {
        this.$refs.secWin.classList.remove('win-show')
        this.$refs.secWin.classList.add('win-hide')
      }
      this.$rmask()
      setTimeout(() => {
        this.firstWin = false
        this.secWin = false
      }, 190)
    },

    // share canvas
    shareImg() {
      this.sharePage = true
      imgToBlob(getGLOBAL('comments').coverUrl, res => { this.shareBg = res }, 200, -0.25)
      // return
      setTimeout(() => {
        html2canvas(this.$refs.shareImg, {
          useCORS: true,
          logging: false,
          scale: 2
        }).then(cvs => {
          this.$refs.shareImg.innerHTML = ''
          this.$refs.shareImg.style = ''
          this.$refs.shareImg.style.padding = '0'
          this.$refs.shareImg.appendChild(cvs)
          let i = document.createElement('i')
          this.$refs.shareImg.appendChild(i)
          cvs.toBlob(blob => { this.commentOne.blob = URL.createObjectURL(blob) })
        })
      }, 1000)
    },

    // 获取评论
    getComments() {
      batchApi({
        batch: 'resource-comments',
        type: getGLOBAL('comments').type,
        coid: getGLOBAL('comments').id,
        limit: 30,
        offset: this.offset
      }).then(succ => {
        let type = {
          0: 'R_SO_4_',   //  歌曲
          1: 'R_MV_5_',   //  MV
          2: 'A_PL_0_',   //  歌单
          3: 'R_AL_3_',   //  专辑
          4: 'A_DJ_1_',   //  电台
          5: 'R_VI_62_',  //  视频
          6: 'A_EV_2_'    //  动态
        }[getGLOBAL('comments').type]
        console.log('评论（success）：', succ[`/api/v1/resource/comments/${type + getGLOBAL('comments').id}`])
        this.normal.total = succ[`/api/v1/resource/comments/${type + getGLOBAL('comments').id}`].total
        // 热评
        if (this.offset === 0) {
          this.normal.moreHot = succ[`/api/v1/resource/comments/${type + getGLOBAL('comments').id}`].moreHot
          this.normal.hotComments = this.normal.hotComments.concat(succ[`/api/v1/resource/comments/${type + getGLOBAL('comments').id}`].hotComments)
        }
        // 评论
        this.normal.more = succ[`/api/v1/resource/comments/${type + getGLOBAL('comments').id}`].more
        this.normal.comments = this.normal.comments.concat(succ[`/api/v1/resource/comments/${type + getGLOBAL('comments').id}`].comments)
        this.offset += 30
        // 顶部评论总量
        this.total = this.normal.total
        // 隐藏loading
        this.$refs.firstScroll.upEndSucc({ more: succ[`/api/v1/resource/comments/${type + getGLOBAL('comments').id}`].more, empty: this.normal.comments.length === 0 ? true : false })
      }).catch(err => {
        console.warn('歌单评论（error）：', err)
        this.$refs.firstScroll.upEndErr()
      })
    },

    // 获取评论的评论
    getFloor() {
      batchApi({
        batch: 'comment-floor',
        id: this.commentOne.id,
        coid: getGLOBAL('comments').id,
        type: getGLOBAL('comments').type,
        limit: 30,
        offset: this.offset
      }).then(succ => {
        console.log('评论的评论（success）：', succ['/api/resource/comment/floor/get'])
        this.reply = {
          owner: succ['/api/resource/comment/floor/get'].data.ownerComment,
          comments: this.reply.comments.concat(succ['/api/resource/comment/floor/get'].data.comments),
          currentComment: succ['/api/resource/comment/floor/get'].data.currentComment
        }
        this.offset += 30
        // 隐藏loading
        setTimeout(() => { this.$refs.secScroll.upEndSucc({ more: this.reply.comments.length >= succ['/api/resource/comment/floor/get'].data.totalCount ? false : true }) })
      }).catch(err => {
        console.warn('评论的评论（error）：', err)
        this.$refs.secScroll.upEndErr()
      })
    },

    // 更多热门评论
    getMoreHot() {
      this.offset = 0
      this.innerPage = 2
      this.titleText = '精彩评论'
      this.total = 0
      this.inputBar = false
      commentHotApi({
        id: getGLOBAL('comments').id,
        type: getGLOBAL('comments').type,
        limit: 30,
        offset: this.offset
      }).then(succ => {
        console.log('更多热评（success）：', succ)
        this.total = succ.total
        this.hotComments = this.hotComments.concat(succ.hotComments)
        this.offset += 30
        // 隐藏loading
        this.$refs.secScroll.upEndSucc({ more: succ.hasMore })
      }).catch(err => {
        console.warn('更多热评（error）：', err)
        this.$refs.secScroll.upEndErr()
      })
    },

    // 发送评论
    sendComment() {
      if (this.inputText.trim() === '') return
      if (!getGLOBAL('isLogin')) {
        this.$router.push('/login')
        return
      }
      if (this.commentType === 'normal') {
        if (this.innerPage === 0) {
          this.commentsNormal()
        } else {
          this.commentsReply()
        }
      } else if (this.commentType === 'reply') {
        this.commentsReply()
      }
    },

    // 更多评论
    moreComments(id, total) {
      this.offset = 0
      this.innerPage = 1
      this.commentOne.id = id
      this.titleText = '回复'
      this.total = total
      // 清空上次数据
      this.reply = {
        total: 0,
        owner: null,
        comments: [],
        currentComment: null
      }
      this.getFloor()
    },

    // 点赞
    like(target, index, cid, like) {
      commentLikeApi({
        t: like ? 0 : 1,
        id: getGLOBAL('comments').id,
        cid: cid,
        type: getGLOBAL('comments').type
      }).then(succ => {
        console.log('点赞（success）：', succ)
        let tempObj = target === 'comments' ? this.normal.comments : this.normal.hotComments
        tempObj[index].liked = !tempObj[index].liked
        if (like) {
          tempObj[index].likedCount = tempObj[index].likedCount - 1
        } else {
          tempObj[index].likedCount = tempObj[index].likedCount + 1
        }
        if (target === 'comments') {
          this.normal.comments = tempObj
        } else if (target === 'hotComments') {
          this.normal.hotComments = tempObj
        }
      }).catch(err => {
        console.warn('点赞（error）：', err)
      })
    },

    // 回复点击
    commentsReplyClick() {
      this.inputBar = true
      this.commentType = 'reply'
      this.inputPlaceholder = `回复 ${this.commentOne.nickname}：`
      setTimeout(() => { this.$refs.input.focus() })
    },

    // 普通评论
    commentsNormal() {
      commentApi({
        t: 1,
        id: getGLOBAL('comments').id,
        type: getGLOBAL('comments').type,
        content: this.inputText.trim()
      }).then(succ => {
        console.log('评论（success）：', succ)
        this.$toast('发表成功')
        // 页面重载
        setTimeout(() => { this.reload() }, 500)
      }).catch(err => {
        console.warn('评论（error）：', err)
        if (err.code === 405) {
          this.$toast(err.message)
        } else {
          this.$toast('发表失败')
        }
      })
    },

    // 回复发送
    commentsReply() {
      commentReplyApi({
        id: this.commentOne.id,
        cid: getGLOBAL('comments').id,
        type: getGLOBAL('comments').type,
        content: this.inputText.trim()
      }).then(succ => {
        console.log('回复评论（success）：', succ)
        this.$toast('发表成功')
        this.commentType = 'normal'
        this.inputPlaceholder = '千头万绪，落笔汇成评论一句'
        setTimeout(() => { this.reload() }, 500)
      }).catch(err => {
        console.warn('回复评论（error）：', err)
        if (err.code === 405) {
          this.$toast(err.message)
        } else {
          this.$toast('发表失败')
        }
      })
    },

    // 举报评论
    report(text) {
      reportApi({
        id: this.commentOne.id,
        cid: getGLOBAL('comments').id,
        type: getGLOBAL('comments').type,
        reason: text
      }).then(succ => {
        console.log('举报成功（success）：', succ)
        this.$toast('举报成功')
      }).catch(err => {
        console.warn('举报失败（error）：', err)
        this.$toast('举报失败')
      })
    },

    // 删除评论
    delComments() {
      commentDelApi({
        id: this.commentOne.id,
        cid: getGLOBAL('comments').id,
        type: getGLOBAL('comments').type
      }).then(succ => {
        console.log('删除评论成功（success）：', succ)
        setTimeout(() => { this.reload() }, 500)
      }).catch(err => {
        console.warn('删除评论失败（error）：', err)
        this.$toast('删除失败')
      })
    },

    // 分享按钮
    shareBtn(way) {
      if (way === 'save') {
        download(this.commentOne.blob, `评论分享_${new Date().getTime()}`)
      } else {
        this.$toast('做不了')
      }
    },

    // 关注
    follow() {
      if (!getGLOBAL('isLogin')) goLogin('user', getGLOBAL('user').id)
      followApi({
        id: this.reply.owner.user.userId,
        t: 1
      }).then(succ => {
        console.log('关注（success）：', succ)
      }).catch(err => {
        console.warn('关注（error）：', err)
      })
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.innerPage !== 0) {
      this.innerPage = 0
      this.titleText = '评论'
      this.total = this.normal.total
      this.inputBar = true
      return next(false)
    }
    if (this.firstWin || this.secWin || this.sharePage) {
      this.$rmask()
      this.winHide()
      this.sharePage = false
      return next(false)
    }
    next()
  }
}
</script>

<style lang="scss">
.comments-page {
  .title {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    div {
      font-size: 30px;
      .back-icon {
        font-size: 35px;
        margin-right: 30px;
      }
    }
    .share {
      font-size: 35px;
    }
    .follow {
      height: 50px;
      font-size: 20px;
      border-radius: 50px;
      background: rgba(255, 69, 69, 0.2);
      display: table;
      .cover {
        width: 50px;
        height: 50px;
        display: table-cell;
        vertical-align: middle;
        background: no-repeat center center / cover;
        border-radius: 50%;
      }
      span {
        color: #ff4545;
        padding: 0 15px 0 10px;
        display: table-cell;
        vertical-align: middle;
      }
    }
  }
  .in{
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .head {
    height: 160px;
    padding: 0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .cover {
      width: 125px;
      height: 125px;
      flex-shrink: 0;
      border-radius: 8px;
      margin-right: 15px;
      background: no-repeat center center / cover;
    }
    div {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p:last-child {
          font-size: 20px;
          margin-top: 15px;
          line-height: 1em;
          .author {
            color: #4c7aad;
          }
        }
      }
      span {
        color: #999;
      }
    }
  }
  .line {
    height: 15px;
    background: #f5f5f5;
  }
  .text {
    font-weight: bold;
    margin-top: 25px;
    padding: 0 28px;
    span {
      color: #999;
      font-size: 20px;
    }
  }
  .comments {
    border-bottom: 15px solid #f5f5f5 !important;
  }
  .comments, .hot-comments, .comments-style {
    padding: 0 28px;
    border-bottom: 1.5px solid #f5f5f5;
    li {
      margin-left: -12px;
      padding-top: 5px;
      >div:first-child {
        display: flex;
        align-items: center;
        .avatar {
          width: 55px;
          height: 55px;
          padding: 12px;
          flex-shrink: 0;
          box-sizing: content-box;
          background: no-repeat center center / 100% auto;
          div {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: no-repeat center center / cover;
          }
        }
        .info {
          width: 100%;
          margin-left: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          div:first-child {
            .nickname {
              display: flex;
              align-items: center;
              span {
                margin-right: 5px;
              }
              span:first-child {
                color: #646464;
                font-size: 22px;
              }
              .creator, .onaji-city {
                color: #666;
                font-size: 13px;
                padding: 0 5px;
                border-radius: 6px;
                border: 1.5px solid rgb(192, 192, 192);
              }
              img {
                width: unset;
                height: 22px;
              }
            }
            p {
              color: #a0a0a0;
              font-size: 15px;
            }
          }
          div:last-child {
            display: flex;
            align-items: center;
            p:first-child {
              font-size: 20px;
            }
            p:last-child {
              font-size: 28px;
            }
          }
        }
      }
      >div:last-child {
        margin-left: 88px;
        padding-bottom: 20px;
        font-size: 24px;
        border-bottom: 1.5px solid #f5f5f5;
        .reply {
          display: inline-block;
          color: #4474aa;
          margin-top: 15px;
          font-size: 20px;
        }
        div {
          color: #666;
          font-size: 21px;
          margin-top: 20px;
          padding: 0 20px 0 15px;
          border-left: 3px solid #f3f3f3;
          span {
            display: block;
          }
          span:first-child {
            color: #4474aa;
          }
          span:first-child, span:nth-child(2) {
            display: inline;
          }
        }
      }
    }
    li:last-of-type {
      >div {
        border: none;
      }
    }
    .more-hot {
      color: #666;
      width: 200px;
      height: 55px;
      margin: 20px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      border-radius: 50PX;
      border: 1PX solid #666;
    }
  }
  .comments-style {
    border: none;
  }
  .send {
    height: 90px;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 28px;
    border-top: 1.5px solid #f5f5f5;
    input {
      width: 100%;
      height: 100%;
      font-size: 23px;
      margin-right: 25px;
    }
    button {
      flex-shrink: 0;
      font-size: 25px;
    }
  }
  // 分享图片
  .share-img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    overflow: auto;
    background: rgba(255, 255, 255, 0.9);
    .close {
      width: 40px;
      position: fixed;
      top: 27px;
      right: 27px;
    }
    .inner {
      background: no-repeat center center / cover;
      padding: 30px 20px 50px;
      canvas {
        display: block;
      }
      i {
        display: block;
        width: 100%;
        height: 280px;
      }
      >p {
        color: #d2cecb;
        padding-left: 1.5em;
        background: url('../assets/img/comments/logo.png') no-repeat center left / 1em auto;
      }
      .img-comments-list {
        margin-top: 155px;
        background: #fff;
        border-radius: 16px;
        .total {
          font-size: 22px;
          margin-top: 40px;
          padding: 0 25px;
        }
        .img-title {
          padding-left: 25px;
          white-space: nowrap;
          .img-cover {
            display: inline-block;
            width: 190px;
            height: 190px;
            overflow: hidden;
            border-radius: 10px;
            margin-top: -90px;
            box-shadow: 0px 4PX 4PX 0px rgba(0, 0, 0, 0.5);
            background: no-repeat center center / cover;
          }
          .img-info {
            width: 445px;
            display: inline-block;
            margin-left: 25px;
            p:first-child {
              font-size: 30px;
              font-weight: bold;
            }
            p:last-child {
              color: #808080;
              font-size: 22px;
            }
          }
        }
      }
      .qr {
        margin-top: 50px;
        img {
          display: block !important;
          width: 120px;
          margin: 0 auto;
          border: 3px solid rgb(255, 255, 255);
        }
        p {
          color: #d2cecb;
          font-size: 23px;
          margin-top: 25px;
          text-align: center;
        }
      }
    }
    .btns {
      background: rgba(243, 243, 243, 0.95);
      padding-top: 30px;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      >p {
        padding: 0 30px;
      }
      ul {
        padding: 30px 0 60px;
        overflow: auto;
        white-space: nowrap;
        li {
          display: inline-block;
          width: 150px;
          text-align: center;
          font-size: 22px;
          img {
            display: inline-block;
            width: 90px;
            border-radius: 50%;
            background: rgba(238, 238, 238, 0.95);
          }
        }
      }
    }
  }
  // 一级弹窗
  .first-win {
    width: 100%;
    height: 100%;
    display: table;
    position: absolute;
    top: 0;
    z-index: 11;
    padding: 0 50px;
    >div {
      display: table-cell;
      vertical-align: middle;
      .inner {
        padding: 10px 35px;
        background: #fff;
        border-radius: 15px;
        p {
          line-height: 80px;
        }
      }
    }
  }
  // 二级弹窗
  .sec-win {
    width: 100%;
    height: 100%;
    display: table;
    position: absolute;
    top: 0;
    z-index: 11;
    padding: 0 50px;
    >div {
      display: table-cell;
      vertical-align: middle;
      .inner {
        padding: 35px;
        background: #fff;
        border-radius: 15px;
        p {
          line-height: 80px;
        }
        span:first-child {
          display: block;
          font-size: 30px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        span:last-child {
          color: #4c7aad;
          display: block;
          text-align: right;
          line-height: 80px;
          font-size: 21px;
        }
      }
    }
  }
  .win-show {
    animation: opacity-show .2s linear;
  }
  .win-hide {
    animation: opacity-hide .2s linear;
  }
}
</style>
