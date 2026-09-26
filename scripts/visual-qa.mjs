import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.QA_URL || "http://127.0.0.1:4173/";
const outDir = path.resolve(process.env.QA_OUT_DIR || "qa-screenshots");

const viewports = [
  [1920, 1080],
  [1600, 900],
  [1440, 900],
  [1366, 768],
  [1280, 800],
  [1024, 768],
  [820, 1180],
  [768, 1024],
  [430, 932],
  [390, 844],
  [375, 812],
  [360, 800],
];

const zoomLevels = [0.8, 0.9, 1.1, 1.25];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

async function inspect(label) {
  return page.evaluate((name) => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
    const offenders = [...document.body.querySelectorAll("*")]
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          tag: node.tagName.toLowerCase(),
          className: typeof node.className === "string" ? node.className : "",
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter(
        (item) =>
          item.width > 0 &&
          (item.left < -2 || item.right > window.innerWidth + 2),
      )
      .slice(0, 8);

    return {
      label: name,
      width: window.innerWidth,
      height: window.innerHeight,
      scrollWidth,
      overflowX: scrollWidth > window.innerWidth + 2,
      offenders,
    };
  }, label);
}

const results = [];

for (const [width, height] of viewports) {
  await page.setViewportSize({ width, height });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(outDir, `main-${width}x${height}.png`),
    fullPage: true,
  });
  results.push(await inspect(`${width}x${height}`));
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(baseUrl, { waitUntil: "networkidle" });
const sectionDir = path.join(outDir, "sections");
await mkdir(sectionDir, { recursive: true });
for (const [name, selector] of [
  ["hero", "#home"],
  ["operate", "#operate"],
  ["manage", "#manage"],
  ["axtion", "#axtion"],
  ["footer", "#contact"],
]) {
  await page.locator(selector).screenshot({
    path: path.join(sectionDir, `${name}.png`),
  });
}

for (const hash of ["operate", "manage", "axtion", "contact"]) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page
    .locator(`a[href="#${hash}"], a[href="/#${hash}"]`)
    .first()
    .click();
  await page.waitForTimeout(1400);
  results.push({
    label: `navigation-${hash}`,
    reached: await page.locator(`#${hash}`).evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }),
  });
}

for (const route of ["business", "cs"]) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator(`a[href="/${route}"]`).click();
  await page.waitForLoadState("networkidle");
  results.push({
    label: `route-${route}`,
    reached: new URL(page.url()).pathname === `/${route}`,
  });
}

for (const zoom of zoomLevels) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate((value) => {
    document.body.style.zoom = String(value);
  }, zoom);
  await page.screenshot({
    path: path.join(outDir, `zoom-${Math.round(zoom * 100)}.png`),
    fullPage: true,
  });
  results.push(await inspect(`zoom-${Math.round(zoom * 100)}`));
}

await page.goto(`${baseUrl}business`, { waitUntil: "networkidle" });
results.push(await inspect("/business"));
await page.goto(`${baseUrl}cs`, { waitUntil: "networkidle" });
results.push(await inspect("/cs"));

await browser.close();

console.log(JSON.stringify(results, null, 2));
