// 配置构建包名
let { outputDir } = require(`${process.cwd()}\\vue.config.js`)
outputDir = outputDir || 'dist'

const getNow = () => {
  const now = new Date()
  return `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`
}

module.exports = {
  outputDir: outputDir, // 构建包名设置，不设置为 vue.config.js 中的 outputDir(默认 dist)
  configPath: `${process.cwd()}\\deploy.config.js`, // 项目部署配置文件路径
  targetDir: `${process.cwd()}\\${outputDir}`, // 待压缩目录
  targetZipFile: `${process.cwd()}\\${outputDir}-${getNow()}.zip`, // 压缩后文件路径
}
