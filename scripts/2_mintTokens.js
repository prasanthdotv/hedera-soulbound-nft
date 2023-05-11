const { deployContract, mintNFTs } = require('./utils');

const main = async () => {
	console.log('Deploying NFT Contract...');
	const CONTRACT_ID = await deployContract();

	console.log('Minting initial supply to owner...');
	await mintNFTs(CONTRACT_ID);

	process.exit();
};

main();
