let Loading = {}
Loading.install = (Vue) => {
  Vue.prototype.$loading = () => {
    if (document.getElementsByClassName('v-loading').length) return
    let tpl = new Vue({
      render: h => {
        let children = []
        children.push(h('img', {
          style: {
            width: '13% !important',
            display: 'inline !important'
          },
          attrs: {
            src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiIGhlaWdodD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiBjbGFzcz0ibGRzLWZsaWNrciIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48Y2lyY2xlIG5nLWF0dHItY3g9Int7Y29uZmlnLmN4MX19IiBjeT0iNTAiIG5nLWF0dHItZmlsbD0ie3tjb25maWcuYzF9fSIgbmctYXR0ci1yPSJ7e2NvbmZpZy5yYWRpdXN9fSIgY3g9IjUxLjI4NDgiIGZpbGw9IiNlMTViNjQiIHI9IjIwIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJjeCIgY2FsY01vZGU9ImxpbmVhciIgdmFsdWVzPSIzMDs3MDszMCIga2V5VGltZXM9IjA7MC41OzEiIGR1cj0iMSIgYmVnaW49Ii0wLjVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjwvY2lyY2xlPjxjaXJjbGUgbmctYXR0ci1jeD0ie3tjb25maWcuY3gyfX0iIGN5PSI1MCIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jMn19IiBuZy1hdHRyLXI9Int7Y29uZmlnLnJhZGl1c319IiBjeD0iNDguNzE1MiIgZmlsbD0iI2Y0N2U2MCIgcj0iMjAiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN4IiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjMwOzcwOzMwIiBrZXlUaW1lcz0iMDswLjU7MSIgZHVyPSIxIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9jaXJjbGU+PGNpcmNsZSBuZy1hdHRyLWN4PSJ7e2NvbmZpZy5jeDF9fSIgY3k9IjUwIiBuZy1hdHRyLWZpbGw9Int7Y29uZmlnLmMxfX0iIG5nLWF0dHItcj0ie3tjb25maWcucmFkaXVzfX0iIGN4PSI1MS4yODQ4IiBmaWxsPSIjZTE1YjY0IiByPSIyMCI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iY3giIGNhbGNNb2RlPSJsaW5lYXIiIHZhbHVlcz0iMzA7NzA7MzAiIGtleVRpbWVzPSIwOzAuNTsxIiBkdXI9IjEiIGJlZ2luPSItMC41cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIHZhbHVlcz0iMDswOzE7MSIgY2FsY01vZGU9ImRpc2NyZXRlIiBrZXlUaW1lcz0iMDswLjQ5OTswLjU7MSIgbmctYXR0ci1kdXI9Int7Y29uZmlnLnNwZWVkfX1zIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgZHVyPSIxcyIvPjwvY2lyY2xlPjwvc3ZnPg=='
          }
        }))
        children.push(h('i', {
          style: {
            width: '0',
            height: '100%',
            display: 'inline-block',
            verticalAlign: 'middle'
          }
        }))
        return h('div', {
          class: 'v-loading',
          style: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: '99999',
            textAlign: 'center'
          }
        }, children)
      }
    }).$mount().$el
    document.getElementById('app').appendChild(tpl)
  }

  Vue.prototype.$rloading = () => {
    if (!document.getElementsByClassName('v-loading').length) return
    document.getElementById('app').removeChild(document.getElementsByClassName('v-loading')[0])
  }
}
export default Loading
