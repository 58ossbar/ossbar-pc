'use strict'
let baseUrl
//webSocket连接的url
let webSocketUrl
//文件预览的url
let filePreviewUrl
let doMainUrl

if (process.env.env_config == 'dev') {
  baseUrl = '"https://frp.creatorblue.com/console/"'
  webSocketUrl = '"wss://frp.creatorblue.com/sp/wss"'
  filePreviewUrl = '"https://frp.creatorblue.com/cbFilePreview/onlinePreview"'
  doMainUrl = '"https://frp.creatorblue.com"'
}
if (process.env.env_config == 'prod') {
  baseUrl = '"https://www.budaos.com/bds/"'
  webSocketUrl = '"wss://www.budaos.com/sp/wss"'
  filePreviewUrl = '"https://frp.creatorblue.com/cbFilePreview/onlinePreview"'
  doMainUrl = '"https://www.budaos.com"'
}
if (process.env.env_config == 'test') {
  baseUrl = '"http://39.99.132.73/bds/"'
  webSocketUrl = '"ws://39.99.132.73/sp/wss"'
  filePreviewUrl = '"http://39.99.132.73/cbFilePreview/onlinePreview"'
  doMainUrl = '"https://frp.creatorblue.com"'
}
if (process.env.env_config == 'frp') {
  baseUrl = '"https://frp.creatorblue.com/console/"'
  webSocketUrl = '"wss://frp.creatorblue.com/sp/wss"'
  filePreviewUrl = '"https://frp.creatorblue.com/cbFilePreview/onlinePreview"'
  doMainUrl = '"https://frp.creatorblue.com"'
}

module.exports = {
  NODE_ENV: '"production"',
  baseUrl: baseUrl,
  webSocketUrl:webSocketUrl,
  filePreviewUrl:filePreviewUrl,
  doMainUrl: doMainUrl
}
