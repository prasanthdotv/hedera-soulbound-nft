const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { INITIAL_SUPPLY, IPFS_IMAGE_DIR_HASH } = process.env;

const tiers = ['Gold', 'Silver', 'Bronze'];
const balances = [10, 100];

const tierLimits = {
	Gold: 20,
	Silver: 30,
	Bronze: 50,
};

const balanceLimits = {
	10: 50,
	100: 50,
};

const main = async () => {
	await createJSONFile(INITIAL_SUPPLY);
};

const createJSONFile = async (count) => {
	for (let i = 1; i <= count; i++) {
		let tier, balance;
		let fileName = `${i}.json`;

		do {
			tier = tiers[Math.floor(Math.random() * tiers.length)];
		} while (tierLimits[tier] <= 0);

		do {
			balance = balances[Math.floor(Math.random() * balances.length)];
		} while (balanceLimits[balance] <= 0);

		tierLimits[tier]--;
		balanceLimits[balance]--;

		const fileContent = {
			name: `Hedera Soulbound Token ${i}`,
			creator: 'prasanthdotv',
			description: 'Lorum Ipsum',
			type: 'image/jpg',
			format: 'none',
			properties: {
				tier,
				balance,
			},
			image: `ipfs://${IPFS_IMAGE_DIR_HASH}/${i}.jpg`,
		};

		const fileDir = './static/metadata';
		const filePath = path.join(fileDir, fileName);

		fs.mkdirSync(fileDir, { recursive: true });
		fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));

		console.log(`Created JSON file: ${fileName}`);
	}
};

main();
