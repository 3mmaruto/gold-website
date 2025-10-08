$ErrorActionPreference = 'Stop'
$txtPath = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\docs\main_product.txt"
$htmlPath = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"

if (-not (Test-Path $txtPath)) { throw "Not found: $txtPath" }
if (-not (Test-Path $htmlPath)) { throw "Not found: $htmlPath" }

# Read text (UTF-8 preferred; fallback to Windows-1256 if mojibake)
$bytes = [System.IO.File]::ReadAllBytes($txtPath)
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
if ($text -match '[ØÙ]' -and $text -notmatch "[\u0600-\u06FF]") {
  $enc1256 = [System.Text.Encoding]::GetEncoding(1256)
  $text = $enc1256.GetString($bytes)
}
if ($text.StartsWith([char]0xFEFF)) { $text = $text.Substring(1) }

# Extract items between markers
$lines = $text -split "\r?\n"
$trim = $lines | ForEach-Object { $_.Trim() }
$startIdx = ($trim | Select-String -SimpleMatch 'مواصفات الجهاز').LineNumber
if (-not $startIdx) { $startIdx = 1 }
$divLine = ($trim | Select-String -Pattern '^////////////////////////////////' -CaseSensitive).LineNumber
if (-not $divLine) { $divLine = $lines.Length }

$from = [Math]::Min($lines.Length, $startIdx)
$to = [Math]::Max($from, $divLine - 1)
$range = $lines[($from) .. ($to)]
# Skip the first line itself (the title)
$range = $range | Select-Object -Skip 1

# Normalize and filter non-empty
$items = @()
foreach ($r in $range) {
  $t = ($r -replace "^[\s\u00A0]+|[\s\u00A0]+$", '')
  if ($t.Length -gt 0) { $items += $t }
}

# Split
$first = $items | Select-Object -First 6
$rest  = $items | Select-Object -Skip 6

# HTML escape minimal
function EscHtml([string]$s) {
  return ($s -replace '&','&amp;').Replace('<','&lt;').Replace('>','&gt;')
}

# Build li blocks with reasonable indentation
$liFirst = ($first | ForEach-Object { '                        <li>• <span class="en-only">' + (EscHtml $_) + '</span><span class="ar-only">' + (EscHtml $_) + '</span></li>' }) -join "`r`n"
$liRest  = ($rest  | ForEach-Object { '                            <li>• <span class="en-only">' + (EscHtml $_) + '</span><span class="ar-only">' + (EscHtml $_) + '</span></li>' }) -join "`r`n"

# Load HTML
$html = Get-Content $htmlPath -Raw -Encoding UTF8

# Replace the visible UL (exact empty ul)
$patternVisible = '<ul class="list-unstyled mb-2">\s*</ul>'
$replacementVisible = @"
<ul class="list-unstyled mb-2">
$liFirst
                    </ul>
"@
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $patternVisible, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) return $replacementVisible })

# Replace the collapsed UL inside #moreSpecs preserving the opening
$patternCollapsed = '(<div class="collapse" id="moreSpecs">[\s\S]*?<ul class="list-unstyled">)\s*</ul>'
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $patternCollapsed, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) return $m.Groups[1].Value + "`r`n" + $liRest + "`r`n                        </ul>" }, [System.Text.RegularExpressions.RegexOptions]::Singleline)

# Save back as UTF-8 (no BOM)
[System.IO.File]::WriteAllText($htmlPath, $html, (New-Object System.Text.UTF8Encoding($false)))
Write-Host ("Filled ULs statically: visible={0}, collapsed={1}" -f $first.Count, $rest.Count)
