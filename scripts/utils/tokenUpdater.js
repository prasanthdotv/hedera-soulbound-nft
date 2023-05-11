const {
	ContractExecuteTransaction,
	ContractFunctionParameters,
	Hbar,
} = require('@hashgraph/sdk');
require('dotenv').config();

const { getClient } = require('./client');

//Grab your Hedera testnet account ID and private key from your .env file
const { IPFS_UPDATED_METADATA_DIR_HASH, METADATA_UPDATE_DIR_PATH, CONTRACT_ID } =
	process.env;

exports.updateToken = async () => {
	const client = await getClient();
	const tokens = await getUpdatedTokens();
	for (const token of tokens) {
		const updateToken = new ContractExecuteTransaction()
			.setContractId(CONTRACT_ID)
			.setGas(4000000)
			.setMaxTransactionFee(new Hbar(20)) //Use when HBAR is under 10 cents
			.setFunction(
				'updateTokenURI',
				new ContractFunctionParameters()
					.addUint256(token)
					.addString(`ipfs://${IPFS_UPDATED_METADATA_DIR_HASH}/${token}.json`) // Metadata
			);

		const updateTokenTx = await updateToken.execute(client);
		await updateTokenTx.getRecord(client);

		console.log(`Updated token metadata of token id ${token} \n`);
	}
};

const getUpdatedTokens = async () => {
	try {
		const files = await fs.promises.readdir(METADATA_UPDATE_DIR_PATH);

		const fileNames = files
			.filter((file) => file.endsWith('.json'))
			.map((file) => file.replace('.json', ''));

		return fileNames;
	} catch (err) {
		throw new Error(`Error reading directory: ${err}`);
	}
};
