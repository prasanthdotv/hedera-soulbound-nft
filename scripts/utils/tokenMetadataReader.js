require('dotenv').config();

const { getClient } = require('./client');

//Grab your Hedera testnet account ID and private key from your .env file
const { CONTRACT_ID } = process.env;

exports.getMetadata = async (tokenId) => {
	const client = await getClient();

	const getTokenURI = new ContractExecuteTransaction()
		.setContractId(CONTRACT_ID)
		.setGas(4000000)
		.setMaxTransactionFee(new Hbar(20)) //Use when HBAR is under 10 cents
		.setFunction('tokenURI', new ContractFunctionParameters().addUint256(tokenId));

	const getTokenURITx = await getTokenURI.execute(client);
	const getTokenURIRx = await getTokenURITx.getRecord(client);
	const serial = getTokenURIRx.contractFunctionResult.getString(0);

	console.log(`Token URI of ${tokenId} : ${serial} \n`);
};
