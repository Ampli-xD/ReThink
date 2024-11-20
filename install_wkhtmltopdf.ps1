# Download wkhtmltopdf installer
$url = "https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox-0.12.6-1.msvc2015-win64.exe"
$output = "$PSScriptRoot\wkhtmltopdf_installer.exe"

Write-Host "Downloading wkhtmltopdf installer..."
Invoke-WebRequest -Uri $url -OutFile $output

# Install wkhtmltopdf
Write-Host "Installing wkhtmltopdf..."
Start-Process -FilePath $output -ArgumentList "/S" -Wait

# Clean up installer
Remove-Item $output

Write-Host "Installation complete!"
