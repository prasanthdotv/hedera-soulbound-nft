const {
	AccountId,
	ContractExecuteTransaction,
	ContractFunctionParameters,
	Hbar,
} = require('@hashgraph/sdk');
require('dotenv').config();

const { getClient } = require('./client');

//Grab your Hedera testnet account ID and private key from your .env file
const { INITIAL_SUPPLY, IPFS_METADATA_DIR_HASH, CLIENT_ID } = process.env;

exports.mintNFTs = async (CONTRACT_ID) => {
	const client = await getClient();

	for (let i = 0; i < INITIAL_SUPPLY; i++) {
		// Mint NFT
		const mintToken = new ContractExecuteTransaction()
			.setContractId(CONTRACT_ID)
			.setGas(4000000)
			.setMaxTransactionFee(new Hbar(20)) //Use when HBAR is under 10 cents
			.setFunction(
				'safeMint',
				new ContractFunctionParameters()
					.addUint256(i)
					.addAddress(AccountId.fromString(CLIENT_ID).toSolidityAddress()) // Token address
					.addString(`ipfs://${IPFS_METADATA_DIR_HASH}/${i}.json`) // Metadata
			);

		const mintTokenTx = await mintToken.execute(client);
		const mintTokenRx = await mintTokenTx.getRecord(client);
		const serial = mintTokenRx.contractFunctionResult.getUint256(0);

		console.log(`Minted NFT with token id ${serial} \n`);
	}
};
