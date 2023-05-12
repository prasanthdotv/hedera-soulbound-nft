// Importing required libraries
const {
	AccountId,
	ContractExecuteTransaction,
	ContractFunctionParameters,
} = require('@hashgraph/sdk');

// Load environment variables from .env file
require('dotenv').config();

// Importing getClient function from client.js file
const { getClient } = require('./client');

// Retrieve the contract ID from the environment variables
const { CONTRACT_ID } = process.env;

// Async function to get the balance of an account on the NFT Contract
exports.getBalance = async (ACCOUNT_ID) => {
	// Get the client object to interact with the network
	const client = await getClient();

	// Create a contract execute transaction for the balanceOf function
	const balanceOf = new ContractExecuteTransaction()
		.setContractId(CONTRACT_ID)
		.setGas(4000000)
		.setFunction(
			'balanceOf',
			new ContractFunctionParameters().addAddress(
				AccountId.fromString(ACCOUNT_ID).toSolidityAddress()
			)
		);

	// Execute the transaction on the network
	const balanceOfTx = await balanceOf.execute(client);
	// Get the record of the transaction
	const balanceOfRx = await balanceOfTx.getRecord(client);
	// Get the balance from the contract function result
	const balance = balanceOfRx.contractFunctionResult.getUint256(0);

	// Log the balance of the account on the NFT Contract
	console.log(`Balance of ${ACCOUNT_ID} on NFT Contract ${CONTRACT_ID} : ${balance} \n`);
};
