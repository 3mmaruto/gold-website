$ErrorActionPreference = 'Stop'
$path = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"
if (-not (Test-Path $path)) { throw "File not found: $path" }

# Read HTML (UTF-8)
$html = Get-Content $path -Raw -Encoding UTF8

# Normalize previously escaped tags (remove stray backslashes in UL tag)
$html = $html -replace '<ul\\\s', '<ul ' -replace '\\>', '>' -replace '\\"', '"' -replace '\\ class', ' class'

# Capture all <li> items inside the collapsed UL under #moreSpecs
$patternCollapsed = '(?s)<div\s+class="collapse"\s+id="moreSpecs">.*?<ul\s+class="list-unstyled">(.*?)</ul>'
$mc = [System.Text.RegularExpressions.Regex]::Match($html, $patternCollapsed)
if (-not $mc.Success) { throw "Could not locate collapsed UL under #moreSpecs" }
$collapsedInner = $mc.Groups[1].Value

# Extract individual <li> ... </li>
$liPattern = '(?is)<li\b[^>]*>.*?</li>'
$liMatches = [System.Text.RegularExpressions.Regex]::Matches($collapsedInner, $liPattern)
$allLis = @()
foreach ($m in $liMatches) { $allLis += $m.Value.Trim() }
if ($allLis.Count -eq 0) { throw "No <li> items found in collapsed UL" }

# Split first 5 to visible UL, remaining to collapsed
$first = $allLis | Select-Object -First 5
$rest  = $allLis | Select-Object -Skip 5

# Build replacement for visible UL
$visiblePattern = '(?s)<ul\s+class="list-unstyled\s+mb-2">.*?</ul>'
$visibleBlock = @"
<ul class="list-unstyled mb-2">
            $(($first -join "`r`n            "))
        </ul>
"@
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $visiblePattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $visibleBlock }, 1)

# Build replacement for collapsed UL inner
$collapsedOuterPattern = '(?s)(<div\s+class="collapse"\s+id="moreSpecs">.*?<ul\s+class="list-unstyled">)(.*?)(</ul>)'
$collapsedInnerNew = if ($rest.Count -gt 0) { "`r`n                            " + ($rest -join "`r`n                            ") + "`r`n                        " } else { "" }
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $collapsedOuterPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $m.Groups[1].Value + $collapsedInnerNew + $m.Groups[3].Value })

# Save back
[System.IO.File]::WriteAllText($path, $html, (New-Object System.Text.UTF8Encoding($false)))
Write-Host ("Promoted first 5 items to visible UL, remaining collapsed: {0}" -f $rest.Count)
