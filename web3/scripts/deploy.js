

// const hre = require('hardhat');

// async function main() {
//     const [deployer] = await hre.ethers.getSigners();

//     console.log('Deploying contracts with the account:', deployer.address);

//     // Deploy Token contract
//     const Token = await hre.ethers.getContractFactory('PAPCoin');
//     const token = await Token.deploy();
//     await token.deployed();

//     // Deploy USDC contract
//     const USDC = await hre.ethers.getContractFactory('PAPUSDC');
//     const usdc = await USDC.deploy();
//     await usdc.deployed();

//     // Deploy UserAccountData contract
//     const UserAccountData = await hre.ethers.getContractFactory('UserAccountData');
//     const userAccountData = await UserAccountData.deploy(token.address);
//     await userAccountData.deployed();

//     // Deploy LendingPool contract
//     const LendingPool = await hre.ethers.getContractFactory('LendingPool');
//     const lendingPool = await LendingPool.deploy(token.address, usdc.address, userAccountData.address);
//     await lendingPool.deployed();

//     console.log('Token deployed to:', token.address);
//     console.log('USDC deployed to:', usdc.address);
//     console.log('UserAccountData deployed to:', userAccountData.address);
//     console.log('LendingPool deployed to:', lendingPool.address);
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });


const hre = require('hardhat');

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    // Deploy Token contract
    const Token = await hre.ethers.getContractFactory('PAPCoin');
    const token = await Token.deploy();
    await token.deployed();
    await hre.run("verify:verify", {
      address: token.address,
      constructorArguments: [],
    });

    // Deploy USDC contract
    const USDC = await hre.ethers.getContractFactory('PAPUSDC');
    const usdc = await USDC.deploy();
    await usdc.deployed();
    await hre.run("verify:verify", {
      address: usdc.address,
      constructorArguments: [],
    });

    // Deploy UserAccountData contract
    const UserAccountData = await hre.ethers.getContractFactory('UserAccountData');
    const userAccountData = await UserAccountData.deploy(token.address);
    await userAccountData.deployed();
    await hre.run("verify:verify", {
      address: userAccountData.address,
      constructorArguments: [token.address],
    });

    // Deploy LendingPool contract
    const LendingPool = await hre.ethers.getContractFactory('LendingPool');
    const lendingPool = await LendingPool.deploy(token.address, usdc.address, userAccountData.address);
    await lendingPool.deployed();
    await hre.run("verify:verify", {
      address: lendingPool.address,
      constructorArguments: [token.address, usdc.address, userAccountData.address],
    });

    console.log('Token deployed to:', token.address);
    console.log('USDC deployed to:', usdc.address);
    console.log('UserAccountData deployed to:', userAccountData.address);
    console.log('LendingPool deployed to:', lendingPool.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });