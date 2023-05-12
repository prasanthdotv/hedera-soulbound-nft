const {
	AccountId,
	ContractExecuteTransaction,
	ContractFunctionParameters,
} = require('@hashgraph/sdk');
require('dotenv').config();

const { getClient } = require('./client');

const { CONTRACT_ID } = process.env;

/**
 * Gets the owner of the specified NFT token on the contract.
 * @param {number} token - The ID of the token to get the owner of.
 */
exports.getOwner = async (token) => {
	const client = await getClient();

	const ownerOf = new ContractExecuteTransaction()
		.setContractId(CONTRACT_ID)
		.setGas(4000000)
		.setFunction('ownerOf', new ContractFunctionParameters().addUint256(token));

	const ownerOfTx = await ownerOf.execute(client);
	const ownerOfRx = await ownerOfTx.getRecord(client);
	const owner = ownerOfRx.contractFunctionResult.getAddress(0);
	const ownerId = AccountId.fromSolidityAddress('0x' + owner).toString();

	console.log(
		`Owner of ${token} on NFT Contract ${CONTRACT_ID} : ${owner}(${ownerId}) \n`
	);
};
