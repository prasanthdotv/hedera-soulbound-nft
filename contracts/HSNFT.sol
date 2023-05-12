// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * @title HederaSoulboundNFT
 * @dev This contract implements the ERC721 soulbound non-fungible tokens,
 *      with URI storage functionality and is owned by a designated address.
 */
contract HederaSoulboundNFT is ERC721, ERC721URIStorage, Ownable {
	event Attest(address indexed to, uint256 indexed tokenId);
	event Revoke(address indexed to, uint256 indexed tokenId);

	/**
	 * @dev Constructs a new instance of the HederaSoulboundNFT contract
	 *      with a name as "Hedera Soulbound NFT" and symbol as "HSNFT".
	 */
	constructor() ERC721('Hedera Soulbound NFT', 'HSNFT') {}

	/**
	 * @dev Burns a specific token.
	 * @param tokenId uint256 ID of the token being burned
	 * Requirements:
	 * - The caller must be the owner of the token being burned.
	 */
	function burn(uint256 tokenId) external {
		require(ownerOf(tokenId) == msg.sender, 'Only owner of the token can burn it');
		_burn(tokenId);
	}

	/**
	 * @dev Revokes a specific token.
	 * @param tokenId uint256 ID of the token being revoked
	 * Requirements:
	 * - Only the contract owner can revoke the token.
	 */
	function revoke(uint256 tokenId) external onlyOwner {
		_burn(tokenId);
	}

	/**
	 * @dev Updates a specific token URI.
	 * @param tokenId uint256 ID of the token being updated
	 * @param uri string URI to assign
	 * Requirements:
	 * - Only the contract owner can update the token URI.
	 */
	function updateTokenURI(uint256 tokenId, string memory uri) external onlyOwner {
		_setTokenURI(tokenId, uri);
	}

	/**
	 * @dev Transfers token to another address.
	 * @param to The address of the recipient for the token transfer.
	 * @param tokenId The ID of the token to be transferred.
	 */
	function transfer(address from, address to, uint256 tokenId) public {
		_transfer(from, to, tokenId);
	}

	/**
	 * @dev Safely mints a new NFT and assigns its `tokenId` to `to`, updating metadata at the given URI.
	 * @param tokenId uint256 ID of the token to be minted
	 * @param to address of the future owner of the token
	 * @param uri string URI representing the metadata for the newly-minted token
	 * Requirements:
	 * - Only the contract owner can mint a new token.
	 * Returns:
	 * - The `tokenId` that was created during the minting process.
	 */
	function safeMint(
		uint256 tokenId,
		address to,
		string memory uri
	) public onlyOwner returns (uint256) {
		_safeMint(to, tokenId);
		_setTokenURI(tokenId, uri);
		return tokenId;
	}

	/**
	 * @dev Overrides the default tokenURI() function from ERC721URIStorage.sol to provide metadata for a given token ID.
	 * @param tokenId uint256 ID of the token whose metadata is being queried
	 * Returns:
	 * - The metadata associated with the given `tokenId`.
	 */
	function tokenURI(
		uint256 tokenId
	) public view override(ERC721, ERC721URIStorage) returns (string memory) {
		return super.tokenURI(tokenId);
	}

	/**
	 * @dev Hook function called by the ERC721 contract before a token is transferred.
	 * Throws an error if the transfer is not allowed.
	 * @param from address of the sender
	 * @param to address of the recipient
	 * Requirements:
	 * - Transfer must be mint, burn or initial transaction from contract owner
	 * Throws:
	 * - Error if transfer is not allowed.
	 */
	function _beforeTokenTransfer(
		address from,
		address to,
		uint256,
		uint256
	) internal view override {
		require(
			from == address(0) || from == owner() || to == address(0),
			'Not allowed to transfer token'
		);
	}

	/**
	 * @dev Hook function called by the ERC721 contract after a token is transferred.
	 * Emits an `Attest` event if the sender was the owner, or a `Revoke` event if the recipient is 0x0.
	 * @param from address of the sender
	 * @param to address of the recipient
	 * @param firstTokenId uint256 ID of the first token being transferred
	 * Requirements: None
	 * Throws: Nothing
	 */
	function _afterTokenTransfer(
		address from,
		address to,
		uint256 firstTokenId,
		uint256
	) internal override {
		if (from == owner()) {
			emit Attest(to, firstTokenId);
		} else if (to == address(0)) {
			emit Revoke(to, firstTokenId);
		}
	}

	/**
	 * @dev Deletes a given token from the system by overriding the internal `_burn` function of the parent ERC721 and ERC721URIStorage contracts.
	 * The caller must be an authorized owner. Emits a `Transfer` event on successful execution.
	 * @param tokenId uint256 ID of the token being burned
	 */
	function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
		super._burn(tokenId);
	}
}
