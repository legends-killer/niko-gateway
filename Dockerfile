# base
FROM alpine:3.13 AS base

LABEL author="legends-killer" \
  email="yyy@legends-killer.cq.cn"

ENV NODE_ENV=production \
  APP_PATH=/niko

WORKDIR ${APP_PATH}

RUN apk add --no-cache --update nodejs=14.18.1-r0 yarn=1.22.10-r0 curl

# dependencies
FROM base AS install

COPY package.json *.lock ./

# RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn install

# app
FROM base

COPY --from=install $APP_PATH/node_modules ./node_modules

COPY . .

EXPOSE 7001

VOLUME [ "/logs" ]

# remove --daemon parameter when building
RUN echo `cat ./package.json | sed "s/--daemon /${replace}/"` > ./package.json

# Add the wait script to the image, see https://github.com/ufoscout/docker-compose-wait
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

CMD /wait && yarn start