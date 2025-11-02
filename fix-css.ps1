$content = Get-Content "client/src/charger-styles.css" -Raw

# Fix all CSS comment errors
$content = $content -replace '\}\s*/\*\s*==\s*\n=== ONBOARDING SCREEN STYLES ===== \*/', "}`n`n/* ===== ONBOARDING SCREEN STYLES ===== */"
$content = $content -replace '\}\s*/\*\s*====\s*\n= ONBOARDING MODE STYLES ===== \*/', "}`n`n/* ===== ONBOARDING MODE STYLES ===== */"
$content = $content -replace '\}\s*/\*\s*\n===== NEW ONBOARDING SCREEN STYLES ===== \*/', "}`n`n/* ===== NEW ONBOARDING SCREEN STYLES ===== */"
$content = $content -replace '\}\s*/\*\s*===\s*\n== PAGE TRANSITION STYLES ===== \*/', "}`n`n/* ===== PAGE TRANSITION STYLES ===== */"
$content = $content -replace '\}\s*/\*\s*==\s*\n=== AUTH PAGES STYLES \(LOGIN & REGISTER\) ===== \*/', "}`n`n/* ===== AUTH PAGES STYLES (LOGIN & REGISTER) ===== */"
$content = $content -replace '\}\s*/\*\s*===== QUI\s*\nCK REGISTER SPECIFIC STYLES ===== \*/', "}`n`n/* ===== QUICK REGISTER SPECIFIC STYLES ===== */"
$content = $content -replace '\}\s*/\*\s*=\s*\n==== ADDITIONAL INFO STEP STYLES ===== \*/', "}`n`n/* ===== ADDITIONAL INFO STEP STYLES ===== */"
$content = $content -replace '\}\s*/\*\s*=====\s*\n STATION OWNER REGISTRATION STYLES ===== \*/', "}`n`n/* ===== STATION OWNER REGISTRATION STYLES ===== */"

Set-Content "client/src/charger-styles.css" -Value $content -NoNewline
Write-Host "CSS comments fixed successfully!"