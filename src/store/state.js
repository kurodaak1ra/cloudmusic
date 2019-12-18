export default {
  token: 'abcdefghijklmnopqrstuvwxyz',
  firstVisit: true,
  // 全局数据
  GLOBAL: {
    navIndex: 0,
    loading: false,
    netErr: false,
    userInfo: {},
    likeList: [],
    musicList: [],
    musicListIds: [],
    isLogin: false,
    playIndex: null,
    playingId: null,
    '1px': {
      'cccccc': 'data:image/gif;base64,R0lGODlhAQABAPAAAMzMzAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
      'eeeeee': 'data:image/gif;base64,R0lGODlhAQABAPAAAO7u7gAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
      '888888': 'data:image/gif;base64,R0lGODlhAQABAPAAAIiIiAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
      '000000': 'data:image/gif;base64,R0lGODlhAQABAPAAAD09PQAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
      'ffffff': 'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
      'transparent': 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    },
    audio: {
      isPlaying: false,
      isLoading: false,
      totalTime: '00:00',
      codeRate: 0,
      level: 1,
      currentTime: 0,
      loopType: 0,
      buffered: 0,
      volume: 0.5,
    },
    // 触发事件开关
    trigger: {
      songId: null,
      level: null,
      process: 0,
      currentTime: 0,
      autoNext: false,
      prevPiece: false,
      nextPiece: false
    },
    player: {
      comments: 0,
      lyricList: [],
      lyricTarget: 0,
      coverUrlBlob: '',
      lyricTimeLine: [],
      coverSwiperList: []
    },
    album: {
      id: null,
      name: '',
      copywriter: ''
    },
    playlist: {
      id: null,
      name: '',
      copywriter: ''
    },
    comments: {
      id: null,
      uid: null,
      type: null,  // 0、歌曲 1、mv 2、歌单 3、专辑 4、电台 5、视频 6、动态
      coverUrl: '',
      title: '',
      author: ''
    },
    artist: {
      id: null,
      name: ''  // 歌手详情标题
    },
    search: {
      type: 1018,
      history: [],
      keywords: ''
    },
    playlistEdit: {
      id: null
    },
    user: {
      id: null
    },
    info: {
      id: null
    },
    simple: {
      multipleArtist: []
    }
  },
  // 弹窗
  windows: {
    mask: false,
    left: false,
    list: false,
    info: false,
    simple: null
  }
}
