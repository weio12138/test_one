const glob = require('glob')
const HtmlWebPackPlugin = require('html-webpack-plugin') // html模板编译
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提取css到单独文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css
const cssnano = require('cssnano') // 压缩css规则
const webpack = require('webpack') //引入webpack
const path = require('path')
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries') // 删除多余js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 压缩js
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin') // 消除多余css
const CopyWebpackPlugin = require('copy-webpack-plugin') // 拷贝文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 清除输出目录


const { PROGRAMME, PROGRAMME_INDEX, TEMPLATE, isSecond, isHtml, isHtmlMinify, entrys, outputs, entryArr, outputArr, isPurgeCss, secondGetHtml } = require('./constData.config')

module.exports = {
  // entry: entryArr[isSecond],
  entry: entrys(),
  // output: outputArr[isSecond],
  output: outputs(),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/common'),
      '_': path.resolve(__dirname, './src'),
      'template': path.resolve(__dirname, `./src/${TEMPLATE}`)
    }
  },
  module: {
    // noParse: /layout/,
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      // {
      //   test: /\.html$/,
      //   use: [
      //     {
      //       loader: 'html-loader'
      //       // options: { minimize: true }
      //     }
      //   ]
      // },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              importLoaders: 1
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.art$/,
        loader: 'art-template-loader',
        options: {
          root: `./src/${TEMPLATE}`,
        }
      }

      // 图片
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   use: 'file-loader'
      // }
    ]
  },
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    // 删除多余js
    new FixStyleOnlyEntriesPlugin(),

    // css独立打包
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: '[id].css'
    }),

    // 压缩css
    // new OptimizeCssAssetsPlugin({
    //   cssProcessor: cssnano,
    //   cssProcessorOptions: {
    //     preset: [
    //       'default',
    //       {
    //         discardComments: {
    //           removeAll: true
    //         },
    //         normalizeUnicode: false,
    //         colormin: false
    //       }
    //     ]
    //   }
    // }),
    // 热更新
    // new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    minimizer: [
      // js压缩
      new UglifyJsPlugin({
        sourceMap: false,
        uglifyOptions: {
          ie8: true,
          output: {
            comments: true, // 删除注释
            beautify: false,
            // quote_keys: true, // 兼容ie8 保留对象key的引号
          },
          compress: {
            // properties: false, // 兼容ie8 避免使用点符号重写属性访问
            drop_console: true // 删除console.log
          }
        }
      })
    ],
  },
  // devServer: {
  //   contentBase: path.join(__dirname, `./manyshop/template/pc/${TEMPLATE}/index`),
  //   host: 'localhost',
  //   port: '8080',
  //   open: true, // 自动拉起浏览器
  //   hot: true // 热加载
  //   //hotOnly:true
  // }
}

// 编译html
// 动态插入模板
var getHtmlOptions = function (template, filename, isMinify) {
  let obj = {
    template: template,
    filename: filename,
    templateParameters: {
      __STATIC__: '__STATIC__',
      __PUBLIC__: '__PUBLIC__'
    },
    // 不插入js和css
    inject: false
  }
  if (isMinify) {
    obj.minify = {
      //删除注释
      removeComments: true,
      //删除空格
      collapseWhitespace: true,
      minifyJS: {
        ie8: true
      }
    }
  }
  return obj
}

// if (isSecond) {
//   let htmlList = secondGetHtml()

//   let arr = []
//   for (let item of htmlList) {
//     arr.push({from: item.template, to: item.filename})
//   }
//   module.exports.plugins.push(arr)

// } else {
//   let htmlList = [
//     {template: './src/layout/layout.art', filename: 'index/index.html'},
//     {template: `./src/${TEMPLATE}/header.art`, filename: 'public/header.html'},
//     {template: `./src/${TEMPLATE}/footer.art`, filename: 'public/footer.html'}
//   ]

//   for (let item of htmlList) {
//     module.exports.plugins.push(new HtmlWebPackPlugin(getHtmlOptions(item.template, item.filename, isHtmlMinify)))
//   }
// }
// [
//   {template: `./src/second-page/${PROGRAMME[PROGRAMME_INDEX]}/goods/goodsInfo.html`, filename: 'goods/goodsInfo.html'},
//   {template: `./src/second-page/${PROGRAMME[PROGRAMME_INDEX]}/goods/goodsList.html`, filename: 'goods/goodsList.html'},
//   {template: `./src/second-page/login.html`, filename: 'user/login.html'},
//   {template: `./src/second-page/reg.html`, filename: 'user/reg.html'},
//   {template: `./src/second-page/shopin.html`, filename: 'index/shopin.html'},
//   {template: `./src/second-page/reg_footer.html`, filename: 'public/reg_footer.html'}
// ]
if (isHtml) {
  var htmlList = isSecond ? secondGetHtml() : [
    {template: './src/layout/layout.art', filename: 'index/index.html'},
    {template: `./src/${TEMPLATE}/header.art`, filename: 'public/header.html'},
    {template: `./src/${TEMPLATE}/footer.art`, filename: 'public/footer.html'}
  ]

  if (isSecond) {
    let arr = htmlList.map(item => { return { from: item.template, to: item.filename } })
    module.exports.plugins.push(new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: `second-page/template/${TEMPLATE}` }))
    module.exports.plugins.push(new CopyWebpackPlugin(arr))
  } else {
    module.exports.plugins.push(new CopyWebpackPlugin([
      {from: path.join(__dirname, `./src/components/template`), to: './'},
      {from: path.join(__dirname, `./src/${TEMPLATE}/goods`), to: 'goods'},
      {from: path.join(__dirname, `./src/${TEMPLATE}/index`), to: 'index'},
      {from: path.join(__dirname, `./src/${TEMPLATE}/static/css/pagination.css`), to: 'static/css'},
    ]))
    // module.exports.plugins.push(new CopyWebpackPlugin([{from: path.join(__dirname, './src/components/template'), to: './'}]))
    for (let item of htmlList) {
      module.exports.plugins.push(new HtmlWebPackPlugin(getHtmlOptions(item.template, item.filename, isHtmlMinify)))
    }
  }
}

if (isPurgeCss) {
  module.exports.plugins.push(
    // 删除多余css
    new PurgecssWebpackPlugin({
      paths: glob.sync(
        path.join(__dirname, `manyshop/template/pc/${TEMPLATE}/**/*.html`),
        { nodir: true } // 不匹配目录，只匹配文件
      ),
    }),
  )
}

