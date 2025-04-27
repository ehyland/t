#!/usr/bin/env node

const vars = {
  NODE_VERSION: process.version.replace(/^v/, ''),
  PLAYWRIGHT_VERSION: require('@playwright/test/package.json').version,
};

Object.entries(vars).forEach(([key, value]) => {
  console.log(`export ${key}="${value}"`);
});
