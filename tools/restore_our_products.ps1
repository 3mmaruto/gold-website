$ErrorActionPreference = 'Stop'
$src = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.fixed.html"
$dst = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"
if (-not (Test-Path $src)) { throw "Source not found: $src" }
# Read fixed file as text and write as UTF-8 (no BOM) to remove any BOM in target
$text = Get-Content $src -Raw -Encoding UTF8
[System.IO.File]::WriteAllText($dst, $text, (New-Object System.Text.UTF8Encoding($false)))
# Ensure spec-loader is referenced once before </body>
$t = Get-Content $dst -Raw -Encoding UTF8
if ($t -notmatch 'js/spec-loader\.js') {
  $inj = "    <script src=\"js/spec-loader.js\"></script>\r\n</body>"
  $t = $t -replace '</body>', $inj
  [System.IO.File]::WriteAllText($dst, $t, (New-Object System.Text.UTF8Encoding($false)))
}
Write-Host 'Restored our-products.html from our-products.fixed.html and ensured spec-loader reference. Saved as UTF-8 (no BOM).'
