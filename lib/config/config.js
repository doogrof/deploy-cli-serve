const fs = require('fs')
const { projectInfo } = require('../utils.js')
const { configPath } = require('./common.config.js')

// 项目部署配置信息
let projectDeployConfig = {}
if (fs.existsSync(configPath)) {
  projectDeployConfig = require(configPath)
}

// 部署服务器SSH信息
const sshConfig = Object.assign(
  {
    host: '', // 服务器主机地址
    username: '', // 服务器用户名
    password: '', // 服务器密码
  },
  projectDeployConfig.sshConfig
)

// 待部署文件配置信息
const pathConfig = Object.assign(
  {
    remoteDir: '', // 远程服务器上传目录
    remoteWebDir: '', // 远程服务器web目录
  },
  projectDeployConfig.pathConfig
)

// 项目信息
const projectConfig = Object.assign(
  {
    name: `${projectInfo.description || ''}`, // 项目名称
    webUrl: '', // web服务网址
  },
  projectDeployConfig.projectConfig
)

// 飞书配置信息
const feishuConfig = Object.assign(
  {
    webhookUrl: '', // 自定义机器人的 webhook 地址, 参考网址: https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot
  },
  projectDeployConfig.feishuConfig
)

module.exports = {
  sshConfig: sshConfig,
  pathConfig: pathConfig,
  feishuConfig: feishuConfig,
  projectConfig: projectConfig,
}
