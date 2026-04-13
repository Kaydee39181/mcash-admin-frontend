$ErrorActionPreference = "Stop"

function Replace-OrFail {
  param(
    [string]$Content,
    [string]$OldValue,
    [string]$NewValue,
    [string]$Label
  )

  if ($Content.Contains($NewValue)) {
    return $Content
  }

  if (-not $Content.Contains($OldValue)) {
    throw "Could not find $Label to patch."
  }

  return $Content.Replace($OldValue, $NewValue)
}

function Replace-Regex-OrFail {
  param(
    [string]$Content,
    [string]$Pattern,
    [string]$Replacement,
    [string]$Label
  )

  if ($Content.Contains($Replacement)) {
    return $Content
  }

  $nextContent = [System.Text.RegularExpressions.Regex]::Replace(
    $Content,
    $Pattern,
    $Replacement,
    [System.Text.RegularExpressions.RegexOptions]::Singleline
  )

  if ($nextContent -eq $Content) {
    throw "Could not find $Label to patch."
  }

  return $nextContent
}

$root = (Get-Location).Path

$webpackConfigPath = Join-Path $root "node_modules\react-scripts\config\webpack.config.js"
$webpackDevServerConfigPath = Join-Path $root "node_modules\react-scripts\config\webpackDevServer.config.js"

if (-not (Test-Path $webpackConfigPath)) {
  throw "Missing file: $webpackConfigPath"
}

if (-not (Test-Path $webpackDevServerConfigPath)) {
  throw "Missing file: $webpackDevServerConfigPath"
}

$webpackConfig = [System.IO.File]::ReadAllText($webpackConfigPath)
$webpackConfigPatched = Replace-OrFail `
  -Content $webpackConfig `
  -OldValue "          exclude: /@babel(?:\/|\\{1,2})runtime/," `
  -NewValue @"
          exclude: [
            /@babel(?:\/|\\{1,2})runtime/,
            /react-bootstrap-sweetalert[\\/]dist/,
          ],
"@ `
  -Label "source-map-loader exclude rule"

if ($webpackConfigPatched -ne $webpackConfig) {
  [System.IO.File]::WriteAllText($webpackConfigPath, $webpackConfigPatched)
}

$webpackDevServerConfig = [System.IO.File]::ReadAllText($webpackDevServerConfigPath)
$modernHooks = @"
    // `proxy` is run before the dev-server middlewares are finalized
    proxy,
    setupMiddlewares(middlewares, devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Keep `evalSourceMapMiddleware`
      // middlewares before `redirectServedPath` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(devServer.app);
      }

      // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));

      return middlewares;
    },
"@

$webpackDevServerConfigPatched = Replace-Regex-OrFail `
  -Content $webpackDevServerConfig `
  -Pattern '    // `proxy` is run between `before` and `after` `webpack-dev-server` hooks.*?    onAfterSetupMiddleware\(devServer\) \{.*?    \},' `
  -NewValue $modernHooks `
  -Label "legacy webpack-dev-server hooks"

if ($webpackDevServerConfigPatched -ne $webpackDevServerConfig) {
  [System.IO.File]::WriteAllText($webpackDevServerConfigPath, $webpackDevServerConfigPatched)
}

Write-Host "react-scripts patch complete."
