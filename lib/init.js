const fs = require('fs')
const colors = require('ansi-colors') // 终端字体颜色模块

// 对配置文件信息做校验
const checkConfig = async () => {
  const config = require('./config/config.js')
  const configValidate = require('./config/validate.config.js')
  let flag = false,
    errorMessage = ''
  for (let key in config) {
    for (let ke in config[key]) {
      if (!config[key][ke]) {
        flag = true
        const valid = configValidate[key][ke]
        errorMessage += `请完善${valid}【${key}.${ke}】\n`
      }
    }
  }
  if (flag) {
    console.error(colors.red('deploy.config.js配置信息不完善：\n'))
    console.error(colors.red(errorMessage))
    process.exit()
  }
}

const checkConfigFile = async () => {
  const { configPath } = require('./config/common.config.js')
  if (!fs.existsSync(configPath)) {
    console.log('检测到没有初始化配置文件，开始生成...')
    createConfigFile()
    console.log('请完善配置后重新运行程序')
    process.exit()
  }
}

// 初始化配置文件
const createConfigFile = async () => {
  const { configPath } = require('./config/common.config.js')
  if (fs.existsSync(configPath)) {
    console.log(colors.red('配置文件【deploy.config.js】已存在'))
    process.exit()
  }
  const configStr = `
module.exports = {
  // 部署服务器SSH信息
  sshConfig: {
    host: '', // 服务器主机地址
    username: '', // 服务器用户名
    password: '', // 服务器密码
  },

  // 待部署文件配置信息
  pathConfig: {
    outputDir: '', // 构建包名
    remoteDir: '', // 远程服务器上传目录
    remoteWebDir: '', // 远程服务器web目录
  },

  // 项目信息
  projectConfig: {
    name: '', // 项目名称
    webUrl: '', // web服务网址
  },

  // 飞书配置信息
  feishuConfig: {
    webhookUrl: '', // 自定义机器人的 webhook 地址，参考网址: https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot
  },
}
`
  fs.writeFileSync(configPath, configStr)
  console.log(colors.green('配置文件【deploy.config.js】已生成，初始化完成。'))
}

module.exports = {
  createConfigFile: createConfigFile,
  checkConfigFile: checkConfigFile,
  checkConfig: checkConfig,
}
