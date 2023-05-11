const { Client } = require('@hashgraph/sdk');
require('dotenv').config();

//Grab your Hedera testnet account ID and private key from your .env file
const { CLIENT_ID, CLIENT_PRIVATE_KEY } = process.env;

//To create client object
exports.getClient = async () => {
	// If we weren't able to grab it, we should throw a new error
	if (CLIENT_ID == null || CLIENT_PRIVATE_KEY == null) {
		throw new Error(
			'Environment variables CLIENT_ID and CLIENT_PRIVATE_KEY must be present'
		);
	}

	// Create our connection to the Hedera network
	return Client.forTestnet().setOperator(CLIENT_ID, CLIENT_PRIVATE_KEY);
};
