# Hedera Soulbound Token without HTS

## Contracts

### HSNFT Contract

This is a solidity language ERC-721 standard token contract. It is a **Soulbound** token, means once it is attested with a wallet then it can't be transferred. But it can be burned. Initially tokens will be minted to admin. Admin can attest it with any wallet. Also supply is infinite.

## Scripts

### Utils

All the helper functions used in the scripts

### Scripts

Scripts to to different operations

1. **1_initialSetup**: Generate random images and metadata. Upload to IPFS and return the IPFS folder hash.
2. **2_mintTokens**: Deploy contract to Hedera. Mint initial supply to admin/owner.
3. **3_updatePreparation**: Select random tokens from initial supply. Generate new images for them. Update that on metadata. Upload everything to IPFS.
4. **4_updateTokens**: Update the selected token's metadata.

## Tools and Framework

### Versions used

- Ubuntu - 22.04.2 LTS
- Git - 2.34.1
- NodeJs - v16.14.2
- Node Package Manager(NPM) - 8.5.0
- Hardhat - 2.14.0
- Solidity - 0.8.15

## Initial Setup

1. Clone Repo from https://github.com/prasanthdotv/hedera-soulbound-nft.git
2. Open Terminal
3. Run `git checkout without-hts` in the contract project folder
4. run `npm install` to install the dependencies.

## Configurations

### Environment variables

In order to run the scripts, there are certain values to be set in environment variable. Make a copy of `sample.env` and rename it as `.env`.
Add the required fields. Update it once you run each scripts.
