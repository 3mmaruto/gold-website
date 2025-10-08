$ErrorActionPreference = 'Stop'
$path = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"
if (-not (Test-Path $path)) { throw "File not found: $path" }

# Read as UTF-8 text
$content = Get-Content $path -Raw -Encoding UTF8

# Correct Arabic/English headings around the hero section
$h3ar = @'
<h3 class="fw-light text-primary mb-2 ar-only">اختيارنا المميز</h3>
'@

$h1ar = @'
<h1 class="display-5 mb-3 ar-only">المضخة الحرارية – <span class="fw-light text-secondary">تبريد وتدفئة</span> عالية الكفاءة</h1>
'@

$h1en = @'
<h1 class="display-5 mb-3 en-only">Heat Pump – Premium <span class="fw-light text-secondary">Cooling & Heating</span></h1>
'@

# Replace any garbled content inside those headings
$content = [regex]::Replace($content, '<h3 class="fw-light text-primary mb-2 ar-only">.*?</h3>', $h3ar, 'Singleline')
$content = [regex]::Replace($content, '<h1 class="display-5 mb-3 ar-only">.*?</h1>', $h1ar, 'Singleline')
$content = [regex]::Replace($content, '<h1 class="display-5 mb-3 en-only">.*?</h1>', $h1en, 'Singleline')

# Write back as UTF-8 (no BOM)
[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Host 'Fixed garbled hero headings in our-products.html'
