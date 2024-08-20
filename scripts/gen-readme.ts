#!/usr/bin/env bun

import dedent from "dedent";
import { Glob } from "bun";
import * as fs from "node:fs";

let content = dedent`
  # T for Templates

  Included is a list of my personal project templates

  Templates are designed to be consumed with [degit](https://github.com/Rich-Harris/degit)

  ## Usage
`;

content += "\n";

const fence = "```";

const templateTemplate = (name: string) => `
- ### \`${name}\`

  ${fence}shell
  npx degit ehyland/t/${name} my-app
  ${fence}
`;

const glob = new Glob("*");

const names = Array.from(glob.scanSync({ onlyFiles: false }))
  .filter(
    (maybeTemplateDir) =>
      fs.statSync(maybeTemplateDir).isDirectory() &&
      maybeTemplateDir !== "node_modules" &&
      maybeTemplateDir !== "scripts"
  )
  .sort();

for (const name of names) {
  content += templateTemplate(name);
  content += "\n";
}

fs.writeFileSync("README.md", content, "utf8");

console.log("✨  Updated readme");
