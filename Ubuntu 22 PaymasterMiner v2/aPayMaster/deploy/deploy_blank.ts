import { writeFile } from 'fs';

import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as fs from 'fs';
import * as fs2 from 'fs/promises';

import * as path from 'path';
import { BigNumber } from 'ethers';

// Put the address of the deployed paymaster here
const PAYMASTER_ADDRESS = "0x7704484E22bD429c0fDE0049e09c65F856D777da";

// Put the address of the deployed paymaster here
var TOKEN_ADDRESS = "0x9EF042fCc41569d94a0d0Ba6B050cdA75cC9B971";


function getToken(hre: HardhatRuntimeEnvironment, wallet: Wallet) {
const zkBitcoinABI = [
		{
        "inputs": [
            {
                "internalType": "uint256",
                "name": "minAmt",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "mintToAddress",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "nonce",
                "type": "uint256[]"
            },
            {
                "internalType": "bytes32[]",
                "name": "challengeNumber2",
                "type": "bytes32[]"
            }
        ],
        "name": "multiMint_SameAddress_Min_Mined",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
	{
        "inputs": [
            {
                "internalType": "uint256",
                "name": "minAmt",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "mintToAddress",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "nonce",
                "type": "uint256[]"
            },
            {
                "internalType": "bytes32[]",
                "name": "challengeNumber2",
                "type": "bytes32[]"
            }
        ],
        "name": "multiMint_SameAddress_EZ_Min_Mined",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
	   {
        "constant": true,
        "inputs": [
            {
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
	 {
        "inputs": [],
        "name": "blocksToReadjust",
        "outputs": [
            {
                "internalType": "uint",
                "name": "blocks",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }

];

  return new ethers.Contract(TOKEN_ADDRESS, zkBitcoinABI, wallet);
}


interface Config {
  privateKey: string;
  minerAddress: string;
  contractAddress: string;
  // ... other properties if needed
}

function readConfig(filePath: string): Promise<Config> {
  try {
	const fileContent = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(fileContent) as Config;

    // Extract and return the specific properties
    return {
      privateKey: config.privateKey,
      minerAddress: config.minerAddress,
      contractAddress: config.contractAddress
    };
  } catch (error) {
    console.error('Error reading the config file:', error);
    throw error;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function (hre: HardhatRuntimeEnvironment) {
console.log("Setup working");
writeFile('deploy/SetupWorking.txt', '1', err => {
    if (err) console.error('Error:', err);
    else console.log('File saved.');
});
}

