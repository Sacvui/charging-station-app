# Create a backup of the current CSS
Copy-Item "client/src/charger-styles.css" "client/src/charger-styles.css.backup"

# Create a minimal CSS file for testing
$minimalCSS = @"
/* ===== MINIMAL CSS FOR TESTING ===== */

.charger-types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.charger-type-card {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 0;
    transition: all 0.3s ease;
    cursor: pointer;
}

/* ===== AUTH MODE STYLES ===== */

.main-content.auth-mode {
    padding: 0 !important;
    min-height: 100vh !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    background: linear-gradient(135deg, #E0B3FF 0%, #B3E0FF 50%, #FFB3E0 100%) !important;
}
"@

# Write minimal CSS
$minimalCSS | Out-File "client/src/charger-styles.css" -Encoding UTF8 -NoNewline

Write-Host "Created minimal CSS for testing. Original backed up as charger-styles.css.backup"