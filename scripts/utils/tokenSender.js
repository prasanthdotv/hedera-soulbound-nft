// Import necessary modules
const {
	AccountId,
	ContractExecuteTransaction,
	ContractFunctionParameters,
	PrivateKey,
} = require('@hashgraph/sdk');
require('dotenv').config();

// Import getClient function to get client instance for executing transactions
const { getClient } = require('./client');

// Get the contract ID from environment variables
const { CONTRACT_ID } = process.env;

// Define sendToken function to transfer tokens from one account to another
exports.sendToken = async (from, to, token) => {
	// Get client instance
	const client = await getClient();
	// Define the transfer transaction
	const transfer = new ContractExecuteTransaction()
		.setContractId(CONTRACT_ID)
		.setGas(4000000)
		.setFunction(
			'transfer',
			new ContractFunctionParameters()
				.addAddress(AccountId.fromString(from).toSolidityAddress()) // Address of sender
				.addAddress(AccountId.fromString(to).toSolidityAddress()) // Address of receiver
				.addUint256(token) // Token ID
		);

	// Sign and execute the transaction
	const transferTx = await transfer.execute(client);
	const transferRx = await transferTx.getReceipt(client);

	// Print the status of transaction
	console.log(`Token transfer status : ${transferRx.status} \n`);
};
