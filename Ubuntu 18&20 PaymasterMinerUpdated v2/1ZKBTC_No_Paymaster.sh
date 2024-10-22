#!/usr/bin/env bash
echo Normal minting costs us ETH and doesnt use the paymaster make sure UsePayMaster=false

#Check for dotnet
if ! command -v dotnet &> /dev/null
then
    echo "dotnet 5.0 is not found or not installed."
    echo "Installing dotnet 5.0..."
    ubuntu_version=$(lsb_release -rs)
    if [[ "$ubuntu_version" == "22.04" || "$ubuntu_version" == "24.04" || "$ubuntu_version" == "20.04" ]]; then
        wget 'http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1-1ubuntu2.1~18.04.23_amd64.deb'
        
        sudo dpkg -i libssl1.1_1.1.1-1ubuntu2.1~18.04.23_amd64.deb

        target_version="20.04"
    else
        target_version="$ubuntu_version"
    fi

    # Add Microsoft package signing key and repository
    wget https://packages.microsoft.com/config/ubuntu/$target_version/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
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

while : ; do
  dotnet _zkBitcoinMiner.dll UsePayMaster=false
  [[ $? -eq 22 ]] || break
done

