var path = require('path')
var exists = require('fs').existsSync
var validateName = require('./check-name').validateNameIsLegal
var exec = require('child_process').execSync

/**
 * Read prompts metadata.
 *
 * @param {String} dir
 * @return {Object}
 */

module.exports = function options(name, dir) {
  var opts = getMetadata(dir)

  setDefault(opts, 'name', name)
  setValidateName(opts)

  var author = getGitUser()
  if (author) {
    setDefault(opts, 'author', author)
  }

  return opts
}

/**
 * Gets the metadata from either a meta.json or meta.js file.
 */
function getMetadata(dir) {
  var json = path.join(dir, 'meta.json')
  var js = path.join(dir, 'meta.js')
  var opts = {}

  if (exists(json)) {
    opts = require(json)
  } else if (exists(js)) {
    var req = require(js)
    if (req !== Object(req)) {
      throw new Error('meta.js needs to expose an object')
    }
    opts = req
  }

  return opts
}

/**
 * [setDefault Set the default value for a prompt question]
 * @param {[type]} opts [options]
 * @param {[type]} key  [options key]
 * @param {[type]} val  [option value default]
 */
function setDefault(opts, key, val) {
  if (opts.schema) {
    opts.prompts = opts.schema
    delete opts.schema
  }
  var prompts = opts.prompts || (opts.prompts = {})
  if (!prompts[key] || typeof prompts[key] !== 'object') {
    prompts[key] = {
      'type': 'string',
      'default': val
    }
  } else {
    prompts[key]['default'] = val
  }
}

/**
 * [setValidateName description]
 * @param {[type]} opts [description]
 */
function setValidateName(opts) {
  var name = opts.prompts.name
  var customValidate = name.validate
  name.validate = function(name) {
    return validateName(name) || ((typeof customValidate === 'function') && customValidate(name)) || true
  }
}

function getGitUser() {
  var name
  var email

  try {
    name = exec('git config --get user.name')
    email = exec('git config --get user.email')
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1)
  email = email && (' <' + email.toString().trim() + '>')
  return (name || '') + (email || '')
}
