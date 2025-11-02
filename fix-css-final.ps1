# Read the CSS file
$cssContent = Get-Content "client/src/charger-styles.css" -Raw -Encoding UTF8

# Remove any potential problematic characters
$cssContent = $cssContent -replace '\u00A0', ' '  # Replace non-breaking spaces
$cssContent = $cssContent -replace '\u2044', '/'  # Replace fraction slash
$cssContent = $cssContent -replace '\u2215', '/'  # Replace division slash
$cssContent = $cssContent -replace '\uFF0F', '/'  # Replace fullwidth solidus

# Ensure all comments are properly formatted
$cssContent = $cssContent -replace '/\*\s*([^*]+)\s*\*/', '/* $1 */'

# Write back to file with UTF8 encoding
$cssContent | Out-File "client/src/charger-styles.css" -Encoding UTF8 -NoNewline

Write-Host "CSS file cleaned and fixed!"