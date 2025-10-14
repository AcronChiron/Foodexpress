const fs = require('fs');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const tmp = path.resolve(__dirname, 'tmp_swagger_test.js');
const content = `/**
 * @openapi
 * /ping:
 *   get:
 *     summary: ping
 *     responses:
 *       200:
 *         description: OK
 */
function ping(){}
module.exports = ping;
`;
fs.writeFileSync(tmp, content);

const options = {
  definition: { openapi: '3.0.0', info: { title: 't', version: '1.0' } },
  apis: [tmp],
};

const spec = swaggerJSDoc(options);
console.log('tmp file =', tmp);
console.log('paths count =', Object.keys(spec.paths || {}).length);
console.log(JSON.stringify(spec.paths, null, 2));

fs.unlinkSync(tmp);
