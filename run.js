const { tap } = require('node:test/reporters');
const { run } = require('node:test');
const path = require('node:path');

run({ files: 
		[
			path.resolve('./tests/login.js'),
			path.resolve('./tests/register.js'),
			path.resolve('./tests/updateInfo.js'),
			path.resolve('./tests/getLoan.js'),
			path.resolve('./tests/payBill.js'),
		] 
	})
 	.compose(tap)
 	.pipe(process.stdout);
