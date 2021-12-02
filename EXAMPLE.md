<!--
 * @Author: legends-killer
 * @Date: 2021-12-02 12:33:20
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-02 17:51:01
 * @Description:
-->

## 工作原理

```
 ______                    _______                   _________              _________
| user |                  |   fe  |                  | gateway |            |  oAuth  |
    |                         |                           |                       |
    |-- login/?service=xx --->|                           |                       |
    |                         |  |- with token -> check ->|                       |
    |                         |--                         |                       |
    |                         |  |- without token / invalid -> redirect to auth ->|
    |                         |                           |                       |
    |                         |----------------        (oAuth)       -------------|
    |                         |                           |                       |
    |                         |<----- recive token -------|                       |
    |                         |                           |                       |
    |                         |---- validate service ---->|                       |
    |                         |                           |                       |
    |<-- service?token=xxxxx -|<------ is valide ------|  |                       |
    |                         |                         --|                       |
    |               -redirect-|<-------- not valide----|  |                       |
    |              |          |                           |                       |
    |              |          |                           |                       |
    |               -- /info->|                           |                       |
    |                         |                           |                       |

```

## Example

_食用示例（由于墙内的原因，登录接口可能因为延迟较高触发 5s 超时）_

- 比如,配置了一个[枝网查重](https://github.com/ASoulCnki/ASoulCnkiBackend)的微服务，后端地址为http://39.101.136.79:8000（随时停机）
- 配置了几条该微服务的路由，如查重 API：
  - method: POST
  - Gateway Router: /api/asoul/check
  - Server Router: /v1/api/check
  - 此时带 token 访问 https://api.niko-gateway.top:7003/api/asoul/check 将会由网关来决策转发，同时整个请求过程将被网关监控并记录相关日志
    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization: [your accessToken]" -d '{"text":"我好想做嘉然小姐的狗啊"}' "https://api.niko-gateway.top:7003/api/asoul/check"
    ```
- 配置了一条灰度测试规则，同时在 API 配置中打开灰度测试

  - Gateway Router: /api/asoul/ranking
  - Server: http://localhost // 当然是不可用的啦
  - Server Router: /v2/api/ranking/ // 假装开发了 v2 接口
  - Current Ratio: 50 // 切流比例 55 开
  - 此时访问 https://api.niko-gateway.top:7003/api/asoul/ranking 将可能触发灰度策略并转发到~~不存在的~~v2 接口（服务器上有 nginx 就是默认的 404 捏）

    ```bash
    curl -H "Authorization: [your accessToken]" "https://api.niko-gateway.top:7003/api/asoul/ranking?pageSize=5&pageNum=1&timeRangeMode=0&sortMode=1&ids=&keywords="
    ```

    // 未被灰度的 response

    ```json
    {
      "code": 0,
      "message": "success",
      "data": {
        "replies": [
          {
            "rpid": "4763677012",
            "type_id": 1,
            "dynamic_id": "538292842533345524",
            "mid": 622906303,
            "uid": 672328094,
            "oid": "461187013",
            "ctime": 1624199488,
            "m_name": "AKACCDDA",
            "content": "捏麻麻的，点赞动画太潮了",
            "like_num": 31195,
            "origin_rpid": "-1",
            "similar_count": 0,
            "similar_like_sum": 31195
          }
          ...
        ],
        "all_count": 24906,
        "start_time": 1606137506,
        "end_time": 1628600510
      }
    }
    ```

    // 被灰度的 response

    ```html
    <html>
      <head>
        <title>404 Not Found</title>
      </head>
      <body bgcolor="white">
        <center><h1>404 Not Found</h1></center>
        <hr />
        <center>nginx/1.12.2</center>
      </body>
    </html>
    ```

  - 灰度报错也会被网关监控，触发阈值就会根据配置进行邮件通知

## 配置流程

### 创建一个新的微服务

- Url: 微服务用户端 url，即授权后的回调地址
- API Server: API 服务器地址
- Accessable Group: 可访问的用户组
- Status: 微服务状态：开放/关闭
- Public Service: 是否为开放服务（为 true 时访问则无需鉴权）

### 配置微服务下的 API 路由

- Gateway Router: 该配置在网关中的路由 **（注意 ⚠️：必须以/api 开头）**
- Request Method: 请求方法
- Server: 微服务 API 地址（见上方）
- Server Router: 该配置被转发到微服务的路由
- Status: 该配置状态
- AB Test: 是否开启灰度测试
- Public API: 是否为开放 API（为 true 时，且所属微服务为开放服务，访问则无需鉴权）
- Accessable Group: 可访问的用户组
- Custom Header: 自定义请求头 **（建议关注配置 Authorization， 避免把 accessToken 带到不需要的地方）**

### 其他系统配置

- Email: 邮箱配置，用于错误报警
- Schedule: 配置框架的定时任务
- Inner API: 内部 API accessKey
- xxx Error Emial Report: 不同场景的错误报警阈值配置
