# Rasozon

## Created Using

- Solidity -> Writing Smart Contracts & Tests
- Javascript -> React & Testing
- Hardhat -> Development Framework
- Ethers.js -> Blockchain Interaction)
- React.js -> Frontend Framework

## Requirements For Initial Setup
### Seeting up the Environment

#### Insatalling Node.js
Ubuntu
~~~
sudo apt update
sudo apt install curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
~~~

MacOS
~~~
brew install git
git config --global user.name "Emma Paris"
git config --global user.email "eparis@atlassian.com"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install 20
nvm use 20
nvm alias default 20
npm install npm --global # Upgrade npm to the latest version
~~~

Windows (WSL2)
~~~
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
nvm install --lts
nvm install node
~~~
For detail : 
~~~
https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl
~~~

#### Upgrading Node.js installation
Ubuntu 
~~~
sudo apt remove nodejs
// Find the version pf Node.js that you want to install from -> https://github.com/nodesource/distributions#debinstall
sudo apt update && sudo apt install nodejs
~~~

MacOs
~~~
nvm install 20
nvm use 20
nvm alias default 20
npm install npm --global # Upgrade npm to the latest version
~~~

## Creating a new Hardhat Project 
### Writing smart contracts
~~~
mkdir hardhat-tutorial
cd hardhat-tutorial
npm init
// Install Hardhat:
npm install --save-dev hardhat
// In the same directory where you installed Hardhat run:
npx hardhat init
~~~
Create an empty hardhat.config.js
![image](https://github.com/Sourabh-Kumar04/Rasozon/assets/155216316/40ab6525-36e5-47ac-8806-f542a8aff8fa)

~~~
npm install --save-dev @nomicfoundation/hardhat-toolbox
~~~

## Writing smart contracts
~~~
mkdir contracts
cd contracts
nano Rasozon.sol
~~~

Paste the below code in Rasozon.sol
~~~
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Rasozon {
	// Code goes here...
	address public owner;
	
	struct Item {
		uint256 id;
		string name;
		string category;
		string image;	
		uint256 cost;
		uint256 rating;
		uint256 stock;
	}

	struct Order {
		uint256 time;
		Item item;
	}

	
	mapping(uint256 => Item) public items;
	mapping (address => uint256) public orderCount;
	mapping (address => mapping(uint256 => Order)) public orders;


	event Buy(address buyer, uint256 orderId, uint256 itemId);
	event List(string name, uint256 cost, uint256 quantity) ;

	
	modifier onlyOwner() {
		require(msg.sender == owner);
		_;
	}

	constructor () {
		owner = msg.sender;
	}

	// List Products
	function list(
		uint256 _id, 
		string memory _name, 
		string memory _category,
		string memory _image,
		uint256 _cost,
		uint256 _rating,
		uint256 _stock
	) public onlyOwner {

		// Create Item Struct
		Item memory item = Item(
			_id,
			_name, 
			_category, 
			_image, 
			_cost, 
			_rating, 
			_stock
		);		
		

		// Save Items Struct to blockchain
		items[_id] = item;

		// Emit on event
		emit List(_name, _cost, _stock);
		
	}	


	// Buy Products
	function buy(uint256 _id) public payable {
		// Fetch Item 
		Item memory item = items[_id];
	
		// Require enough ether to  buy item
		require(msg.value >= item.cost);

		// Require item is in stock
		require(item.stock > 0);

		// Create an Order
		Order memory order = Order(block.timestamp, item);

		// Save order to chain
		orderCount[msg.sender]++;   // <-- Order ID
		orders[msg.sender][orderCount[msg.sender]] = order;

		// Substract stock
		items[_id].stock = item.stock - 1;

		
		// Emit event
		emit Buy(msg.sender, orderCount[msg.sender], item.id);
	}


	// Withdraw Funds
	function withdraw() public onlyOwner {
		(bool success, ) = owner.call{ value: address(this).balance }("");
		require(success);
	}
}
~~~

### Compiling contracts
~~~
npx hardhat compile
~~~
Output:
~~~
Compiled 1 Solidity file successfully (evm target: paris).
~~~

## Testing contracts
~~~
mkdir test
cd test
nano Rasozon.js
~~~

Paste the below code in Rasozon.js
~~~
const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Rasozon", () => {
	let rasozon
	let deployer, buyer

	beforeEach(async () => {
		// Setup Accounts
		[deployer, buyer] = await ethers.getSigners()


		// Deploy contract
		const Rasozon = await ethers.getContractFactory("Rasozon")
		rasozon = await Rasozon.deploy()
	})

	// Global constants for listing an item...
	const ID = 1
        const NAME = "Shoes"
        const CATEGORY = "Clothing"
        const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
        const COST = tokens(1)
        const RATING = 4
        const STOCK = 5


	describe("Deployment", () => {
	it("Sets the owner", async () => {
		expect(await rasozon.owner()).to.be.equal(deployer.address)
	})
      	})

	describe("Listing", () => {
	let transaction

	beforeEach(async () => {
		transaction = await rasozon.connect(deployer).list(
			ID,
			NAME,
			CATEGORY,
			IMAGE,
			COST,
			RATING,
			STOCK
		)

		await transaction.wait()
	})

	it("Returns item attribute", async () => {
		const item = await rasozon.items(1)

		expect(item.id).to.equal(ID)
		expect(item.name).to.equal(NAME)
		expect(item.category).to.equal(CATEGORY)
		expect(item.image).to.equal(IMAGE)
		expect(item.cost).to.equal(COST)
		expect(item.rating).to.equal(RATING)
		expect(item.stock).to.equal(STOCK)

	})

	it("Emit List event", () => {
		expect(transaction).to.emit(rasozon, "List")
	})
	})

	describe("Buying", async => {
	let transaction

	beforeEach(async () => {
		// Listing an item 
		transaction = await rasozon.connect(deployer).list(ID, NAME ,CATEGORY, IMAGE, COST, RATING, STOCK)
		await transaction.wait()

		//  Buy an item 
		transaction = await rasozon.connect(buyer).buy(ID, { value: COST })
	})

	it("Update the buyer's order count", async () => {
		const result = await rasozon.orderCount(buyer.address)
		expect(result).to.equal(1)
	})

	it("Adds the order", async () => {
		const order = await rasozon.orders(buyer.address, 1)

		expect(order.time).to.be.greaterThan(0)
		expect(order.item.name).to.equal(NAME)
	})

	it("Update the contract balance", async () => {
                const result = await ethers.provider.getBalance(rasozon.address)
                expect(result).to.equal(COST)
        })

	it("Emits Buy event", ()=> {
		expect(transaction).to.be.emit(rasozon, "Buy")
	})
	})

	describe("Withdrawing" , () => {
	let balanceBefore

	beforeEach(async () => {
		//List a item
		let transaction = await rasozon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
		await transaction.wait()

		// Buy a item
		transaction = await rasozon.connect(buyer).buy(ID, { value: COST })
		await transaction.wait()

		// Get Deployer balance before
		balanceBefore = await ethers.provider.getBalance(deployer.address)

		// Withdraw 
		transaction = await rasozon.connect(deployer).withdraw()
		await transaction.wait()
	})

	it("Update the owner balance", async () => {
		const balanceAfter = await ethers.provider.getBalance(deployer.address)
		expect(balanceAfter).to.be.greaterThan(balanceBefore)
	})

	it("Updates the contract balance", async () => {
		const result = await ethers.provider.getBalance(rasozon.address)
		expect(result).to.equal(0)
	})

	})
})
~~~

~~~
npx hardhat test
~~~
Outout: 
~~~
  Token contract
~~~

## Deploying to a live network
~~~
mkdir scripts
cd scripts
nano deploy.js
~~~

Paste the below code in deploy.js:
~~~
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const { items } = require("../src/items.json")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {

	// Setup accounts
	const [deployer] = await ethers.getSigners()

	// Deployer Rasozon
	const Rasozon = await hre.ethers.getContractFactory("Rasozon")
        const rasozon = await Rasozon.deploy()
	await rasozon.deployed()

	console.log(`Deployed Rasozon Contract at: ${rasozon.address} \n`);

	// List  items...
	for (let i =  0; i < items.length; i++) {
		const transaction = await rasozon.connect(deployer).list(
			items[i].id,
			items[i].name,
			items[i].category,
			items[i].image,
			tokens(items[i].price),
			items[i].rating,
			items[i].stock
		)

		await transaction.wait()

		console.log(`Listed item ${items[i].id}: ${items[i].name}`)
	}

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
~~~

~~~
npx hardhat scripts deploy ./scripts/deploy.js --network <network-name>
~~~

### Deploying to remote network
Add network entry to your "hardhat.config.js"
~~~

require("@nomicfoundation/hardhat-toolbox");

// Ensure your configuration variables are set before executing the script
const { vars } = require("hardhat/config");

// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and add it to the configuration variables
const INFURA_API_KEY = vars.get("INFURA_API_KEY");

// Add your Sepolia account private key to the configuration variables
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

module.exports = {
  solidity: "0.8.17",
	network: {
		sepolia: {
			chainId: 11155111,
			url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
			accounts: [`0x5d4c6a6d700bfdb692acd627db506f50b9de4489560c5bd0679324f4155e62a7`],
		},
	},
};
~~~

Finally Run: 
~~~
npx hardhat scripts deploy ./scripts/deploy.js --network sepolia
~~~





## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Run tests
`$ npx hardhat test`

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run deployment script
In a separate terminal execute: 
- for localhost
`$ npx hardhat run ./scripts/deploy.js --network localhost`
- for live network (Sepolia)
`$ npx hardhat run ./scripts/deploy.js --network sepolia`


### 6. Start frontend
`$ npm run start`

## Draw.io
![image](https://github.com/Sourabh-Kumar04/Rasozon/assets/155216316/95411e24-9b40-4b7f-8473-1c2142eca601)

## Dapps
![image](https://github.com/Sourabh-Kumar04/Rasozon/assets/155216316/29ffba82-553f-4b95-8615-105244073f5a)

## Code
### Solidity Code
[Rasozon.sol](https://github.com/Sourabh-Kumar04/Rasozon/blob/master/contracts/Rasozon.sol)


### Test
[Rasozon.js](https://github.com/Sourabh-Kumar04/Rasozon/blob/master/test/Rasozon.js)

### Deploy
[deploy.js](https://github.com/Sourabh-Kumar04/Rasozon/blob/master/contracts/test/deploy.js)

