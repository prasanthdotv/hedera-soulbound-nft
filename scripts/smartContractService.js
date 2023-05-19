const {
	Client,
	AccountId,
	ContractExecuteTransaction,
	TokenAssociateTransaction,
	TokenCreateTransaction,
	PrivateKey,
	ContractCreateFlow,
	ContractFunctionParameters,
	ContractDeleteTransaction,
	TokenType,
	TokenSupplyType,
	ContractId,
	Hbar,
	TransferTransaction,
} = require('@hashgraph/sdk');
require('dotenv').config();
const contractJSON = require('../artifacts/contracts/HSNFT.sol/HederaSoulboundNFTManager.json');

//Grab your Hedera testnet account ID and private key from your .env file
const {
	ACCOUNT_1_PRIVATE_KEY,
	ACCOUNT_1_ID,
	ACCOUNT_2_PRIVATE_KEY,
	ACCOUNT_2_ID,
	ACCOUNT_3_PRIVATE_KEY,
	ACCOUNT_3_ID,
	INITIAL_SUPPLY,
	IPFS_METADATA_DIR_HASH,
} = process.env;

let CONTRACT_ID;
let TOKEN_ADDRESS;
let TOKEN_ID;

const main = async () => {
	if (!CONTRACT_ID) {
		await deployManagerContract();
		await createNFT();
	} else if (CONTRACT_ID && !TOKEN_ID) {
		await createNFT();
	}
	await mintNFTs();
	await associateNFT();
	await transferNFT();
	// await transferNFTWithSDK();

	process.exit();
};

//To create client object
const getClient = async () => {
	// If we weren't able to grab it, we should throw a new error
	if (ACCOUNT_1_ID == null || ACCOUNT_1_PRIVATE_KEY == null) {
		throw new Error(
			'Environment variables ACCOUNT_1_ID and ACCOUNT_1_PRIVATE_KEY must be present'
		);
	}

	// Create our connection to the Hedera network
	return Client.forTestnet().setOperator(ACCOUNT_1_ID, ACCOUNT_1_PRIVATE_KEY);
};

const deployManagerContract = async () => {
	const client = await getClient();

	//Extracting bytecode from compiled code
	const bytecode = contractJSON.bytecode;

	//Create the transaction
	const contractCreation = new ContractCreateFlow()
		.setContractMemo('Soulbound NFT Manager')
		.setGas(4000000)
		.setBytecode(bytecode)
		.setAdminKey(PrivateKey.fromString(ACCOUNT_1_PRIVATE_KEY));

	//Sign the transaction with the client operator key and submit to a Hedera network
	const txResponse = await contractCreation.execute(client);

	//Get the receipt of the transaction
	const receipt = await txResponse.getReceipt(client);

	//Get the new contract ID
	CONTRACT_ID = receipt.contractId;

	console.log(`The contract ID is ${CONTRACT_ID} \n`);
};

const createNFT = async () => {
	const client = await getClient();

	//Create the transaction to call function1
	const firstFunctionExecution = new ContractExecuteTransaction()
		//Set the ID of the contract
		.setContractId(CONTRACT_ID)
		//Set the gas for the contract call
		.setGas(4000000)
		.setPayableAmount(50)
		//Set the contract function to call
		.setFunction(
			'createNft',
			new ContractFunctionParameters()
				.addString('Test Name')
				.addString('TN')
				.addString('TestMemo')
				.addInt64(7776000)
		);

	//Submit the transaction to a Hedera network and store the response
	const createTokenTx = await firstFunctionExecution.execute(client);

	const createTokenRx = await createTokenTx.getRecord(client);

	TOKEN_ADDRESS = '0x' + createTokenRx.contractFunctionResult.getAddress(0);
	console.log('Token Solidity Address:', TOKEN_ADDRESS);

	TOKEN_ID = AccountId.fromSolidityAddress(TOKEN_ADDRESS);
	console.log('Token ID:', TOKEN_ID.toString());
};

const mintNFTs = async () => {
	const batchSize = 10;
	const client = await getClient();
	let metadata = [];
	for (let i = 1; i <= INITIAL_SUPPLY; i++) {
		metadata.push(Buffer.from(`ipfs://${IPFS_METADATA_DIR_HASH}/${i}.json`));
	}

	for (let i = 0; i < metadata.length; i += batchSize) {
		const metadataBatch = metadata.slice(i, i + batchSize);

		// Mint NFT
		const mintToken = new ContractExecuteTransaction()
			.setContractId(CONTRACT_ID)
			.setGas(4000000)
			.setMaxTransactionFee(new Hbar(20)) //Use when HBAR is under 10 cents
			.setFunction(
				'mintNft',
				new ContractFunctionParameters()
					.addAddress(TOKEN_ADDRESS) // Token address
					.addBytesArray(metadataBatch) // Metadata
			);

		const mintTokenTx = await mintToken.execute(client);
		const mintTokenRx = await mintTokenTx.getRecord(client);
		const serial = mintTokenRx.contractFunctionResult.getInt64(0);

		console.log(
			`Minted NFTs with serial number from ${serial} to ${
				Number(serial) + batchSize - 1
			} \n`
		);
	}
};

const associateNFT = async () => {
	const client = await getClient();

	const associateBuyerTx = await new TokenAssociateTransaction()
		.setAccountId(ACCOUNT_3_ID)
		.setTokenIds([TOKEN_ID])
		.freezeWith(client)
		.sign(PrivateKey.fromString(ACCOUNT_3_PRIVATE_KEY));

	const associateBuyerTxSubmit = await associateBuyerTx.execute(client);

	const associateBuyerRx = await associateBuyerTxSubmit.getReceipt(client);

	console.log(`Token association with the other account: ${associateBuyerRx.status} \n`);
};

const transferNFT = async () => {
	const client = await getClient();
	// Transfer NFT to Alice
	const transferToken = new ContractExecuteTransaction()
		.setContractId(CONTRACT_ID)
		.setGas(4000000)
		.setFunction(
			'transferNft',
			new ContractFunctionParameters()
				.addAddress(TOKEN_ADDRESS) // Token address
				.addAddress(AccountId.fromString(ACCOUNT_2_ID).toSolidityAddress()) // Token receiver (Alice)
				.addInt64(2)
		); // NFT serial number
	// .freezeWith(client) // freezing using client
	// .sign(PrivateKey.fromString(ACCOUNT_2_PRIVATE_KEY)); // Sign transaction with Alice

	const transferTokenTx = await transferToken.execute(client);
	const transferTokenRx = await transferTokenTx.getReceipt(client);

	console.log(`Transfer status: ${transferTokenRx.status} \n`);
};

const transferNFTWithSDK = async () => {
	const client = await getClient();
	// Transfer NFT to Alice
	const transaction = new TransferTransaction()
		.addNftTransfer(TOKEN_ID, 1, ACCOUNT_2_ID, ACCOUNT_3_ID)
		.freezeWith(client);

	//Sign with the supply private key of the token
	const signTx = await transaction.sign(PrivateKey.fromString(ACCOUNT_2_PRIVATE_KEY));

	//Sign with the account 3 private key of the token
	// const signedTx = await signTx.sign(PrivateKey.fromString(ACCOUNT_3_PRIVATE_KEY));

	//Submit the transaction to a Hedera network
	const txResponse = await signTx.execute(client);

	//Request the receipt of the transaction
	const receipt = await txResponse.getReceipt(client);

	//Get the transaction consensus status
	const transactionStatus = receipt.status;
	console.log('The transaction consensus status ' + transactionStatus.toString());
	console.log('The transaction Id ' + txResponse.transactionId.toString());
};

main();
