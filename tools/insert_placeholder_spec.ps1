$ErrorActionPreference = 'Stop'
$path = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"
if (-not (Test-Path $path)) { throw "File not found: $path" }

$t = Get-Content $path -Raw -Encoding UTF8

# Insert one placeholder li in the visible UL only; keep collapsed UL empty
$placeholder = @'
<ul class="list-unstyled mb-2">
    <li>• <span class="en-only">Type your new spec here…</span><span class="ar-only">اكتب المواصفة هنا…</span></li>
</ul>
'@

$t = $t -replace '<ul class="list-unstyled mb-2">\s*</ul>', [Regex]::Escape($placeholder).Replace('\\','\')

[System.IO.File]::WriteAllText($path, $t, (New-Object System.Text.UTF8Encoding($false)))
Write-Host 'Inserted a placeholder list item in the visible Key Specifications UL.'
