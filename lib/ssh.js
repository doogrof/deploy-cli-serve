const { NodeSSH } = require('node-ssh')
const { bar, updateBar, colors } = require('./bar.js')
const { pathConfig } = require('./config/config.js')

/**
 * 连接ssh
 * @param {object} sshConfig ssh配置信息
 * @returns
 */
const sshConnect = async sshConfig => {
  bar.start(50, 0, { title: '连接SSH...' })
  updateBar(50)
  try {
    const ssh = new NodeSSH()
    await ssh.connect(sshConfig)
    bar.update(50, { title: colors.green(`SSH 连接成功`) })
    bar.stop()
    return ssh
  } catch (error) {
    bar.update(50, { title: colors.red(`SSH 连接失败: ${error.message || error}`) })
    bar.stop()
  }
}

/**
 * ssh上传文件到远程服务器
 * @param {*} ssh
 * @param {string} targetFile 本地文件路径
 * @param {string} remotePath 上传服务器路径
 * @returns
 */
const sshPutFile = async (ssh, targetFile, remotePath) => {
  bar.start(200, 0, { title: '上传文件中...' })
  updateBar(200)
  remotePath = remotePath.replace(/\//g, '\\')
  const remotePathArr = remotePath.split('\\').filter(item => item !== '')
  const remoteFilePath = remotePathArr[remotePathArr.length - 1]
  try {
    await ssh.putFile(targetFile, remotePath)
    bar.update(200, { title: colors.green(`文件上传服务器成功: ${remotePath}`) })
    bar.stop()
  } catch (error) {
    bar.update(200, { title: colors.red(`文件上传服务器失败: ${error}`) })
    bar.stop()
    // 上传异常时删除远程文件
    await ssh.execCommand(`rm ${remoteFilePath}`, { cwd: pathConfig.remoteDir })
  }
}

/**
 * 删除原web服务并解压文件到web目录
 * @param {ssh} ssh
 * @param {string} remoteFilePath
 */
const sshExtractFile = async (ssh, remoteFilePath) => {
  // 删除原本web文件
  bar.start(50, 0, { title: '解压到web目录中...' })
  updateBar(50)
  try {
    // 删除原本web服务文件
    const delCommand = `rm -rf ${pathConfig.remoteWebDir}`
    await ssh.execCommand(delCommand)
    // 解压到web目录
    const extractCommand = `unzip ${remoteFilePath} -d ${pathConfig.remoteWebDir}`
    const res = await ssh.execCommand(extractCommand, { cwd: pathConfig.remoteDir })
    if (res.code) {
      bar.update(50, { title: colors.red(`解压到web目录失败: ${res.stderr}`) })
      bar.stop()
      return
    }
    bar.update(50, { title: colors.green(`解压到web目录成功`) })
    bar.stop()
  } catch (error) {
    bar.update(50, { title: colors.red(`解压到web目录失败: ${error}`) })
    bar.stop()
  }
}

/**
 * ssh执行命令
 * @param {*} ssh
 * @param {string} command 命令
 * @param {string} path 远程路径
 * @returns
 */
const runCommand = async (ssh, command, path) => {
  try {
    console.log(`正在执行命令: ${command}`)
    const { stdout, stderr } = await ssh.execCommand(command, { cwd: path })
    if (stdout) {
      console.log('runCommand stdout:', stdout) // 输出标准输出
    }
    if (stderr) {
      console.error('runCommand stderr:', stderr) // 输出错误输出
    }
    return { stdout, stderr } // 返回输出内容
  } catch (error) {
    console.error(`命令 ${command} 执行失败: ${error.message || error}`)
  }
}

module.exports = {
  sshConnect: sshConnect,
  sshPutFile: sshPutFile,
  sshExtractFile: sshExtractFile,
  runCommand: runCommand,
}
