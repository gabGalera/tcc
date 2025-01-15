const puppeteer = require("puppeteer"); // ^3.2.3
const fs = require('fs');
const { saveAPage } = require('./saveAPage');
require('dotenv').config();

const run = async () => {
    let urls = fs.readFileSync("src/data/urls.json");
    urls = JSON.parse(urls);
    urls = urls.array;

    const total = urls.length;
    let count = 374;
    
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
        ];
        const username = process.env.USERNAME;
        // const password = "geoCode=us";
        const address = process.env.ADDRESS;
        // const address = "186.251.255.141:31337"
    
    
        const browser = await puppeteer.launch({
            args: [ `--proxy-server=http://${address}` ],
            acceptInsecureCerts: true,
            headless: false
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
            city: "curitiba", 
        })

        await browser.close();
        count += 1
        console.log(count + " / " + total)
    }
}

run();