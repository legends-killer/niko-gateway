<!--
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-01 21:14:54
 * @Description:
-->

# Niko-Gateway

<div align="center">

![avatar](./icon.jpg)

</div>

A lightweight, easy to use, and open source, Gateway by node.js.

---

## Example

[Here](https://app.niko-gateway.top) is an example of Niko-Gateway based on GitHub oAuth App.

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
