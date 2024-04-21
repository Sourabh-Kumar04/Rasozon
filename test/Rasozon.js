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


