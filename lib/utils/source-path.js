var path = require('path')
var fs = require('fs')

var userSourcePath = path.join(require('os').homedir(), '.magicrc')
var textHelper = require('./text-helper')

exports.officialSourcePath = path.join(__dirname, '../../.magicrc')
exports.userSourcePath = userSourcePath

exports.aliasRegx = /^\w+$/
exports.localRelativePathRegx = /^[.]{1,2}\//
exports.localAbsolutePathRegx = /^(\w:)|^\//
exports.localPathRegx = /^(\.{1,2}\/|\w:|\/)/

exports.checkUserSourcePath = function() {
  try {
    if (!fs.existsSync(userSourcePath)) {
      fs.writeFileSync(userSourcePath, JSON.stringify({ alias: {} }))
    }
  } catch (err) {
    console.log(textHelper.error(err))
    process.exit()
  }
}

