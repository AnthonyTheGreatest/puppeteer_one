import puppeteer from 'puppeteer';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const fileName = (name = 'photo') => {
  const timestamp = Date.now();
  const dirName = 'schreenshots';
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
  return { path: `${dirName}/${timestamp}-${name}.png` };
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://elektra.ksh.hu/');
  const pageTarget = page.target();
  await page.click('#side > ul > li:nth-child(2) > a');
  const newTarget = await browser.waitForTarget(
    target => target.opener() === pageTarget
  );
  const newPage = await newTarget.page({ waitUntil: 'networkidle2'});
  await newPage.screenshot(fileName('newPage'));
  await browser.close();
})();
