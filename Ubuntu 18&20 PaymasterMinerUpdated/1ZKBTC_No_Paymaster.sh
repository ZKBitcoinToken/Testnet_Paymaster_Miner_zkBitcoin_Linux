#!/usr/bin/env bash
echo Normal minting costs us ETH and doesnt use the paymaster make sure UsePayMaster=false

#Check for dotnet
if ! command -v dotnet &> /dev/null
then
    echo "dotnet 5.0 is not found or not installed."
    echo "Installing dotnet 5.0..."

    # Add Microsoft package signing key and repository

    # Get the Ubuntu version
    ubuntu_version=$(lsb_release -rs)

    # Proceed with the download for the detected Ubuntu version
    echo "Ubuntu $ubuntu_version detected. Proceeding with the download..."
    wget https://packages.microsoft.com/config/ubuntu/${ubuntu_version}/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
    sudo dpkg -i packages-microsoft-prod.deb   sudo dpkg -i packages-microsoft-prod.deb
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

while : ; do
  dotnet _zkBitcoinMiner.dll UsePayMaster=false
  [[ $? -eq 22 ]] || break
done

