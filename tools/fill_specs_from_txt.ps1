$ErrorActionPreference = 'Stop'
$txtPath = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\docs\main_product.txt"
$htmlPath = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"

if (-not (Test-Path $txtPath)) { throw "Not found: $txtPath" }
if (-not (Test-Path $htmlPath)) { throw "Not found: $htmlPath" }

# Read text file as UTF-8 raw bytes then try UTF8, fallback to Windows-1256 if mojibake
$bytes = [System.IO.File]::ReadAllBytes($txtPath)
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
if ($text -match '[ØÙ]' -and $text -notmatch "[\u0600-\u06FF]") {
  $enc1256 = [System.Text.Encoding]::GetEncoding(1256)
  $text = $enc1256.GetString($bytes)
}
$text = $text.TrimStart([char]0xFEFF)

# Extract between 'مواصفات الجهاز' and divider '////////////////////////////////'
$lines = $text -split "\r?\n"
$start = ($lines | ForEach-Object { $_.Trim() }) | ForEach-Object -Begin {$i=0} -Process { if ($_ -eq 'مواصفات الجهاز') { $script:startIdx = $i } ; $i++ } | Out-Null
$startIdx = if ($script:startIdx -ge 0) { $script:startIdx } else { 0 }
$dividerIdx = ($lines | ForEach-Object { $_.Trim() }) | ForEach-Object -Begin {$j=0} -Process { if ($_ -like '////////////////////////////////*') { $script:divIdx = $j } ; $j++ } | Out-Null; $divIdx = $script:divIdx
if (-not $divIdx) { $divIdx = $lines.Length }

$range = $lines[($startIdx + 1) .. ($divIdx - 1)]
# Normalize items: trim and remove empty
$items = @()
foreach ($r in $range) {
  $t = ($r -replace "^[\s\u00A0]+|[\s\u00A0]+$", '')
  if ($t.Length -gt 0) { $items += $t }
}

# HTML escape minimal
function EscHtml([string]$s) {
  return $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;')
}

# Split first 6 / rest
$first = $items | Select-Object -First 6
$rest  = $items | Select-Object -Skip 6

# Build UL contents
$liFirst = ($first | ForEach-Object { '                        <li>• <span class="en-only">' + (EscHtml $_) + '</span><span class="ar-only">' + (EscHtml $_) + '</span></li>' }) -join "`r`n"
$liRest  = ($rest  | ForEach-Object { '                            <li>• <span class="en-only">' + (EscHtml $_) + '</span><span class="ar-only">' + (EscHtml $_) + '</span></li>' }) -join "`r`n"

# Read HTML
$html = Get-Content $htmlPath -Raw -Encoding UTF8

# Replace visible UL block
$html = [System.Text.RegularExpressions.Regex]::Replace(
  $html,
  '<ul class="list-unstyled mb-2">[\s\S]*?</ul>',
  "<ul class=\"list-unstyled mb-2\">`r`n$liFirst`r`n                    </ul>",
  [System.Text.RegularExpressions.RegexOptions]::Singleline
)

# Replace collapsed UL block inside #moreSpecs only
$html = [System.Text.RegularExpressions.Regex]::Replace(
  $html,
  '(<div class="collapse" id="moreSpecs">[\s\S]*?<ul class="list-unstyled">)[\s\S]*?(</ul>)',
  "$1`r`n$liRest`r`n                        $2",
  [System.Text.RegularExpressions.RegexOptions]::Singleline
)

# Write back UTF-8 no BOM
[System.IO.File]::WriteAllText($htmlPath, $html, (New-Object System.Text.UTF8Encoding($false)))
Write-Host ("Filled ULs: visible={0}, collapsed={1}" -f $first.Count, $rest.Count)
