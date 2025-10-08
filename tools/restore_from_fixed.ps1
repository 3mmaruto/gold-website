$ErrorActionPreference = 'Stop'
$fixed = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.fixed.html"
$target = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"

if (-not (Test-Path $fixed)) { throw "Source not found: $fixed" }

# 1) Write clean content from fixed file as UTF-8 (no BOM)
$txt = Get-Content $fixed -Raw -Encoding UTF8
[System.IO.File]::WriteAllText($target, $txt, (New-Object System.Text.UTF8Encoding($false)))

# 2) Open target and cleanup meta and ensure script injection
$t = Get-Content $target -Raw -Encoding UTF8
# Remove duplicated http-equiv meta if present
$t = [regex]::Replace($t, '<meta\s+http-equiv="Content-Type"[^>]*>', '', 'IgnoreCase')
# Ensure spec-loader.js reference exists once before </body>
if ($t -notmatch 'js/spec-loader\.js') {
  $inj = @"
    <script src="js/spec-loader.js"></script>
</body>
"@
  $t = $t -replace '</body>', $inj
}
[System.IO.File]::WriteAllText($target, $t, (New-Object System.Text.UTF8Encoding($false)))

Write-Host 'Restored our-products.html from our-products.fixed.html, removed http-equiv meta, injected spec-loader.js, saved as UTF-8 (no BOM).'
