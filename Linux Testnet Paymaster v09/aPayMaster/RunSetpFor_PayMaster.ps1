# PowerShell script to install NVM, Node.js v18, and Yarn for the current user on Windows

Write-Host "Installing NVM (Node Version Manager)..."

# Download and extract NVM for Windows
Invoke-WebRequest -Uri 'https://github.com/coreybutler/nvm-windows/releases/download/1.1.9/nvm-setup.zip' -OutFile 'nvm-setup.zip'
Expand-Archive -LiteralPath 'nvm-setup.zip' -DestinationPath '.\nvm-setup'

# Run the installer
Start-Process -FilePath '.\nvm-setup\nvm-setup.exe' -Wait

# Configure NVM environment variables for the current user
$env:NVM_HOME = Join-Path $Env:APPDATA 'nvm'
$env:NVM_SYMLINK = Join-Path $Env:APPDATA 'nvm\nodejs'
[System.Environment]::SetEnvironmentVariable('NVM_HOME', $env:NVM_HOME, [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable('NVM_SYMLINK', $env:NVM_SYMLINK, [System.EnvironmentVariableTarget]::User)

# Update the user's PATH environment variable
$env:Path = [System.Environment]::GetEnvironmentVariable('Path', [System.EnvironmentVariableTarget]::User)
$env:Path += ";$env:NVM_HOME;$env:NVM_SYMLINK"
[System.Environment]::SetEnvironmentVariable('Path', $env:Path, [System.EnvironmentVariableTarget]::User)

# Install and use Node.js version 18
Write-Host "Installing Node.js v18..."
nvm install 18
nvm use 18

# Install Yarn
Write-Host "Installing Yarn..."
npm install --global yarn

Write-Host "Installation complete for the current user."
Write-Host "Node.js version:"
node --version
Write-Host "Yarn version:"
yarn --version


# Wait for user input before closing
Read-Host -Prompt "If you see yarn version and Node.js version you are working correctly, press enter to exit"