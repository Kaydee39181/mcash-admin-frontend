const fs = require("fs");
const path = require("path");

function replaceOrFail(content, oldValue, newValue, label) {
  if (content.includes(newValue)) {
    return content;
  }

  if (!content.includes(oldValue)) {
    throw new Error(`Could not find ${label} to patch.`);
  }

  return content.replace(oldValue, newValue);
}

function replaceRegexOrFail(content, pattern, replacement, label) {
  if (content.includes(replacement)) {
    return content;
  }

  const nextContent = content.replace(pattern, replacement);

  if (nextContent === content) {
    throw new Error(`Could not find ${label} to patch.`);
  }

  return nextContent;
}

const root = process.cwd();

const webpackConfigPath = path.join(
  root,
  "node_modules",
  "react-scripts",
  "config",
  "webpack.config.js"
);
const webpackDevServerConfigPath = path.join(
  root,
  "node_modules",
  "react-scripts",
  "config",
  "webpackDevServer.config.js"
);

if (!fs.existsSync(webpackConfigPath)) {
  throw new Error(`Missing file: ${webpackConfigPath}`);
}

if (!fs.existsSync(webpackDevServerConfigPath)) {
  throw new Error(`Missing file: ${webpackDevServerConfigPath}`);
}

const webpackConfig = fs.readFileSync(webpackConfigPath, "utf8");
const webpackConfigPatched = replaceOrFail(
  webpackConfig,
  "          exclude: /@babel(?:\\/|\\\\{1,2})runtime/,",
  `          exclude: [
            /@babel(?:\\/|\\\\{1,2})runtime/,
            /react-bootstrap-sweetalert[\\\\/]dist/,
          ],`,
  "source-map-loader exclude rule"
);

if (webpackConfigPatched !== webpackConfig) {
  fs.writeFileSync(webpackConfigPath, webpackConfigPatched);
}

const webpackDevServerConfig = fs.readFileSync(
  webpackDevServerConfigPath,
  "utf8"
);
const modernHooks = `    // \`proxy\` is run before the dev-server middlewares are finalized
    proxy,
    setupMiddlewares(middlewares, devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Keep \`evalSourceMapMiddleware\`
      // middlewares before \`redirectServedPath\` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(devServer.app);
      }

      // Redirect to \`PUBLIC_URL\` or \`homepage\` from \`package.json\` if url not match
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));

      return middlewares;
    },`;

const webpackDevServerConfigPatched = replaceRegexOrFail(
  webpackDevServerConfig,
  /    \/\/ `proxy` is run between `before` and `after` `webpack-dev-server` hooks[\s\S]*?    onAfterSetupMiddleware\(devServer\) \{[\s\S]*?    \},/,
  modernHooks,
  "legacy webpack-dev-server hooks"
);

if (webpackDevServerConfigPatched !== webpackDevServerConfig) {
  fs.writeFileSync(
    webpackDevServerConfigPath,
    webpackDevServerConfigPatched
  );
}

console.log("react-scripts patch complete.");
