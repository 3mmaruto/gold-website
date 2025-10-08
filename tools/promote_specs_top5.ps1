$ErrorActionPreference = 'Stop'
$path = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"
if (-not (Test-Path $path)) { throw "File not found: $path" }

# Load HTML as UTF-8 text
$html = Get-Content $path -Raw -Encoding UTF8

# 0) Clean any escaped backslashes in UL tag from previous edits
$html = $html -replace '<ul\\s', '<ul ' -replace '\\>', '>' -replace '\\"', '"'

# 1) Extract collapsed UL items under #moreSpecs
$patternCollapsed = '(?s)<div\s+class="collapse"\s+id="moreSpecs">.*?<ul\s+class="list-unstyled">(.*?)</ul>'
$mc = [System.Text.RegularExpressions.Regex]::Match($html, $patternCollapsed)
if (-not $mc.Success) { throw "Could not locate collapsed UL under #moreSpecs" }
$collapsedInner = $mc.Groups[1].Value

# Extract all <li>...</li>
$liPattern = '(?is)<li\b[^>]*>.*?</li>'
$liMatches = [System.Text.RegularExpressions.Regex]::Matches($collapsedInner, $liPattern)
$allLis = @()
foreach ($m in $liMatches) { $allLis += $m.Value.Trim() }

if ($allLis.Count -eq 0) { throw "No <li> items found in collapsed UL" }

# Split first 5 and rest
$first = $allLis | Select-Object -First 5
$rest  = $allLis | Select-Object -Skip 5

# 2) Replace visible UL block
$patternVisible = '(?s)<ul\s+class="list-unstyled\s+mb-2">(.*?)</ul>'
$visibleReplacement = "<ul class=\"list-unstyled mb-2\">`r`n            " + ($first -join "`r`n            ") + "`r`n        </ul>"
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $patternVisible, $visibleReplacement, 1)

# 3) Replace collapsed UL with remaining items
$collapsedReplacement = "<div class=\"collapse\" id=\"moreSpecs\">`r`n                        <ul class=\"list-unstyled\">" +
    (if ($rest.Count -gt 0) { "`r`n                            " + ($rest -join "`r`n                            ") + "`r`n                        " } else { "" }) +
    "</ul>"
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $patternCollapsed, $collapsedReplacement)

# 4) Write back as UTF-8 no BOM
[System.IO.File]::WriteAllText($path, $html, (New-Object System.Text.UTF8Encoding($false)))
Write-Host ("Promoted to visible: {0}, remaining collapsed: {1}" -f $first.Count, $rest.Count)
