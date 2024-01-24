import puppeteer from 'puppeteer';
import fs from 'fs';
if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(dotenv => dotenv.config());
}

const fileName = (name = 'photo') => {
  const timestamp = Date.now();
  const dirName = 'schreenshots';
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
  return { path: `${dirName}/${timestamp}-${name}.png` };
};

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://elektra.ksh.hu/');
  const pageTarget = page.target();
  await page.click('#side > ul > li:nth-child(2) > a');
  const newTarget = await browser.waitForTarget(
    target => target.opener() === pageTarget
  );
  const newPage = await newTarget.page({ waitUntil: 'networkidle2'});
  await newPage.screenshot(fileName('newPage'));
  await newPage.waitForSelector('#main-left > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > input');
  await newPage.type('#main-left > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > input', process.env.MY_TORZSSZAM);
  await newPage.type('#main-left > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input', process.env.MY_USERNAME);
  await newPage.type('#main-left > form > table > tbody > tr:nth-child(3) > td:nth-child(2) > input', process.env.MY_PASSWORD);
  // await newPage.click('#main-left > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > security:csrfinput > input');
  await newPage.screenshot(fileName('withInputs'));
  // await browser.close();
})();
