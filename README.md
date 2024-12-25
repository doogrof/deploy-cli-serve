# deploy-cli

前端自动化部署脚手架服务

## 更新日志

- 增加 deploy.config.js 内 outputDir 配置，自定义构建包名

## 全局安装

```command
npm install deploy-cli-serve -g

yarn global add deploy-cli-serve
```

## 当前目录安装

```command
npm install deploy-cli-serve --save

yarn add deploy-cli-serve
```

## 使用说明

- 使用了 yarn 来执行构建安装，建议 node 版本 18+
- windows 使用 git bash 运行会有飞书推送消息中文乱码的问题， 建议使用 cmd 或 Windows PowerShell
- 所需 package: node-ssh cli-progress archiver ansi-colors
- 飞书群消息发送需要群聊机器人的 webhook 地址，参考网址: https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot

查看帮助

```command
deploy-cli-serve -h
```

非全局安装需要加上 npx

```command
npx deploy-cli-serve -h
```

查看版本

```command
deploy-cli-serve -v, deploy-cli --version
```

初始化配置文件

```command
deploy-cli-serve init
```

开始部署

```command
deploy-cli-serve deploy
```

或者在 package.json scripts 中 添加

```command
"pub": "deploy-cli-serve deploy"
```

然后执行

```command
npm run pub
```
