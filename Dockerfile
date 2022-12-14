FROM node:16.7-alpine as builder
# FROM node:12 as builder

ARG buildEnv=stage

RUN apk update
RUN apk add git

RUN git config --global url.https://github.com/.insteadOf git://github.com/
RUN git config --global url.https://github.com/.insteadOf ssh://git@github.com/
RUN git config --global url."https://".insteadOf git://

WORKDIR /src/app
#COPY package.json yarn.lock ./
COPY package.json ./
RUN yarn
#RUN npm i --legacy-peer-deps
COPY . ./

RUN yarn build:${buildEnv}


FROM nginx:alpine
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /src/app/dist/ /usr/share/nginx/html/
RUN chown -R nginx:nginx /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
