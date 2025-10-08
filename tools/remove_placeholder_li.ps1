$ErrorActionPreference = 'Stop'
$path = "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html"
if (-not (Test-Path $path)) { throw "File not found: $path" }

$html = Get-Content $path -Raw -Encoding UTF8

# Remove any <li> that contains the placeholder text (handle escaped/backslashed variants too)
$patterns = @(
    '(?is)\s*<li\b[^>]*>[^<]*<span[^>]*class=\"en-only\"[^>]*>\s*Type\\?\s*your\\?\s*new\\?\s*spec\\?\s*here.*?</li>\s*',
    '(?is)\s*<li\b[^>]*>[^<]*Type\s*your\s*new\s*spec\s*here.*?</li>\s*'
)
foreach ($p in $patterns) {
  $html = [System.Text.RegularExpressions.Regex]::Replace($html, $p, '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
}

# Also normalize stray backslashes in UL tags if left
$html = $html -replace '<ul\\\s', '<ul ' -replace '\\>', '>' -replace '\\"', '"' -replace '\\ class', ' class'

[System.IO.File]::WriteAllText($path, $html, (New-Object System.Text.UTF8Encoding($false)))
Write-Host 'Removed placeholder <li> from visible UL if present.'
