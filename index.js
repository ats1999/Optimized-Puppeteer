const puppeteer = require("puppeteer");
const fs = require("fs");

const html = fs.readFileSync("./md.html", { encoding: "utf-8" });

const ITERATION = 50;
const data = new Array(ITERATION);

for (let i = 0; i < ITERATION; i++) data[i] = {};

// time taken to lunch a browser
async function browserLunch() {
  for (let i = 0; i < ITERATION; i++) {
    const startTime = Date.now();
    const browser = await puppeteer.launch();
    const endTime = Date.now();
    await browser.close();

    data[i].browserLunch = endTime - startTime;
  }
}

// time take to close the browser
async function browserClose() {
  for (let i = 0; i < ITERATION; i++) {
    const browser = await puppeteer.launch();
    const startTime = Date.now();
    await browser.close();
    const endTime = Date.now();

    data[i].browserClose = endTime - startTime;
  }
}

// time take in lunching the browser and close
async function browserLunchClose() {
  for (let i = 0; i < ITERATION; i++) {
    const startTime = Date.now();
    const browser = await puppeteer.launch();
    await browser.close();
    const endTime = Date.now();

    data[i].browserLunchClose = endTime - startTime;
  }
}

// browser and page lunch and close togather
async function browserAndPageLunchClose() {
  for (let i = 0; i < ITERATION; i++) {
    const startTime = Date.now();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await browser.close();
    const endTime = Date.now();

    data[i].browserAndPageLunchClose = endTime - startTime;
  }
}

// keep the browser instance opened
// only open and close the page
async function singleBrowserNewPage() {
  const browser = await puppeteer.launch();
  for (let i = 0; i < ITERATION; i++) {
    const startTime = Date.now();
    const page = await browser.newPage();
    await page.close();
    const endTime = Date.now();

    data[i].singleBrowserNewPage = endTime - startTime;
  }
  await browser.close();
}

// set the content of page
// open and close, browser and page each time
async function pageSetContentNewBrowserPage() {
  for (let i = 0; i < ITERATION; i++) {
    const startTime = Date.now();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await browser.close();
    const endTime = Date.now();

    data[i].pageSetContentNewBrowserPage = endTime - startTime;
  }
}

// keep browser instance opened
// only close the page
async function pageSetContentNewPage() {
  const browser = await puppeteer.launch();
  for (let i = 0; i < ITERATION; i++) {
    const startTime = Date.now();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.close();
    const endTime = Date.now();

    data[i].pageSetContentNewPage = endTime - startTime;
  }

  await browser.close();
}

// keep the browser opened
// keep the page opened
// only set the content
async function pageSetOnlyContent() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (let i = 0; i < ITERATION; i++) {
    const startTime = Date.now();
    await page.setContent(html);
    const endTime = Date.now();

    data[i].pageSetOnlyContent = endTime - startTime;
  }

  await browser.close();
}

(async () => {
  console.log("Start", new Date().toLocaleTimeString());
  await browserLunch();
  console.log("browserLunch", new Date().toLocaleTimeString());

  await browserClose();
  console.log("browserClose", new Date().toLocaleTimeString());

  await browserLunchClose();
  console.log("browserLunchClose", new Date().toLocaleTimeString());

  await browserAndPageLunchClose();
  console.log("browserAndPageLunchClose", new Date().toLocaleTimeString());

  await singleBrowserNewPage();
  console.log("singleBrowserNewPage", new Date().toLocaleTimeString());

  await pageSetContentNewBrowserPage();
  console.log("pageSetContentNewBrowserPage", new Date().toLocaleTimeString());

  await pageSetContentNewPage();
  console.log("pageSetContentNewPage", new Date().toLocaleTimeString());

  await pageSetOnlyContent();
  console.log("pageSetOnlyContent", new Date().toLocaleTimeString());

  fs.writeFileSync("./log.json", JSON.stringify(data));
})();
