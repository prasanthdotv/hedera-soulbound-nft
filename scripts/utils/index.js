const { generateImage } = require('./imageGenerator');
const { uploadFolderToIPFS } = require('./ipfsFoldeUploader');
const { generateMetadata } = require('./metadataGenerator');
const { updateMetadata } = require('./metadataUpdater');
const { getClient } = require('./client');
const { deployContract } = require('./contractDeployer');
const { mintNFTs } = require('./tokenMinter');
const { updateToken } = require('./tokenUpdater');
const { getMetadata } = require('./tokenMetadataReader');

module.exports = {
	generateImage,
	uploadFolderToIPFS,
	generateMetadata,
	updateMetadata,
	getClient,
	deployContract,
	mintNFTs,
	updateToken,
	getMetadata,
};
