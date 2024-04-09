require('@nomiclabs/hardhat-ethers');
require('dotenv').config();
require('@nomicfoundation/hardhat-verify');
module.exports = {
    defaultNetwork: 'scrollSepolia',
    networks: {
        hardhat: {},
        scrollSepolia: {
            url: 'https://scroll-testnet.rpc.grove.city/v1/a7a7c8e2' || 'https://sepolia-rpc.scroll.io/' || '',
            accounts: {
                mnemonic: process.env.MNEMONIC || '',
                path: "m/44'/60'/0'/0",
                initialIndex: 2,
                count: 20,
                passphrase: '',
            },
        },
    },
    etherscan: {
        apiKey: {
            scrollSepolia: process.env.SCROLLSCAN,
        },
        customChains: [
            {
                network: 'scrollSepolia',
                chainId: 534351,
                urls: {
                    apiURL: 'https://api-sepolia.scrollscan.com/api',
                    browserURL: 'https://sepolia.scrollscan.com/',
                },
            },
        ],
    },
    sourcify: {
        enabled: false,
    },
    solidity: {
        version: '0.8.24',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    paths: {
        sources: './contracts',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
    mocha: {
        timeout: 40000,
    },
};
