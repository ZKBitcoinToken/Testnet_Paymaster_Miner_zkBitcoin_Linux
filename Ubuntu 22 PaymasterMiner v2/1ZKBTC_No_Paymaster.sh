#!/usr/bin/env bash
echo Normal minting costs us ETH and doesnt use the paymaster make sure UsePayMaster=false

#Check for dotnet
if ! command -v dotnet &> /dev/null
then
    echo "dotnet 6.0 is not found or not installed."
    echo "Installing dotnet 6.0..."
    ubuntu_version=$(lsb_release -rs)
    if [[ "$ubuntu_version" == "22.04" || "$ubuntu_version" == "24.04" || "$ubuntu_version" == "20.04" ]]; then
        wget 'http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1-1ubuntu2.1~18.04.23_amd64.deb'
        
        sudo dpkg -i libssl1.1_1.1.1-1ubuntu2.1~18.04.23_amd64.deb

        target_version="20.04"
    else
        target_version="$ubuntu_version"
    fi

    sudo apt-get update; \
    sudo apt-get install -y apt-transport-https && \
    sudo apt-get update && \
    sudo apt-get install dotnet-sdk-6.0 -y

    # Verify the installation
    dotnet --version

    echo "dotnet 6.0 is installed. Rerun the script to start."

    goto end
else
    echo "dotnet 6.0 is already installed."
fi

# Path to your JSON file
JSONFilePath="./_zkBitcoinMiner.conf"

# Check if the JSON file exists
if [ ! -f "$JSONFilePath" ]; then
    echo "JSON file not found: $JSONFilePath"
    exit 1
fi

# Modify the UsePayMaster field
sed -i 's/UsePayMaster=true/UsePayMaster=false/g' "$JSONFilePath"
# Rest of your script...

while : ; do
  dotnet _zkBitcoinMiner.dll
  [[ $? -eq 22 ]] || break
done
