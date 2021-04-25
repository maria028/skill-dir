const Timestamp = new Date().getTime();
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  filenameHashing:true,
  configureWebpack: { // webpack 配置
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】\
      filename: `js/[name].${Timestamp}.js`,
      chunkFilename: `js/[name].${Timestamp}.js`
    }
  },
  css: {
  extract: {
    filename: `css/[name].${Timestamp}.css`,
      chunkFilename: `css/[name].${Timestamp}.css`
  }
},
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
    entry
      .add('@/mock')
      .end()
  },
  devServer: {
    // 端口配置
    port: 1888,
    // 反向代理配置 maxy.natapp1.cc
    proxy: {
      '/api': {
        target: 'http://sq.wewins.cn/rest',
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}
