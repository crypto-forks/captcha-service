//not sure why netlify doesn't read "main" from package.json
const {handler} = require( './dist/validate-captcha')
console.log('going through index.js')
exports.handler = handler
