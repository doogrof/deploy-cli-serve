// 构建，压缩，删除文件
const { exec } = require('child_process')
const { pathConfig } = require('./config/config.js')
const fs = require('fs')
const archiver = require('archiver')
const { bar, updateBar, colors } = require('./bar.js')

// 构建
module.exports.build = async () => {
  return new Promise((resolve, reject) => {
    bar.start(150, 0, { title: '构建中...' })
    updateBar(150)
    exec(`yarn run build`, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        bar.update(150, { title: colors.red(`执行构建错误: ${error}`) })
        bar.stop()
        reject(error)
      }
      // console.log(`stdout: ${stdout}`)
      // if (stderr) {
      //   console.log(`stderr: ${stderr}`)
      // }
      bar.update(150, { title: colors.green(`构建成功，构建文件为【${pathConfig.outputDir}】`) })
      bar.stop()
      resolve()
    })
  })
}

/**
 * 删除文件
 * @param {*} filePath 待删除文件路径
 * @returns
 */
module.exports.deleteFile = async filePath => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      resolve()
    }
    const filePathArr = filePath.split('\\')
    const filePathName = filePathArr[filePathArr.length - 1]
    bar.start(50, 0, { title: `删除文件【${filePathName}】...` })
    updateBar(50)
    fs.unlink(filePath, error => {
      if (error) {
        bar.update(50, { title: colors.red(`执行删除文件错误: ${error}`) })
        bar.stop()
        reject(error)
      }
      bar.update(50, { title: colors.green(`文件【${filePathName}】删除成功`) })
      bar.stop()
      resolve()
    })
  })
}

/**
 * 删除目录
 * @param {*} dirPath 待删除目录路径
 * @returns
 */
module.exports.deleteDir = async dirPath => {
  return new Promise((resolve, reject) => {
    const dirPathArr = dirPath.split('\\')
    const dirPathName = dirPathArr[dirPathArr.length - 1]
    bar.start(50, 0, { title: `删除目录【${dirPathName}】...` })
    updateBar(50)
    fs.rm(dirPath, { recursive: true }, error => {
      if (error) {
        bar.update(50, { title: colors.red(`执行删除目录错误: ${error}`) })
        bar.stop()
        reject(error)
      }
      bar.update(50, { title: colors.green(`目录【${dirPathName}】删除成功`) })
      bar.stop()
      resolve()
    })
  })
}

/**
 * 压缩文件
 * @param {string} filePath 待压缩文件路径
 * @param {string} zipPath 输出压缩文件路径
 * @returns
 */
module.exports.compress = async (filePath, zipPath) => {
  return new Promise((resolve, reject) => {
    bar.start(50, 0, { title: '压缩文件中...' })
    updateBar(50)
    const output = fs.createWriteStream(zipPath)
    const archive = archiver('zip', {
      zlib: { level: 9 }, // 设置压缩级别
    })

    archive.pipe(output) // 将压缩内容输出到目标文件

    archive.directory(filePath, false) // 将指定目录添加到压缩包
    archive.finalize() // 关闭归档

    output.on('close', function () {
      const zipPathArr = zipPath.split('\\')
      bar.update(50, { title: colors.green(`压缩成功完成，压缩文件为【${zipPathArr[zipPathArr.length - 1]}】`) })
      bar.stop()
      resolve()
    })

    archive.on('error', function (error) {
      bar.update(50, { title: colors.red(`压缩失败: ${error.message || error}`) })
      bar.stop()
      reject(error)
    })
  })
}
