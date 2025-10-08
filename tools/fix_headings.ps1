$ErrorActionPreference = 'Stop'
$path = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"
if (-not (Test-Path $path)) { throw "File not found: $path" }

# Read as UTF-8
$t = Get-Content $path -Raw -Encoding UTF8

# Define literal old/new strings using here-strings to avoid escaping issues
$old_h3 = @'
<h3 class="fw-light text-primary mb-2 ar-only">Ø§Ø®ØªÙŠØ§Ø±Ù†Ø§ Ø§Ù„Ù…Ù…ÙŠØ²</h3>
'@
$new_h3 = @'
<h3 class="fw-light text-primary mb-2 ar-only">اختيارنا المميز</h3>
'@

$old_h1_en = @'
<h1 class="display-5 mb-3 en-only">Heat Pump â€“ Premium <span class="fw-light text-secondary">Cooling & Heating</span></h1>
'@
$new_h1_en = @'
<h1 class="display-5 mb-3 en-only">Heat Pump – Premium <span class="fw-light text-secondary">Cooling & Heating</span></h1>
'@

$old_h1_ar = @'
<h1 class="display-5 mb-3 ar-only">Ø§Ù„Ù…Ø¶Ø®Ø© Ø§Ù„Ø­Ø±Ø§Ø±ÙŠØ© â€“ <span class="fw-light text-secondary">ØªØ¨Ø±ÙŠØ¯ ÙˆØªØ¯ÙØ¦Ø©</span> Ø¹Ø§Ù„ÙŠØ© Ø§Ù„ÙƒÙØ§Ø¡Ø©</h1>
'@
$new_h1_ar = @'
<h1 class="display-5 mb-3 ar-only">المضخة الحرارية – <span class="fw-light text-secondary">تبريد وتدفئة</span> عالية الكفاءة</h1>
'@

# Apply literal replacements
$t = $t.Replace($old_h3, $new_h3)
$t = $t.Replace($old_h1_en, $new_h1_en)
$t = $t.Replace($old_h1_ar, $new_h1_ar)

# Write back as UTF-8 (no BOM)
[System.IO.File]::WriteAllText($path, $t, (New-Object System.Text.UTF8Encoding($false)))
Write-Host 'Replaced garbled hero headings with correct UTF-8 text.'
