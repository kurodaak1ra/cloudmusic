import { get, post } from './request'

// 新注册用户名初始化
export const activateInitProfileApi = data => post('/activate/init/profile', data)
// 收藏专辑
export const albumSubApi = data => post('/album/sub', data)
// 获取专辑详情
export const albumDetailApi = data => post('/album/detail', data)
// 获取城市编码
export const areaCodeApi = data => get('/area/code', data)
// 省市联动列表数据
export const areaListApi = data => get('/area/list', data)
// 获取歌手专辑
export const artistAlbumApi = data => post('/artist/album', data)
// 获取歌手描述
export const artistIntroductionApi = data => post('/artist/introduction', data)
// 收藏歌手
export const artistSubApi = data => post('/artist/sub', data)
// 获取歌手top50
export const artistTopSongApi = data => post('/artist/top/song', data)
// 获取艺术家视频
export const artistVideoApi = data => post('/artist/video', data)


// batch
export const batchApi = data => post('/batch', data)


// 发送验证码
export const captchaSentApi = data => post('/captcha/sent', data)
// 验证验证码
export const captchaVerifyApi = data => post('/captcha/verify', data)
// 检测用户是否注册
export const cellphoneExistenceCheckApi = data => post('/cellphone/existence/check', data)
// 获取专辑评论
// export const commentAlbumApi = data => post('/comment/album', data)
// 点赞
export const commentLikeApi = data => post('/comment/like', data)
// 获取歌曲评论
export const commentMusicApi = data => post('/comment/music', data)
// 获取歌单评论
// export const commentPlaylistApi = data => post('/comment/playlist', data)
// 发送评论
export const commentApi = data => post('/comment', data)
// 回复评论
export const commentReplyApi = data => post('/comment/reply', data)
// 删除评论
export const commentDelApi = data => post('/comment/del', data)
// 更多热评
export const commentHotApi = data => post('/comment/hot', data)


// 签到
export const dailySigninApi = data => post('/daily_signin', data)
// 获取我的数字专辑
export const digitalAlbumPurchasedApi = data => post('/digitalAlbum/purchased', data)


// 关注用户
export const followApi = data => post('/follow', data)


// 喜欢当前歌曲
export const likeApi = data => post('/like', data)
// 喜欢的音乐
export const likeListApi = data => post('/likelist', data)


// 电话号码 登录
export const loginCellphoneApi = data => post('/login/cellphone', data)
// 获取登录状态
export const loginStatusApi = data => post('/login/status', data)
// email 登录
export const loginEmailApi = data => post('/login', data)
// 登出
export const logoutApi = data => post('/logout', data)


// 更新歌单介绍
export const playlistDescUpdateApi = data => post('/playlist/desc/update', data)
// 获取某个歌单详情
export const playlistDetailApi = data => post('/playlist/detail', data)
// 更新歌单名
export const playlistNameUpdateApi = data => post('/playlist/name/update', data)
// 收藏歌单
export const playlistSubscribeApi = data => post('/playlist/subscribe', data)
// 获取歌单收藏者
export const playlistSubscribersApi = data => post('/playlist/subscribers', data)
// 更新歌单标签
export const playlistTagsUpdateApi = data => post('/playlist/tags/update', data)


// 电话注册
export const registerCellphoneApi = data => post('/register/cellphone', data)
// 举报
export const reportApi = data => post('/report', data)


// 默认搜索关键词
export const searchDefaultApi = data => post('/search/default', data)
// 热搜榜
export const searchHotDetailApi = data => post('/search/hot/detail', data)
// 搜索建议
export const searchSuggestApi = data => post('/search/suggest', data)
// 搜索 云村 主题
export const searchResourceTalkApi = data => post('/search/resource/talk', data)
// 搜索 云村 mlog
export const searchResourceMlogApi = data => post('/search/resource/mlog', data)
// 搜索
export const searchApi = data => post('/search', data)
// slogan 页广告
export const sloganAdvApi = data => get('/slogan/adv', data)
// 获取歌曲详情
export const songDetailApi = data => post('/song/detail', data)
// 获取歌词
export const songLyricApi = data => post('/song/lyric', data)
// 获取歌曲 url
export const songUrlApi = data => post('/song/url', data)


// 获取更新日志
export const updateLogApi = data => get('/update/log', data)
// 获取用户详情
// export const userDetailApi = data => post('/user/detail', data)
// 获取用户歌单
// export const userPlayListApi = data => post('/user/playlist', data)
// 更新用户信息
export const userSubcountApi = data => post('/user/update', data)
// 获取用户大学
export const userCollegeApi = data => post('/user/college', data)


// 访问量统计
export const visitorsApi = data => get('/visitors', data)
