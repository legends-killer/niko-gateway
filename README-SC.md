<!--
 * @Author: legends-killer
 * @Date: 2021-12-02 11:18:03
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-09 02:03:18
 * @Description:
-->

[English](./README.md) | 中文

## Features

- 基础功能
  - ✅ oAuth2.0 通用接入
  - ✅ 基于 JWT 的认证
  - ✅ 基本权限管理、用户组管理
  - ✅ 动态配置系统定时任务
  - ✅ 方便的日志查看、搜索
  - ✅ 线上环境热重启
  - ✅ 系统状态监控
    - ✅ 请求监控（业务错误、服务器错误）
    - ✅ 缓存状态
    - ✅ 阈值报警
- Gateway Admin
  - ✅ 配置化微服务、HTTP 网关路由
    - ✅ 微服务、路由管理
    - ✅ HTTP 请求转发
    - ✅ 自定义请求头
    - ✅ 流量监控
  - ✅ 配置化灰度测试
    - ✅ 切流比例、时间、灰度策略
    - ✅ 灰度监控
  - ✅ 可配置微服务内部调用 API
- User
  - ✅ 授权日志
  - ✅ 快速访问网关接入服务

## What's Next

- 🧑‍💻 测试用例补全
- ✅ 支持 Docker, docker-compose 部署
- 🧑‍💻 增强 accessToken 管理、安全性检查
- 🧑‍💻 更强的系统监控
  - 请求响应时间
  - 可视化接口流量
- 🧑‍💻 增强网关服务
  - 协议转换
    - HTTP to gRPC
    - HTTP to Dubbo
  - SLB (可能会写)

## 简单样例

[这里](https://app.niko-gateway.top) 是一个简单的示例，基于 Niko-Gateway + GitHub oAuth 认证实现的 API 网关。

**[食用方法](./EXAMPLE.md)**

## 使用 Niko-Gateway FE 来部署前端

你可以通过 [Niko-Gateway FE](https://github.com/legends-killer/niko-gateway-fe) 来部署 Niko-Gateway 的前端

## 快速开始

### 环境要求

- Node.js 14.x
- Typescript 4.5+
- MySQL5.7+
- Redis
- oAuth 服务
  - [GitHub oAuth](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
  - [Google oAuth](https://developers.google.com/identity/protocols/OAuth2)
  - ...

### 拉取仓库

```bash
git clone --depth 1 https://github.com/legends-killer/niko-gateway.git
```

### 安装 Node.js

注意: **请使用 node.js 14.x** （16.x 及更高版本未经测试）

```bash
nvm install v14.17.5
// or nvm use v14.x
```

### 安装依赖

```bash
yarn install
```

### 初始化数据库

```bash
yarn niko // init
yarn stop // 由于node.js的特性，和我不想写初始化脚本，实际上是启动一个单进程的服务器用于初始化，完成后需要手动关闭
```

---

### For Development

- 复制 `./config/config.base.js` 到 `./config/config.local.js`
- 根据 `./config/config.local.js` 中的指引配置开发环境
- 启动开发服务器：

  ```bash
  yarn dev
  ```

  注意： npm 脚本中是以多进程启动的，目的是为了在进行 IPC 操作时，及时发现线程数据不同步的问题

- App will be ready on http://localhost:7001

### 生产环境部署

- 复制 `./config/config.base.js` 到 `./config/config.prod.js`
- 根据 `./config/config.prod.js` 中的指引配置生产环境
- CI 将 `ts` 构建为 `js`:
  ```bash
  yarn ci
  ```
- 启动服务器：

  ```bash
  yarn start
  ```

  注意： 生产环境同样需初始化数据库！

### 生产环境配置

请参考 **[食用方法](./EXAMPLE.md)**

## 使用 Docker 部署

注意 ⚠️: 建议使用 docker-compose，因为需要做一些预处理。仅将 gateway 本体构建 Docker Image 部署可能导致数据库初始化问题，进而导致无法启动。

### 定制 Niko-Gateway 镜像

- 根据需要修改 `./Dockerfile`
  - 外部端口地址
  - 日志目录
  - ···

### Customize Docker-compose

- 根据需要修改 `./docker-compose.yml` 需要与 `./Dockerfile` 中的配置保持一致
  - mysql & redis 的配置文件
  - 持久化卷的挂在位置
  - niko-gateway 日志目录 外部端口等
  - 镜像构建时的 http 代理
  - ···

### 修改 Niko-Gateway 配置

参见 [生产环境部署](#生产环境部署)

### 将 TS 构建为 JS

- `yarn ci`

### 构建 Docker 镜像 & 启动服务

- 构建镜像:
  ```bash
  docker-compose build
  ```
- 依次启动服务:
  ```bash
  docker-compose up -d
  ```

### 清除 JS 构建产物

- `yarn clean`

## Issue

You can report issues [here](https://github.com/legends-killer/niko-gateway/issues)

## License

[MIT](./LICENSE.md)
