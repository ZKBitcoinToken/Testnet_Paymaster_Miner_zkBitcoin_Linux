#!/usr/bin/env bash

# Check if transactionHash.txt exists and delete it
if [ -f transactionHash.txt ]; then
    rm transactionHash.txt
fi


# Path to your JSON file
JSONFilePath="./_zkBitcoinMiner.conf"

# Check if the JSON file exists
if [ ! -f "$JSONFilePath" ]; then
    echo "JSON file not found: $JSONFilePath"
    exit 1
fi

# Modify the UsePayMaster field

sed -i 's/"UsePayMaster"[[:space:]]*:[[:space:]]*false/"UsePayMaster": true/' "$JSONFilePath"
# Rest of your script...


# Check for Node.js
if ! command -v node &> /dev/null
then
    echo "Node.js is not found or not installed."
    echo "Download and install Node.js from https://nodejs.org/"
    sudo apt-get install -y nodejs
fi

# Check if dotnet is installed
if ! command -v dotnet &> /dev/null
then
    echo "dotnet 6.0 is not found or not installed."
    echo "Installing dotnet 6.0..."

    ubuntu_version=$(lsb_release -rs)

    # Handle Ubuntu 22.04 and prioritize the PMC repository for installation
    if [[ "$ubuntu_version" == "22.04" || "$ubuntu_version" == "24.04" || "$ubuntu_version" == "20.04" || "$ubuntu_version" == "18.04"  ]]; then

        # Download and install Microsoft package repository for Ubuntu 22.04
        echo "Downloading and installing Microsoft package repository for Ubuntu 22.04..."
        wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
        sudo dpkg -i packages-microsoft-prod.deb
        rm packages-microsoft-prod.deb

        # Create apt preferences file to prioritize Microsoft repository
        echo "Configuring apt preferences to prioritize Microsoft repository..."

        sudo cp preferences-temp /etc/apt/preferences

        # Update package information
        echo "Updating package information..."
        sudo apt update

        # Install .NET SDK 6.0
        echo "Installing .NET SDK 6.0..."
        sudo apt install -y dotnet-sdk-6.0

    # Handle other supported Ubuntu versions (20.04, 24.04, etc.)
    elif [[ "$ubuntu_version" == "24.04" || "$ubuntu_version" == "20.04" ]]; then
        # Specific fix for libssl on older versions
        echo "Downloading and installing libssl1.1 for compatibility..."
        wget 'http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1-1ubuntu2.1~18.04.23_amd64.deb'
        sudo dpkg -i libssl1.1_1.1.1-1ubuntu2.1~18.04.23_amd64.deb

        # Add Microsoft package repository for other versions
        echo "Downloading and installing Microsoft package repository for Ubuntu $ubuntu_version..."
        wget https://packages.microsoft.com/config/ubuntu/$ubuntu_version/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
        sudo dpkg -i packages-microsoft-prod.deb
        sudo apt-get update
        sudo apt-get install -y apt-transport-https
        sudo apt-get update
        sudo apt-get install -y dotnet-sdk-6.0
    else
        echo "Unsupported Ubuntu version: $ubuntu_version. Aborting installation."
        exit 1
    fi

    # Verify installation
    if dotnet --version; then
        echo ".NET SDK 6.0 installed successfully."
    else
        echo "Failed to install .NET SDK 6.0."
        exit 1
    fi

    echo "dotnet 6.0 is installed. Please rerun the script to start the miner."

    exit 0
else
    echo "dotnet 6.0 is already installed."
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
    exit 1
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
