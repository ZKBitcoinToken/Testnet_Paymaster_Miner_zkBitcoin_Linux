#!/usr/bin/env bash

rm -f packages-microsoft-prod.deb


ubuntu_version=$(lsb_release -rs)

# Proceed with the download for the detected Ubuntu version
echo "Ubuntu $ubuntu_version detected. Proceeding with the download..."
wget https://packages.microsoft.com/config/ubuntu/${ubuntu_version}/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb   sudo dpkg -i packages-microsoft-prod.deb

sudo dpkg -P packages-microsoft-prod
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update

rm -f packages-microsoft-prod.deb

sudo apt-get install apt-transport-https -y
sudo apt-get install dotnet-sdk-6.0 -y
sudo ubuntu-drivers autoinstall

