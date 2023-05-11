// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

import './utils/ExpiryHelper.sol';
import './utils/HederaResponseCodes.sol';
import './utils/HederaTokenService.sol';
import './utils/IHederaTokenService.sol';
import './utils/KeyHelper.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract HederaSoulboundNFTManager is
	Ownable,
	ExpiryHelper,
	KeyHelper,
	HederaTokenService
{
	function createNft(
		string memory name,
		string memory symbol,
		string memory memo,
		int64 autoRenewPeriod
	) external payable onlyOwner returns (address) {
		IHederaTokenService.TokenKey[] memory keys = new IHederaTokenService.TokenKey[](4);
		// Set this contract as supply for the token
		keys[0] = getSingleKey(KeyType.ADMIN, KeyValueType.CONTRACT_ID, address(this));
		keys[1] = getSingleKey(KeyType.SUPPLY, KeyValueType.CONTRACT_ID, address(this));
		keys[2] = getSingleKey(KeyType.FREEZE, KeyValueType.CONTRACT_ID, address(this));
		keys[3] = getSingleKey(KeyType.WIPE, KeyValueType.CONTRACT_ID, address(this));

		IHederaTokenService.HederaToken memory token;
		token.name = name;
		token.symbol = symbol;
		token.memo = memo;
		token.treasury = address(this);
		token.tokenSupplyType = false;
		token.tokenKeys = keys;
		token.freezeDefault = true;
		token.expiry = createAutoRenewExpiry(address(this), autoRenewPeriod); // Contract auto-renews the token
		(int responseCode, address createdToken) = HederaTokenService.createNonFungibleToken(
			token
		);

		require(
			responseCode == HederaResponseCodes.SUCCESS,
			'Failed to create non-fungible token'
		);

		return createdToken;
	}

	function mintNft(
		address token,
		bytes[] memory metadata
	) external onlyOwner returns (int64) {
		(int response, , int64[] memory serial) = HederaTokenService.mintToken(
			token,
			0,
			metadata
		);

		require(response == HederaResponseCodes.SUCCESS, 'Failed to mint non-fungible token');

		return serial[0];
	}

	function transferNft(
		address token,
		address receiver,
		int64 serial
	) external onlyOwner returns (int) {
		HederaTokenService.unfreezeToken(token, receiver);
		int response = HederaTokenService.transferNFT(token, address(this), receiver, serial);

		require(
			response == HederaResponseCodes.SUCCESS,
			'Failed to transfer non-fungible token'
		);
		HederaTokenService.freezeToken(token, receiver);
		return response;
	}
}
