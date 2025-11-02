# Read the CSS file
$cssContent = Get-Content "client/src/charger-styles.css" -Raw

# Replace problematic comment patterns
$cssContent = $cssContent -replace '}\/\* ==\r?\n=== ONBOARDING SCREEN STYLES ===== \*/', "}`n`n/* ===== ONBOARDING SCREEN STYLES ===== */"
$cssContent = $cssContent -replace '}\/\* ====\r?\n= ONBOARDING MODE STYLES ===== \*/', "}`n`n/* ===== ONBOARDING MODE STYLES ===== */"
$cssContent = $cssContent -replace '}\/\* \r?\n===== NEW ONBOARDING SCREEN STYLES ===== \*/', "}`n`n/* ===== NEW ONBOARDING SCREEN STYLES ===== */"
$cssContent = $cssContent -replace '}\/\* ===\r?\n== PAGE TRANSITION STYLES ===== \*/', "}`n`n/* ===== PAGE TRANSITION STYLES ===== */"
$cssContent = $cssContent -replace '}\/\* ==\r?\n=== AUTH PAGES STYLES \(LOGIN & REGISTER\) ===== \*/', "}`n`n/* ===== AUTH PAGES STYLES (LOGIN & REGISTER) ===== */"
$cssContent = $cssContent -replace '}\/\* ===== QUI\r?\nCK REGISTER SPECIFIC STYLES ===== \*/', "}`n`n/* ===== QUICK REGISTER SPECIFIC STYLES ===== */"
$cssContent = $cssContent -replace '}\/\* =\r?\n==== ADDITIONAL INFO STEP STYLES ===== \*/', "}`n`n/* ===== ADDITIONAL INFO STEP STYLES ===== */"
$cssContent = $cssContent -replace '}\/\* =====\r?\n STATION OWNER REGISTRATION STYLES ===== \*/', "}`n`n/* ===== STATION OWNER REGISTRATION STYLES ===== */"

# Write back to file
$cssContent | Out-File "client/src/charger-styles.css" -Encoding UTF8 -NoNewline

Write-Host "CSS file fixed successfully!"