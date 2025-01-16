const puppeteer = require("puppeteer"); // ^3.2.3
const fs = require("fs");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth"); // ^2.9.0
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { saveAPage } = require("./saveAPage");
// const {getUrl} = require("./getSessionIdUrl");
require('dotenv').config();

// puppeteer.use(StealthPlugin());
const startCity = async ({ endpoint }) => {
  const blockedResourceTypes = [
    'beacon',
    'csp_report',
    'font',
    'image',
    'imageset',
    'media',
    'object',
    'texttrack',
    'stylesheet',
  ];
  const username = process.env.USERNAME_SCRAPE;
  // const password = "geoCode=us";
  const address = process.env.ADDRESS_SCRAPE;
  // const address = "186.251.255.141:31337"


  const browser = await puppeteer.launch({
      args: [ `--proxy-server=http://${address}` ],
      acceptInsecureCerts: true,
      headless: true
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on('request', request => {
    if (blockedResourceTypes.indexOf(request.resourceType()) !== -1) {
      console.log(`Blocked type:${request.resourceType()} url:${request.url()}`)
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.authenticate({username});

  await saveAPage({ 
    page, 
    endpoint,
    folder: "cities",
    city: "portoAlegre" 
  });

  await page.screenshot({
    path: 'hn.png',
    fullPage: true
  });

  await browser.close();
};

(async() => {
  await startCity({
    endpoint: "/Hotels-g303546-Porto_Alegre_State_of_Rio_Grande_do_Sul-Hotels.html"
  })

  let total = 10000;
  let counter = 0;

  while(total - counter > 30) {
    let data = "";
    console.log('aqui');

    if(counter === 0) {
      data = fs.readFileSync("src/pages/cities/portoAlegre/Hotels-g303546-Porto_Alegre_State_of_Rio_Grande_do_Sul-Hotels.txt");
      data = data.toString();
      const dom = new JSDOM(data);
      
      if(counter === 0) {
          dom.window.document.querySelectorAll('.Ci').forEach((elem) => {
              total = elem.textContent.split(" ");
              total = total.pop();
              total = Number(total.replace(",", ""));
          });
      }
    }
    counter += 30;
    console.log(total, counter);

    await startCity({
      endpoint: `/Hotels-g303546-oa${counter}-Porto_Alegre_State_of_Rio_Grande_do_Sul-Hotels.html`
    }); 
  }
})();