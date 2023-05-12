// Importing the updateToken function from the 'utils.js' file.
const { updateToken } = require('./utils');

// Load environment variables from '.env' file.
require('dotenv').config();

// Define a function 'main' which will be called to start the script.
const main = async () => {
	try {
		// Call the 'updateToken' function.
		await updateToken();
	} catch (error) {
		// Catch any errors that occur and log them to the console.
		console.log('Token update failed :', error);
	}
	// Exit the process.
	process.exit();
};

// Call the 'main' function to start the script.
main();
