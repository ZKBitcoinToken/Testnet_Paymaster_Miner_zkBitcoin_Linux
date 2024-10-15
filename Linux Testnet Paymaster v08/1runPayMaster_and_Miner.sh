#!/usr/bin/env bash

# Check if transactionHash.txt exists and delete it
if [ -f transactionHash.txt ]; then
    rm transactionHash.txt
fi


# Path to your JSON file
JSONFilePath="./1zkBTCMiner.sh"

# Check if the JSON file exists
if [ ! -f "$JSONFilePath" ]; then
    echo "JSON file not found: $JSONFilePath"
    exit 1
fi

# Modify the UsePayMaster field
sed -i 's/UsePayMaster=false/UsePayMaster=true/g' "$JSONFilePath"
# Rest of your script...


# Check for Node.js
if ! command -v node &> /dev/null
then
    echo "Node.js is not found or not installed."
    echo "Download and install Node.js from https://nodejs.org/"
    sudo apt-get install -y nodejs

    exit 1
fi

#Check for dotnet
if ! command -v dotnet &> /dev/null
then
    echo "dotnet 5.0 is not found or not installed."
    echo "Installing dotnet 5.0..."

    # Add Microsoft package signing key and repository
    wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
    sudo dpkg -i packages-microsoft-prod.deb
    sudo apt-get update; \
    sudo apt-get install -y apt-transport-https && \
    sudo apt-get update && \
    sudo apt-get install -y dotnet-sdk-5.0

    # Verify the installation
    dotnet --version

    echo "dotnet 5.0 is installed. Rerun the script to start."

    goto end
else
    echo "dotnet 5.0 is already installed."
fi




# Check for Yarn
if ! command -v yarn &> /dev/null
then
    echo "Yarn is not found or not installed."
    echo "Download and install Yarn from https://classic.yarnpkg.com/en/docs/install/"
    echo "Then run script again to install dependencies"

    # Add Yarn repository
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

    # Update package list and install Yarn
    sudo apt-get update && sudo apt-get install yarn

    echo "Yarn installed successfully."

    echo "Running yarn install to install project dependencies..."

    yarn install
fi

#Check for dotnet
if ! command -v dotnet &> /dev/null
then
    echo "dotnet 5.0 is not found or not installed."
    echo "Installing dotnet 5.0..."

    # Add Microsoft package signing key and repository
    wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
    sudo dpkg -i packages-microsoft-prod.deb
    sudo apt-get update; \
    sudo apt-get install -y apt-transport-https && \
    sudo apt-get update && \
    sudo apt-get install -y dotnet-sdk-5.0

    # Verify the installation
    dotnet --version

    echo "dotnet 5.0 is installed. Rerun the script to start."
else
    echo "dotnet 5.0 is already installed."
fi

# Change directory to the location of your TypeScript script
cd aPayMaster/

# Run the test deployment script
echo "Running test deployment script..."
yarn hardhat deploy-zksync --script deploy_blank.ts &

sleep 2
echo "I am sleeping for 3 seconds before launch."
sleep 3

# Check if the deployment script created a specific file
if [ ! -f "deploy/SetupWorking.txt" ]; then
    echo "File does not exist: deploy/SetupWorking.txt"
    echo "Script execution failed. Please install yarn dependencies using 'yarn install' in the aPayMaster folder."
    echo "Re-run this script after installs."
    yarn install
    yarn
    yarn add @openzeppelin/contracts
    echo "Run this script again"
fi


cd ..

source _zkJustPaymaster-2.sh &
# Check for .NET Core
if ! command -v dotnet &> /dev/null
then
    echo ".NET Core is not found or not installed,"
    echo "download and install from https://www.microsoft.com/net/download/windows/run"
    exit 1
fi


while true; do
    dotnet _zkBitcoinMiner.dll
    if [ $? -eq 22 ]; then
        continue
    else
        break
    fi
done

