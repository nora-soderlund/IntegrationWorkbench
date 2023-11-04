const { build } = require("esbuild");

const baseConfig = {
  bundle: true,
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV !== "production",
};

const extensionConfig = {
  ...baseConfig,
  platform: "node",
  mainFields: ["module", "main"],
  format: "cjs",
  entryPoints: ["./src/extension.ts"],
  outfile: "./build/extension.js",
  external: ["vscode"],
};

const watchConfig = {
  watch: {
    onRebuild(error, result) {
      console.log("[watch] build started");
      if (error) {
        error.errors.forEach(error =>
          console.error(`> ${error.location.file}:${error.location.line}:${error.location.column}: error: ${error.text}`)
        );
      } else {
        console.log("[watch] build finished");
      }
    },
  },
};

const webviewConfigs = [
  {
    ...baseConfig,
    target: "es2020",
    format: "esm",
    entryPoints: ["./src/webviews/request/index.ts"],
    outfile: "./build/webviews/request.js",
  },
  {
    ...baseConfig,
    target: "es2020",
    format: "esm",
    entryPoints: ["./src/webviews/response/index.ts"],
    outfile: "./build/webviews/response.js",
  }
];

(async () => {
  const args = process.argv.slice(2);
  try {
    if (args.includes("--watch")) {
      // Build and watch extension and webview code
      console.log("[watch] build started");
      await build({
        ...extensionConfig,
        ...watchConfig,
      });

      for(let webviewConfig of webviewConfigs) {
        await build({
          ...webviewConfig,
          ...watchConfig,
        });
      }
      
      console.log("[watch] build finished");
    } else {
      // Build extension and webview code
      await build(extensionConfig);
      await build(webviewConfig);
      console.log("build complete");
    }
  } catch (err) {
    process.stderr.write(err.stderr);
    process.exit(1);
  }
})();