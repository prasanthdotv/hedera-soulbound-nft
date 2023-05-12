require('dotenv').config();

const { getClient } = require('./client');

const { CONTRACT_ID } = process.env;

exports.getMetadata = async (tokenId) => {
	// Get Hedera client
	const client = await getClient();

	// Construct transaction to call the `tokenURI` function on the NFT contract
	const getTokenURI = new ContractExecuteTransaction()
		.setContractId(CONTRACT_ID)
		.setGas(4000000)
		.setFunction('tokenURI', new ContractFunctionParameters().addUint256(tokenId));

	// Execute transaction and get transaction record
	const getTokenURITx = await getTokenURI.execute(client);
	const getTokenURIRx = await getTokenURITx.getRecord(client);

	// Get the token metadata from the returned value
	const serial = getTokenURIRx.contractFunctionResult.getString(0);

	// Log the retrieved metadata to the console
	console.log(`Token URI of ${tokenId} : ${serial} \n`);
};
