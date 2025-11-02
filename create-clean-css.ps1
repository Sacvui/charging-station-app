# Read the backup CSS file
$cssContent = Get-Content "client/src/charger-styles.css.backup" -Raw -Encoding UTF8

# Remove any potential problematic patterns
$cssContent = $cssContent -replace '/\*\s*Page Enter/Exit Animations\s*\*/\s*/\*\s*Page Enter/Exit Animations\s*\*/', '/* Page Enter/Exit Animations */'

# Clean up any duplicate comments
$cssContent = $cssContent -replace '(/\*[^*]*\*/)\s*\1', '$1'

# Ensure proper spacing around CSS rules
$cssContent = $cssContent -replace '}\s*(/\*)', "}`n`n`$1"
$cssContent = $cssContent -replace '(\*/)\s*([.#@])', "`$1`n`n`$2"

# Remove any trailing whitespace
$cssContent = $cssContent -replace '\s+$', ''

# Write the cleaned CSS
$cssContent | Out-File "client/src/charger-styles.css" -Encoding UTF8 -NoNewline

Write-Host "Created cleaned CSS file from backup"