const puppeteer = require("puppeteer"); // ^3.2.3
const fs = require('fs');
const { saveAPage } = require('./saveAPage');
require('dotenv').config();

const getHotelsInfo = async ({
    city,
}) => {
    let urls = fs.readFileSync(`src/pages/urls/${city}.json`);
    urls = JSON.parse(urls);
    urls = urls.array;

    const total = urls.length;
    let count = 0;
    
    while(count < total) {
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
            'google'
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
            endpoint: urls[count],
            folder: "hotels",
            city, 
        })

        await browser.close();
        count += 1
        console.log(count + " / " + total)
    }
}

getHotelsInfo({
    city: "saoPaulo",
});