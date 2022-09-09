'use strict'
let baseUrl
let doMainUrl

if (process.env.env_config == 'dev') {
  baseUrl = '"https://frp.creatorblue.com/console/"'
  doMainUrl = '"https://frp.creatorblue.com"'
}
if (process.env.env_config == 'prod') {
  baseUrl = '""'
  doMainUrl = '"'
}
if (process.env.env_config == 'test') {
  baseUrl = '"http://39.99.132.73/bds/"'
  doMainUrl = '"https://frp.creatorblue.com"'
}
if (process.env.env_config == 'frp') {
  baseUrl = '"https://frp.creatorblue.com/console/"'
  doMainUrl = '"https://frp.creatorblue.com"'
}

module.exports = {
  NODE_ENV: '"production"',
  baseUrl: baseUrl,
  doMainUrl: doMainUrl
}
