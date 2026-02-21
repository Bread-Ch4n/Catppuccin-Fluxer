const atImport = require("postcss-import");
const chokidar = require("chokidar");
const postcss = require("postcss");
const cssnano = require("cssnano");
const path = require("path");
const fs = require("fs");

const stylesPath = path.join(__dirname, "src", "styles");
const entryFile = path.join(stylesPath, "index.css");
const outPath = path.join(__dirname, "src", "out.css");

const wrapInRoot = () => {
  return {
    postcssPlugin: "wrap-in-root",
    Once(root) {
      const newRoot = postcss.rule({ selector: ":root" });
      newRoot.raws.before = "\n";
      newRoot.raws.after = "\n";

      root.each((node) => {
        const cloned = node.clone();
        newRoot.append(cloned);
      });

      root.removeAll();
      root.append(newRoot);
    },
  };
};

wrapInRoot.postcss = true;

async function build() {
  try {
    const css = fs.readFileSync(entryFile, "utf8");

    const result = await postcss([atImport(), wrapInRoot(), cssnano()]).process(
      css,
      {
        from: entryFile,
      },
    );

    fs.writeFileSync(outPath, result.css);
    console.log("✔ CSS rebuilt");
  } catch (err) {
    console.error("✖ CSS build failed:", err);
  }
}

build();

if (process.argv.includes("--watch")) {
  console.log("👀 Watching src/styles...");
  chokidar.watch(stylesPath).on("all", (event, filePath) => {
    if (filePath.endsWith(".css")) {
      console.log(`→ ${event}: ${filePath}`);
      build();
    }
  });
}
