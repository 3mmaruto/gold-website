$ErrorActionPreference = 'Stop'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$files = @(
  "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\our-products.html",
  "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\docs\main_product.txt",
  "c:\Users\Alrefai\OneDrive\Desktop\gold_repo\gold-website\js\spec-loader.js"
)
foreach ($f in $files) {
  if (Test-Path $f) {
    $content = Get-Content $f -Raw -Encoding Byte
    # Try detect if it's likely Windows-1256 or similar and convert to Unicode text first
    try {
      $text = [System.Text.Encoding]::UTF8.GetString($content)
      # If mojibake detected (lots of 'Ø'/'Ù'), try Windows-1256
      if ($text -match "[ØÙ]" -and $text -notmatch "[\u0600-\u06FF]") {
        $win1256 = [System.Text.Encoding]::GetEncoding(1256)
        $text = $win1256.GetString($content)
      }
    } catch {
      $text = [System.Text.Encoding]::UTF8.GetString($content)
    }
    [System.IO.File]::WriteAllText($f, $text, $utf8NoBom)
    Write-Host "Rewrote as UTF-8 (no BOM): $f"
  } else {
    Write-Warning "File not found: $f"
  }
}
Write-Host "Done."
