const { updateToken } = require('./utils');

require('dotenv').config();

const main = async () => {
	await updateToken();
	process.exit();
};

main();
