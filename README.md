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

