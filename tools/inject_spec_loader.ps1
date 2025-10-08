$ErrorActionPreference = 'Stop'
$path = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"
if (-not (Test-Path $path)) { throw "File not found: $path" }
$content = Get-Content $path -Raw
$injection = @"
    <script src="js/spec-loader.js"></script>
</body>
"@
if ($content -notmatch '</body>') { throw 'Closing </body> not found in our-products.html' }
$new = $content -replace '</body>', $injection
Set-Content -Path $path -Value $new -Encoding UTF8
Write-Host 'Injected <script src="js/spec-loader.js"></script> before </body>.'
