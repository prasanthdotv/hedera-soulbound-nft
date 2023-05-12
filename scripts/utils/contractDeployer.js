const { PrivateKey, ContractCreateFlow } = require('@hashgraph/sdk');
require('dotenv').config();

const { getClient } = require('./client');
const contractJSON = require('../../artifacts/contracts/HSNFT.sol/HederaSoulboundNFT.json');

//Grab your Hedera testnet account ID and private key from your .env file
const { CLIENT_PRIVATE_KEY } = process.env;

exports.deployContract = async () => {
	const client = await getClient();

	//Extracting bytecode from compiled code
	const bytecode = contractJSON.bytecode;

	//Create the transaction
	const contractCreation = new ContractCreateFlow()
		.setContractMemo('Hedera Soulbound Token')
		.setGas(4000000)
		.setBytecode(bytecode)
		.setAdminKey(PrivateKey.fromString(CLIENT_PRIVATE_KEY));

	//Sign the transaction with the client operator key and submit to a Hedera network
	const txResponse = await contractCreation.execute(client);

	//Get the receipt of the transaction
	const receipt = await txResponse.getReceipt(client);

	//Get the new contract ID
	const CONTRACT_ID = receipt.contractId;

	console.log(`The contract ID is ${CONTRACT_ID} \n`);

	return CONTRACT_ID;
};
