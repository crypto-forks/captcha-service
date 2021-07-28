const {handler} = require( './dist/validate-captcha')

exports.handler = handler
// exports.handler = async function(event, context) {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({message: "Hello World"})
//   };
// }