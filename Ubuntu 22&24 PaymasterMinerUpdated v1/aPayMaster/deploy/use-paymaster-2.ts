import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as fs from 'fs';
import * as fs2 from 'fs/promises';

import * as path from 'path';
import { BigNumber } from 'ethers';
var _BLOCKS_PER_READJUSTMENT = 64;
// Put the address of the deployed paymaster here
var PAYMASTER_ADDRESS = "0x7704484E22bD429c0fDE0049e09c65F856D777da";

// Put the address of the deployed paymaster here
var TOKEN_ADDRESS = "0x9EF042fCc41569d94a0d0Ba6B050cdA75cC9B971";


// Global error handlers
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Additional logic for handling the exception
    // Be cautious about not exiting, the application state might be unstable
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Additional logic for handling the rejection
});


function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(new Error(`Timed out in ${ms} ms.`));
    }, ms);

    promise.then(resolve).catch(reject).finally(() => clearTimeout(id));
  });
}



async function getToken(hre: HardhatRuntimeEnvironment, wallet: Wallet) {
const zkBitcoinABI = [
		{
        "inputs": [
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
        "name": "multiMint_SameAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
	{
        "inputs": [	
            {
                "internalType": "address",
                "name": "mintToAddress",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "nonce",
                "type": "uint256[]"
            }
        ],
        "name": "multiMint_PayMaster_EZ",
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
    },
	    {
        "constant": true,
        "inputs": [
            {
                "name": "_requiredETH",
                "type": "uint256"
            }
        ],
        "name": "findMinimumGoodLoops",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
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
  contractAddressPayMaster: string;
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
      contractAddress: config.contractAddress,
      contractAddressPayMaster: config.contractAddressPayMaster
    };
  } catch (error) {
    console.error('Error reading the config file:', error);
    throw error;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to control retries of the main function
export default async function (hre: HardhatRuntimeEnvironment) {
    let retryDelay = 15000; // Delay between retries in milliseconds
    let attempt = 0;

    
        try {
            await retryMain(hre);
            console.log('Main function succeeded');
         } catch (error) {
            console.error(`Attempt ${attempt + 1} failed: `, error);
            attempt++;
            await sleep(retryDelay); // Wait for a bit before retrying
        }
    
}

async function retryMain(hre: HardhatRuntimeEnvironment) {
var DuplicateAnswerAttempts = 0;
var gasLimitBump = 86;
    let attempt = 0;
var newNonces = false;
var trim = 0
 while (true) {
				 // to prevent infinite loop
				 if(attempt > 150){
					break;
				}
					attempt = attempt +1;

				const filePath3 = path.join(__dirname, '..', '..', 'aDataToMintHexNonce.txt');

				const filePath2 = path.join(__dirname, '..', '..', 'aDataToMintHexChallenge.txt');

				var data2zzzz;
if(!newNonces){
//console.log("Normal Digest minting");

				try {
					// Read the file content
					const fileContent = fs.readFileSync(filePath2, 'utf8');

					// Split the content into individual hex strings
					const hexStrings = fileContent.split(', ');
				data2zzzz = hexStrings;
				
					// Process each hex string
					hexStrings.forEach(hexString => {
						console.log(hexString);
						// Perform additional processing if needed
					    fs.unlinkSync(filePath2);
					});
				} catch (error) {
					//console.error('No new Mints');
				}


				var data22Nonce;


				try {
					// Read the file content
					const fileContent = fs.readFileSync(filePath3, 'utf8');

					// Split the content into individual hex strings
					const hexStrings = fileContent.split(', ');
					data22Nonce = hexStrings;
					// Process each hex string
					hexStrings.forEach(hexString => {
						console.log(hexString);
						// Perform additional processing if needed
						    fs.unlinkSync(filePath3);

					});
				} catch (error) {
					//console.error('No new Mints');
				}
}
				if(data22Nonce!=null){

					console.log('Challenge: ',data2zzzz);
					console.log('Nonce: ',data22Nonce);
				}else{
					if(attempt%5==0){
						console.log("We are awaiting more solutions to pile up to send in, everything is working in Paymaster");
					}
				}
				// Usage example
				var gasLimit=0;
				var gasPrice=0;
				const filePath = path.join(__dirname, '..', '..', '_zkBitcoinMiner.conf');
				var test1;
				var test2;
				var test3;
				var config2;
					try {
					  const config = readConfig(filePath);
						config2=config;
					  // Now you can use the config object
					  //console.log('Private Key:', config.privateKey);
					  //console.log('Miner Address:', config.minerAddress);
				if(data22Nonce!=null){
					console.log('Miner Address:', config.minerAddress);
				}
					  //console.log('Contract Address:', config.contractAddress);

					  // Rest of your code...
					} catch (error) {
					  console.error('Error reading the config file:', error);
					  // Handle the error as needed...
					}
								  
					// Put the address of the ERC20 token here:
					TOKEN_ADDRESS = config2.contractAddress;
	
				var provider = null;
				var wallet =  null;
				 
				var erc20 =  null;
				
				try{
				
				
				provider = new Provider('https://testnet.era.zksync.dev');
				wallet = new Wallet(config2.privateKey, provider);
				 
				erc20 = await getToken(hre, wallet);
				}catch(error){
						console.error('Error fetching provider:', error);
					
						await sleep(5000); // Wait for 5s before retrying
						continue;
				}
					

	try{
		
				
			//	data22Nonce=  data22Nonce.slice(0, 3050); // Slice the array to exclude the last 'x' elements
				var count = data22Nonce.length;

				//console.log(`ERC20 token balance of the wallet before mint: ${await wallet.getBalance(TOKEN_ADDRESS)}`);

				PAYMASTER_ADDRESS = config2.contractAddressPayMaster;
				  console.log(`Paymaster is ${PAYMASTER_ADDRESS}`);
				  var paymasterBalance = 0;
				      try {
							paymasterBalance = await provider.getBalance(PAYMASTER_ADDRESS);
							console.log(`Paymaster Balance: ${paymasterBalance}`);
					} catch (error) {
						console.error('Error fetching balance:', error);
						
						await sleep(3000); // Wait for 5s before retrying
						break;
						// Additional error handling as needed
					}
				  
				  
				  console.log(`Paymaster ETH balance is ${paymasterBalance.toString()}`);
									  
				
				  gasPrice = await provider.getGasPrice();

				  // Encoding the "ApprovalBased" paymaster flow's input
				  const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
					type: "ApprovalBased",
					token: TOKEN_ADDRESS,
					// set minimalAllowance as we defined in the paymaster contract
					minimalAllowance: ethers.BigNumber.from(1),
					// empty bytes as testnet paymaster does not use innerInput
					innerInput: new Uint8Array(),
				  });
				  var epochsUntilAdjustmentawait = await erc20.blocksToReadjust();
				  console.log(`Epochs until adjustment  ${epochsUntilAdjustmentawait}`);
				  console.log(`Epochs to turn in:  ${count}`);
				  var doEz = false;
				  if(count >=epochsUntilAdjustmentawait){ doEz = true; }
if(false){

				const subtractAmount = ethers.utils.parseUnits('100000', 'wei');

				
				  gasLimit = await erc20.estimateGas.multiMint_PayMaster_EZ(config2.minerAddress, data22Nonce,{
					customData: {
					  gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
					  paymasterParams: paymasterParams,
					},
				  });


					var gasLimitUpdate = gasLimit;//Math.floor(gasLimit*2/3*2/3*gasLimitBump/100);
					if(gasLimitUpdate < gasLimit){
						gasLimit = gasLimitUpdate;
					
					}
				  const fee = gasPrice.mul(gasLimit.toString());
				  console.log("Transaction fee estimation is :>> ", fee.toString());

				  console.log(`Minting 5 tokens for the wallet via paymaster...`);
				  const transaction = await erc20.multiMint_PayMaster_EZ(config2.minerAddress, data22Nonce, {
				  // paymaster info
				  customData: {
					paymasterParams: paymasterParams,
					gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
					},
					  gasLimit: gasLimit, // Set the custom gas limit
					  gasPrice: gasPrice, // Set the custom gas price
					});




		var transactionHashz;
// Usage with your transaction.wait()

  try {
    const receipt = await timeout(30000, transaction.wait()); // Set timeout for 30 seconds
    transactionHashz = receipt.transactionHash;
    console.log(`Transaction Hash from then block: ${transactionHashz}`);
  } catch (err) {
    console.error(err);
    transactionHashz = null; // or handle this case as you see fit
  }
  
				newNonces = false;
				console.log(`Transaction Hash: ${transactionHashz}`);

				const filePathff = path.join(__dirname, '..', '..', 'transactionHash.txt');
				fs.writeFileSync(filePathff, transactionHashz);
				console.log(`Transaction Hash saved to ${filePath}`);

				  console.log(`Paymaster ERC20 token balance is now ${await erc20.balanceOf(PAYMASTER_ADDRESS)}`);
				  paymasterBalance = await provider.getBalance(PAYMASTER_ADDRESS);

				  console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);
				  console.log(`ERC20 token balance of the the wallet after mint: ${await wallet.getBalance(TOKEN_ADDRESS)}`);
				 
}else{	
				 // Estimate units for reward, 50 of them currently
				  
				const subtractAmount = ethers.utils.parseUnits('100000', 'wei');

	
				  gasLimit = await erc20.estimateGas.multiMint_PayMaster_EZ(config2.minerAddress, data22Nonce,{
					customData: {
					  gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
					  paymasterParams: paymasterParams,
					},
				  });
					var gasLimitUpdate = Math.floor(gasLimit*2/3*2/3*gasLimitBump/100);
					if(gasLimitUpdate < gasLimit){
						gasLimit = gasLimitUpdate;
					
					}

				//var gasLimit = 918398; //must remove
				  const fee = gasPrice.mul(gasLimit.toString());
				  console.log("Transaction fee estimation is :>> ", fee.toString());

				  console.log(`Minting 5 tokens for the wallet via paymaster...`);
				  const transaction = await erc20.multiMint_PayMaster_EZ(config2.minerAddress, data22Nonce, {
				  // paymaster info
				  customData: {
					paymasterParams: paymasterParams,
					gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
					},
					  gasLimit: gasLimit, // Set the custom gas limit
					  gasPrice: gasPrice, // Set the custom gas price
					});
					
				
var transactionHashz;
// Usage with your transaction.wait()

  try {
    const receipt = await timeout(30000, transaction.wait()); // Set timeout for 30 seconds
    transactionHashz = receipt.transactionHash;
    console.log(`Transaction Hash from then block: ${transactionHashz}`);
  } catch (err) {
    console.error(err);
    transactionHashz = null; // or handle this case as you see fit
  }
				console.log(`Transaction Hash: ${transactionHashz}`);
				const filePathff = path.join(__dirname, '..', '..', 'transactionHash.txt');
				fs.writeFileSync(filePathff, transactionHashz);
				console.log(`Transaction Hash saved to ${filePath}`);
				if(newNonces){
						console.log(`Sleeping because we just inputted a large block amount over block capacity so no reruns of blocks`);
						await sleep(10000); // Sleep for 10 seconds (2000 milliseconds)
							//Unlink data if we used it  
							
						const filePath33 = path.join(__dirname, '..', '..', 'aDataToMintHexNonce.txt');

						const filePath22 = path.join(__dirname, '..', '..', 'aDataToMintHexChallenge.txt');

						fs.unlinkSync(filePath22);
					    fs.unlinkSync(filePath33);

				}
				newNonces = false;


				 // console.log(`Paymaster ERC20 token balance is now ${await erc20.balanceOf(PAYMASTER_ADDRESS)}`);
				//  paymasterBalance = await provider.getBalance(PAYMASTER_ADDRESS);

				 // console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);
				  //console.log(`ERC20 token balance of the the wallet after mint: ${await wallet.getBalance(TOKEN_ADDRESS)}`);
			

				var gasLimitUpdate = gasLimit;//Math.floor(gasLimit*2/3*2/3*gasLimitBump/100);
					
			try {
			 var totalETHUSED = gasLimit*gasPrice;
				const result = await erc20.findMinimumGoodLoops(totalETHUSED);
				if(result > 4200){
					result = -1;
				}
				console.log(`Minimum Good Loops: ${result.toString()}`);
			const filePathffffffz = path.join(__dirname, '..', '..', 'MinmumMintsAtLeast.txt');
				fs.writeFileSync(filePathffffffz, result.toString());

    
			} catch (error) {
				console.error('Error calling findMinimumGoodLoops setting MinimuMMintsAtLeast to 1 to reset:', error);
				const result = -1;
				console.log(`Minimum Good Loops: ${result.toString()}`);
				const filePathffffffz = path.join(__dirname, '..', '..', 'MinmumMintsAtLeast.txt');
				fs.writeFileSync(filePathffffffz, result.toString());
			}
			console.log("The PayMaster transaction has been confirmed by the network! Success!! ");
			console.log("The PayMaster transaction has been confirmed by the network! Success!! ");
	
			DuplicateAnswerAttempts = 0;
			await sleep(1000);
			

}
				 
				
	
	
	} catch (error) {
	  	console.log("Error contains " + error);
	
    // Checking if the error message contains the text 'minAmt'
	 if (error.message.includes('Cannot read properties of undefined')){
	 if(attempt%5==0){
	     console.log("We are awaiting more solutions to pile up to send in, everything is working");
	}
		//		 await sleep(1000); // Sleep for 2 seconds (2000 milliseconds)
	  //console.log("Error contains 'Paymaster', Means Paymaster is out of ETH, please contact us on Discord");
		// Checking if the error message contains the text 'minAmt'
	
	 }else if (error.message.includes('Paymaster balance might not be enough')){
	  console.log("Error contains 'Paymaster', Means Paymaster is out of ETH, please contact us on Discord");
				 await sleep(1000); // Sleep for 2 seconds (2000 milliseconds)
	  console.log("Error contains 'Paymaster', Means Paymaster is out of ETH, please contact us on Discord");
		// Checking if the error message contains the text 'minAmt'
	 }else if (error.message.includes('Minting problem')){
	  console.log("Error contains 'Minting problem', Means you solved too many of the next epoch challenges that it cant readjust twice so we must trim our data to fit");
	await sleep(1000); // Sleep for 2 seconds (2000 milliseconds)
         //64 for tesntet

         var totalBlocksPossible = parseInt(epochsUntilAdjustmentawait) +_BLOCKS_PER_READJUSTMENT -1
	console.log("total possible blocks: ", totalBlocksPossible);
         data2zzzz = data2zzzz.slice(0, totalBlocksPossible  ); // Slice the array to exclude the last 'x' elements
         data22Nonce=  data22Nonce.slice(0, totalBlocksPossible  ); // Slice the array to exclude the last 'x' elements
	newNonces = true;
         continue
				
		
    // Checking if the error message contains the text 'minAmt'
	 }else if (error.message.includes('Not enough gas for transaction') || error.message.includes('Most likely not enough gas provided') || error.message.includes('failed to validate the transaction')){
	  console.log("Error contains 'Not enough gas for transaction', Means we need to UP the Gas Price, doing that now and resending");
				 gasLimitBump = gasLimitBump + Math.floor(gasLimitBump*10/100);
		console.log("gas Limit bumped to: "+gasLimitBump.toString());
				 await sleep(250); // Sleep for 2 seconds (2000 milliseconds)
		console.log("gas Limit bumped to: "+gasLimitBump.toString());
		newNonces = true;
		continue;
		
	 }else if (error.message.includes('MUST mint at least enough zkBTC')){
	 
	  console.log("Error contains 'MUST mint at least enough zkBTC', Means we need to UP the Number of Mints on the Miner because its too small at this price");
	
	 
			try {
			 var totalETHUSED = gasLimit*gasPrice;
				const result = await erc20.findMinimumGoodLoops(totalETHUSED);
				console.log(`Minimum Good Loops: ${result.toString()}`);
			const filePathffffffz = path.join(__dirname, '..', '..', 'MinmumMintsAtLeast.txt');
				fs.writeFileSync(filePathffffffz, result.toString());

    
			} catch (error) {
			const result22 = -1;
					const filePathffffffz = path.join(__dirname, '..', '..', 'MinmumMintsAtLeast.txt');
				fs.writeFileSync(filePathffffffz, result22.toString());

				console.error('Error calling findMinimumGoodLoops, meaning its impossible to mine at these price levels with the Paymaster:');
			}

	 
	 }else if (error.message.includes('lengthsdf')){
	 

	 
	 }else if(error.message.includes('Error function_selector = 0x4e487b71')){
		DuplicateAnswerAttempts = DuplicateAnswerAttempts+1;
		console.log("ERROR : ", error);
		console.log("Duplicate Answer attempt: ", DuplicateAnswerAttempts);
			if(DuplicateAnswerAttempts<3){
				 gasLimitBump = gasLimitBump + Math.floor(gasLimitBump*10/100);
				 
					 await sleep(3000); // Sleep for 2 seconds (2000 milliseconds) 
				 continue;
			}else{
				 
				console.log("Duplicate transactions detected getting rid of answers in miner");
				var transactionHashzzz ="0x750207aedaaf9abb7d485de5bcdec289a7ab4a58dddd6bbddbed8089ec289111";
				console.log(`Fake Transaction Hash to insert to miner to fix it: ${transactionHashzzz}`);
				const filePathff = path.join(__dirname, '..', '..', 'transactionHash.txt');
				fs.writeFileSync(filePathff, transactionHashzzz);
			}
		}
		else if (error.message.includes('Error function_selector = 0x, data = 0x') || error.message.includes('failed paymaster validation')) {

		
			newNonces = true;
			data2zzzz = data2zzzz.slice(0, data2zzzz.length - 10  ); // Slice the array to exclude the last 'x' elements
         data22Nonce=  data22Nonce.slice(0, data22Nonce.length - 10  ); // Slice the array to exclude the last 'x' elements
			console.log("Too many answers at once use 10 less");
		
			continue;
		
		
		}
	 
	 
	 
	 
	 
	 
	}
	
	
	/*
	//Update this  since its important to know instantly. We do it earlier
			try {
			 var totalETHUSED = gasLimit*gasPrice;
			 if(totalETHUSED != 0){
					const result = await erc20.findMinimumGoodLoops(totalETHUSED);
					console.log(`Minimum Good Loops: ${result.toString()}`);
					const filePathffffffz = path.join(__dirname, '..', '..', 'MinmumMintsAtLeast.txt');
					fs.writeFileSync(filePathffffffz, result.toString());

				}
			} catch (error) {
				console.error('Error calling findMinimumGoodLoops:', error);
			}

	*/
	 
	
				
				newNonces = false;
				  data2zzzz = null;
				data22Nonce= null;
				
				 await sleep(2000); // Sleep for 2 seconds (2000 milliseconds)
				 
}






























}



