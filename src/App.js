import React from 'react'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Rasozon from './abis/Rasozon.json'

// Config
import config from './config.json'

function App() {
    const [provider, setProvider] = useState(null)
    const [rasozon, setRasozon] = useState(null)

    const [account, setAccount] = useState(null)

    const [electronics, setElectronics] = useState(null)
    const [clothing, setClothing] = useState(null)
    const [toys, setToys] = useState(null)

    const [item, setItem] =useState({})
    const [toggle, setToggle] = useState(false)

    const togglePop = (item) =>{
	setItem(item)
	toggle ? setToggle(false): setToggle(true)
    }

    const loadBlockchainData = async () => {
	// Connect to blockcahin
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	setProvider(provider)

	const network = await provider.getNetwork()
	console.log(network)

	// Connect to Smart Contracts
	const rasozon = new ethers.Contract(
		config[network.chainId].rasozon.address,
		Rasozon,
		provider
	)
	setRasozon(rasozon)

	// Load products
	const items = []
	for (var i = 0; i < 9; i++) {
		const item = await rasozon.items(i + 1)
		items.push(item)
	}

	const electronics = items.filter((item) => item.category === 'electronics')
	const clothing = items.filter((item) => item.category === 'clothing')
	const toys = items.filter((item) => item.category === 'toys')

	setElectronics(electronics)
	setClothing(clothing)
	setToys(toys)

    }

    useEffect(() => {
        loadBlockchainData()
    }, [])


  return (

    <div>

      <Navigation account={account} setAccount={setAccount} />

      <h2>Rasozon Best Sellers</h2>

      {electronics && clothing && toys && (
	<>
   	<Section title={"Clothing & jewelery"} items={clothing} togglePop={togglePop} />
	<Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
	<Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
	</>
      )}

      {toggle && (
      	<Product item={item} provider={provider} account={account} rasozon={rasozon} togglePop={togglePop} />
       )}

    </div>
  );
}

export default App;

