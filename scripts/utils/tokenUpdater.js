const {
	ContractExecuteTransaction,
	ContractFunctionParameters,
	Hbar,
} = require('@hashgraph/sdk');
const fs = require('fs');
require('dotenv').config();

const { getClient } = require('./client');

const { IPFS_UPDATED_METADATA_DIR_HASH, METADATA_UPDATE_DIR_PATH, CONTRACT_ID } =
	process.env;

exports.updateToken = async () => {
	const client = await getClient();
	// Get the list of updated token IDs from the metadata update directory
	const tokens = await getUpdatedTokens();
	for (const token of tokens) {
		// Create a transaction to update the metadata URI for the token on the contract
		const updateToken = new ContractExecuteTransaction()
			.setContractId(CONTRACT_ID)
			.setGas(4000000)
			.setMaxTransactionFee(new Hbar(20)) // Use when HBAR is under 10 cents
			.setFunction(
				'updateTokenURI',
				new ContractFunctionParameters()
					.addUint256(token) // Token ID to update
					.addString(`ipfs://${IPFS_UPDATED_METADATA_DIR_HASH}/${token}.json`) // Updated metadata URI
			);

		// Execute the transaction and wait for the receipt
		const updateTokenTx = await updateToken.execute(client);
		await updateTokenTx.getRecord(client);

		console.log(`Updated token metadata of token id ${token} \n`);
	}
};

const getUpdatedTokens = async () => {
	try {
		// Read the directory containing updated metadata files
		const files = await fs.promises.readdir(METADATA_UPDATE_DIR_PATH);

		// Filter out any files that don't have a .json extension and extract the token IDs from the file names
		const fileNames = files
			.filter((file) => file.endsWith('.json'))
			.map((file) => file.replace('.json', ''));

		return fileNames;
	} catch (err) {
		throw new Error(`Error reading directory: ${err}`);
	}
};
