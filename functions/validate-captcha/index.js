const {validateRequest} = require( './dist/validateRequest')

exports.handler = validateRequest
// exports.handler = async function(event, context) {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({message: "Hello World"})
//   };
// }