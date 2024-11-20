# Download Pandoc installer
$url = "https://github.com/jgm/pandoc/releases/download/3.1.12.2/pandoc-3.1.12.2-windows-x86_64.msi"
$output = "$PSScriptRoot\pandoc_installer.msi"

Write-Host "Downloading Pandoc installer..."
Invoke-WebRequest -Uri $url -OutFile $output

# Install Pandoc
Write-Host "Installing Pandoc..."
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$output`" /qn" -Wait

# Clean up installer
Remove-Item $output

Write-Host "Installation complete!"
