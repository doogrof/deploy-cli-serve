/**
 * 自动化部署入口程序
 */
// 配置文件
const { targetDir, targetZipFile } = require('./config/config.js')
const { sshConfig, pathConfig, projectConfig } = require('./config/config.js')
// 构建，压缩，删除文件，删除目录
const { build, compress, deleteFile, deleteDir } = require('./build.js')
// ssh连接
const { sshConnect, sshPutFile, sshExtractFile } = require('./ssh.js')
// 飞书
const { sendMessage } = require('./feishu.js')

// 自动化部署主函数
const main = async () => {
  console.log('\n开始发布...')
  // 构建
  await build()
  // 压缩文件
  await compress(targetDir, targetZipFile)
  // 删除构建文件
  await deleteDir(targetDir)
  try {
    // 连接ssh
    const ssh = await sshConnect(sshConfig)
    // 上传文件到远程服务器
    const filePathArr = targetZipFile.split('\\')
    const remoteFilePath = filePathArr[filePathArr.length - 1]
    await sshPutFile(ssh, targetZipFile, `${pathConfig.remoteDir}\\${remoteFilePath}`)
    // 删除压缩文件
    await deleteFile(targetZipFile)
    // 解压文件到web目录
    await sshExtractFile(ssh, `${remoteFilePath}`)
    // ssh断联
    ssh.dispose()
    // 发送飞书群聊消息
    const messageText = `项目【${projectConfig.name}】发布成功，发布远程服务器【${sshConfig.host}】文件地址为【${pathConfig.remoteDir}${remoteFilePath}】，web服务已更新【${projectConfig.webUrl}】`
    await sendMessage(messageText)
    console.log('发布完成\n')
    process.exit()
  } catch (error) {
    // 删除压缩文件
    await deleteFile(targetZipFile)
    console.log('发布失败\n')
    process.exit(1)
  }
}

module.exports = {
  main: main,
}
