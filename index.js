const puppeteer = require('puppeteer');
const {getUrl} = require("./getSessionIdUrl");

(async() => {
    const blockedResourceTypes = [
        'beacon',
        'csp_report',
        'font',
        'image',
        'imageset',
        'media',
        'object',
        'texttrack',
        // 'stylesheet',
    ];
    const username = "57abddde8c704fee8ef6350f28fe4be9a98f0009752";
    const password = "geoCode=us";
    const address = "proxy.scrape.do:8080";

    const browser = await puppeteer.launch({
        // args: [ `--proxy-server=http://${address}` ],
        acceptInsecureCerts:true,
        headless: false
    });
    
    const page = await browser.newPage();
    // We suggest you block resources for low concurrency and credit usage
    await page.setRequestInterception(true);
    // page.on('request', request => {
    //     if (blockedResourceTypes.indexOf(request.resourceType()) !== -1) {
    //         console.log(`Blocked type:${request.resourceType()} url:${request.url()}`)
    //         request.abort();
    //     } else {
    //         request.continue();
    //     }
    // });
    // await page.authenticate({username, password});
    await page.goto('https://www.tripadvisor.com/Hotel_Review-g34438-d85029-Reviews-InterContinental_Miami_an_IHG_hotel-Miami_Florida.html',

      {timeout: 600000, waitUntil: "networkidle0"}
    );
    
    // const city = "Miami";
    // const url = await getUrl({page, city});

    // console.log(url);
    
    // await page.goto(url,{timeout: 600000, waitUntil: "networkidle0"})

    // // await page.reload();
    // await page.$$("text/Top results matching");

    // await page.screenshot({
    //   path: 'hn.png',
    //   fullPage: true
    // });
    // await browser.close();
})();