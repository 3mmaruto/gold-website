$ErrorActionPreference = 'Stop'
$path = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"
if (-not (Test-Path $path)) { throw "File not found: $path" }

# Read current content as UTF-8 text
$t = Get-Content $path -Raw -Encoding UTF8

# Generic fixes: replace mis-decoded en-dash and quotes
$t = $t -replace 'â€“', '–'
$t = $t -replace 'â€”', '—'
$t = $t -replace 'â€˜', '‘'
$t = $t -replace 'â€™', '’'
$t = $t -replace 'â€œ', '“'
$t = $t -replace 'â€\u009d', '”'
$t = $t -replace 'â€³', '″'

# Specific hero headings (Arabic & English)
$t = $t -replace '<h3 class="fw-light text-primary mb-2 ar-only">[^<]*</h3>', '<h3 class="fw-light text-primary mb-2 ar-only">اختيارنا المميز</h3>'
$t = $t -replace '<h1 class="display-5 mb-3 en-only">[^<]*<span class="fw-light text-secondary">Cooling & Heating</span></h1>', '<h1 class="display-5 mb-3 en-only">Heat Pump – Premium <span class="fw-light text-secondary">Cooling & Heating</span></h1>'
$t = $t -replace '<h1 class="display-5 mb-3 ar-only">[\s\S]*?</h1>', '<h1 class="display-5 mb-3 ar-only">المضخة الحرارية – <span class="fw-light text-secondary">تبريد وتدفئة</span> عالية الكفاءة</h1>'

# Write back as UTF-8 (no BOM)
[System.IO.File]::WriteAllText($path, $t, (New-Object System.Text.UTF8Encoding($false)))
Write-Host 'Applied mojibake corrections in our-products.html'
