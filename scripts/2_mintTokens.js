// Import necessary functions from the './utils' module
const { deployContract, mintNFTs } = require('./utils');

// Define the main function
const main = async () => {
	try {
		// Deploy the NFT contract
		console.log('Deploying NFT Contract...');
		const CONTRACT_ID = await deployContract();
		// Mint initial supply of NFTs to owner
		console.log('Minting initial supply to owner...');
		await mintNFTs(CONTRACT_ID);
	} catch (error) {
		// Handle any errors that occur during contract deployment or token minting
		console.log('Token minting failed :', error);
	}

	// Exit the process once the script completes
	process.exit();
};

// Call the main function to begin script execution
main();
