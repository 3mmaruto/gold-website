$ErrorActionPreference = 'Stop'
$path = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"
if (-not (Test-Path $path)) { throw "File not found: $path" }

# Read as UTF-8 text
$t = Get-Content $path -Raw -Encoding UTF8

# 1) Clear the visible Key Specifications UL
$t = [System.Text.RegularExpressions.Regex]::Replace(
    $t,
    '<ul class="list-unstyled mb-2">[\s\S]*?</ul>',
    '<ul class="list-unstyled mb-2"></ul>',
    [System.Text.RegularExpressions.RegexOptions]::Singleline
)

# 2) Clear the collapsed UL inside the #moreSpecs section only
$t = [System.Text.RegularExpressions.Regex]::Replace(
    $t,
    '(<div class="collapse" id="moreSpecs">[\s\S]*?<ul class="list-unstyled">)[\s\S]*?(</ul>)',
    '$1$2',
    [System.Text.RegularExpressions.RegexOptions]::Singleline
)

# Write back as UTF-8 (no BOM)
[System.IO.File]::WriteAllText($path, $t, (New-Object System.Text.UTF8Encoding($false)))
Write-Host 'Cleared static UL items under Key Specifications. Loader will populate them at runtime.'
