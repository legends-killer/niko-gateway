<!--
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-09 01:27:37
 * @Description:
-->

# Niko-Gateway

![example workflow](https://github.com/legends-killer/niko-gateway/actions/workflows/nodejs.yml/badge.svg)
[![codebeat badge](https://codebeat.co/badges/ca1d584f-00ee-48d5-9372-ff1200d41fe7)](https://codebeat.co/projects/github-com-legends-killer-niko-gateway-main)
[![GitHub license](https://img.shields.io/github/license/legends-killer/niko-gateway)](https://github.com/legends-killer/niko-gateway/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/legends-killer/niko-gateway)](https://github.com/legends-killer/niko-gateway/issues)
[![GitHub stars](https://img.shields.io/github/stars/legends-killer/niko-gateway)](https://github.com/legends-killer/niko-gateway/stargazers)

<div align="center">

![avatar](./icon.jpg)

</div>

- A lightweight, easy to use, and open source, gateway by node.js.
- English | [中文](./README-SC.md)

---

## Features

- Basic
  - ✅ oAuth2.0
  - ✅ JWT token
  - ✅ User, user group, permission management
  - ✅ Configurable schedule work
  - ✅ Easy to use log search and analysis system
  - ✅ Hot reload for production environment
  - ✅ System status monitor
    - ✅ API monitor (biz, service)
    - ✅ Cache monitor
    - ✅ Threshold alarm
- Gateway Admin
  - ✅ Configurable microservice, HTTP RESTful API
    - ✅ Microservice, API router management
    - ✅ HTTP proxy
    - ✅ Configurable HTTP request header
    - ✅ Traffic monitor
  - ✅ Configurable AB test
    - ✅ Traffic shifting ratio, time, and strategy
    - ✅ AB Test monitor
  - ✅ Configurable inner service API
- User
  - ✅ Auth logs
  - ✅ Easy to access apps authorized by gateway

## What's Next

- 🧑‍💻 Unit test
- ✅ Docker & docker-compose Support
- 🧑‍💻 Enhance accessToken management (for security)
- 🧑‍💻 Enhance system monitor
  - Request response time
  - Traffic visualization
- 🧑‍💻 Enhance gateway
  - protocol conversion
    - HTTP to gRPC
    - HTTP to Dubbo
  - SLB (may be)

## Example

[Here](https://app.niko-gateway.top) is an example of Niko-Gateway based on GitHub oAuth App.
**[Example Instructions](./EXAMPLE.md)**

## Quick Start

### Requirement

- Node.js 14.x
- Typescript 4.5+
- MySQL5.7+
- Redis
- An oAuth service
  - [GitHub oAuth](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
  - [Google oAuth](https://developers.google.com/identity/protocols/OAuth2)
  - etc.

### Clone the repository

```bash
git clone --depth 1 https://github.com/legends-killer/niko-gateway.git
```

### Install Node.js

note: **please use node.js 14.x** (16.x or higher are not supported)

```bash
nvm install v14.17.5
// or nvm use v14.x
```

### Install dependencies

```bash
yarn install
```

### Initialize the database

```bash
yarn niko // init
yarn stop // stop the server after initializing the database
```

---

### For Development

- Copy `./config/config.base.js` to `./config/config.local.js`
- Follow the instructions in `./config/config.local.js` to configure your development environment
- Start the development server
  ```bash
  yarn dev
  ```
- App will be ready on http://localhost:7001

### For Production

- Copy `./config/config.base.js` to `./config/config.prod.js`
- Follow the instructions in `./config/config.prod.js` to configure your production environment
- Compile `ts` to `js`:
  ```bash
  yarn ci
  ```
- Start the server:
  ```bash
  yarn start
  ```
  note: if you havn't initialized the database in your production environment, please run `yarn niko` first.

## Work with Niko-Gateway FE

You can implement your own front-end by using the repository [Niko-Gateway FE](https://github.com/legends-killer/niko-gateway-fe)

## Issue

You can report issues [here](https://github.com/legends-killer/niko-gateway/issues)

## License

[MIT](./LICENSE.md)
