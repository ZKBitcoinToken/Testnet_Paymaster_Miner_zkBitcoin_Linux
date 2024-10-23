#!/bin/bash

# Check if the transactionHash.txt file exists, and delete it if found
if [ -f "transactionHash.txt" ]; then
  rm transactionHash.txt
fi
cd aPayMaster/
# Infinite loop
while true
do
  echo "Running the script..."
  
  # Run the Hardhat deploy command
  yarn hardhat deploy-zksync --script use-paymaster.ts
  
  echo "Paymaster restarting to avoid errors, no issues found."
  
  # Wait for 2 seconds before restarting
  sleep 2
done

