module.exports = {
  // 部署服务器SSH信息
  sshConfig: {
    host: '服务器主机地址',
    username: '服务器用户名',
    password: '服务器密码',
  },

  // 待部署文件配置信息
  pathConfig: {
    remoteDir: '远程服务器上传目录',
    remoteWebDir: '远程服务器web目录',
  },

  // 项目信息
  projectConfig: {
    name: '项目名称',
    webUrl: 'web服务网址',
  },

  // 飞书配置信息
  feishuConfig: {
    webhookUrl: '自定义机器人的 webhook 地址',
  },
}
