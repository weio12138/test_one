const glob = require('glob')
const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin') // html模板编译

// 方案
const PROGRAMME_NUM = [...Array(glob.sync(path.join(__dirname, `./src/second-page/programme-*`)).length).keys()]
const PROGRAMME_FUN = function () {
  let obj = {}
  PROGRAMME_NUM.forEach(item => {
    obj[item] = `programme-${item}`
  })
  return obj
}

const PROGRAMME = Object.assign({}, PROGRAMME_FUN(), {'test': 'zero_2'})  // 方案

const PROGRAMME_INDEX = 28 // 仅isSecond=1有用， 哪个方案,0开始
const TEMPLATE = 'shop267' // 模板名称
const isSecond = 0 // 是否打包内页，0不是，1是
const isHtml = true // 是否打包html
const isHtmlMinify = true // 是否压缩html,仅isHtml=true有用
const isPurgeCss = true // 是否清除多余css

// 入口文件
const entryArr = [
  {
    // index: `./src/${TEMPLATE}/index.js`,
    // base: './src/base.js',
    // footer: './src/footer.js'
    index: `./src/${TEMPLATE}/index.scss`,
    base: `./src/${TEMPLATE}/base.scss`,
    footer: `./src/${TEMPLATE}/footer.scss`,
    tpshop: `./src/${TEMPLATE}/tpshop.scss`,
    myaccount: `./src/${TEMPLATE}/myaccount.scss`,
    reg3: `./src/${TEMPLATE}/reg3.scss`
  },
  {
    tpshop: `./src/second-page/${PROGRAMME[PROGRAMME_INDEX]}/tpshop.scss`,
    myaccount: `./src/second-page/${PROGRAMME[PROGRAMME_INDEX]}/myaccount.scss`,
    reg3: `./src/second-page/${PROGRAMME[PROGRAMME_INDEX]}/reg3.scss`,
    store: `./src/second-page/common/store.scss`,
  }
]

// 出口文件
const outputArr = [
  {
    path: path.resolve(__dirname, `manyshop/template/pc/${TEMPLATE}`),
    filename: 'static/js/[name].js'
  },
  {
    path: path.resolve(__dirname, `second-page/template/${TEMPLATE}`),
    filename: 'static/js/[name].js'
  }
]

// 自动导入模块
// 入口文件
const entrys = function () {
  let paths = isSecond ? `second-page/?(common|${PROGRAMME[PROGRAMME_INDEX]})` : TEMPLATE
  let obj = {}
  glob.sync(path.join(__dirname, `./src/${paths}/!(common).scss`)).forEach((item) => {
    let fileName = item.match(/(\w+).\w+$/)[1]
    obj[fileName] = item
  })
  return obj
}

// 出口文件
const outputs = function () {
  let paths = isSecond ? `second-page/template/${TEMPLATE}` : `manyshop/template/pc/${TEMPLATE}`
  return {
    path: path.resolve(__dirname, paths),
    filename: 'static/js/[name].js'
  }
}


// const getHtml = function () {
//   let arr = []
//   // let fileList = ['./src/layout/layout.art', `./src/${TEMPLATE}/header.art`, `./src/${TEMPLATE}/footer.art`]
//   glob.sync(path.join(__dirname, `./src/?(layout|${TEMPLATE})/*.art`)).forEach((item) => {
//     let fileName = item.match(/(\w+).\w+$/)[1] // 获取文件名，【1】不带后缀，【0】带后缀
//     let obj = 'public'
//     if (fileName == 'layout') {
//       obj = 'index'
//       fileName = 'index'
//     }
//     arr.push(new HtmlWebPackPlugin(getHtmlOptions(item, `${obj}/${fileName}.html`, isHtmlMinify)))
//   })
//   return arr
// }

const secondGetHtml = function () {
  let arr = []
  let reg = new RegExp(`second-page/(common|${PROGRAMME[PROGRAMME_INDEX]})/`)
  glob.sync(path.join(__dirname, `./src/second-page/?(common|${PROGRAMME[PROGRAMME_INDEX]})/**/!(*.scss)`), { nodir: true }).forEach((item) => {
    outputPath = item.split(reg).pop() // pop()删除最后一个元素，并返回
    // let fileName = item.match(/(\w+).\w+$/)[0] // 获取文件名，【1】不带后缀，【0】带后缀
    arr.push({
      template: item, filename: outputPath
    })
  })
  return arr
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
  return new HtmlWebPackPlugin(obj)
}

module.exports = {
  PROGRAMME,
  PROGRAMME_INDEX,
  TEMPLATE,
  isSecond,
  isHtml,
  isHtmlMinify,
  entrys,
  outputs,
  entryArr,
  outputArr,
  isPurgeCss,
  // getHtml,
  secondGetHtml
}