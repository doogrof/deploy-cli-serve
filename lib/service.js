/**
 * 前端自动化部署引导程序
 */
const { isYarnInstalled, isProjectInstalled, packageInfo } = require('./utils.js')

module.exports = class Service {
  constructor() {}

  // 引导函数
  bootstrap = async command => {
    // 前置校验
    await this.preVerfication()
    switch (command) {
      // 版本号
      case '-v':
      case '--version':
        console.log(`${packageInfo.version}`)
        break
      // 运行部署主程序
      case 'deploy':
        this.run()
        break
      // 初始化部署配置文件
      case 'init':
        const { createConfigFile } = require('./init.js')
        createConfigFile()
        process.exit()
        break
      default:
        this.default()
        break
    }
  }

  // 运行部署主程序
  run = async () => {
    const { checkConfigFile, checkConfig } = require('./init.js')
    // 判断是否已经初始化部署配置文件
    await checkConfigFile()
    // 对配置文件信息做校验
    await checkConfig()
    const { main } = require('./main.js')
    main()
  }

  // 前置校验
  preVerfication = async () => {
    // 判断是否安装yarn
    await isYarnInstalled()
    // 判断是否npm install
    await isProjectInstalled()
  }

  // 空命令
  default = () => {
    console.log(`
      deploy-cli-serve -v | --version     展示版本号 
      deploy-cli-serve deploy             开始部署
      deploy-cli-serve init               初始化配置文件
      `)
  }
}
