
const puppeteer = require('puppeteer')
const {getUrl} = require("./getSessionIdUrl")

const PROXY_USERNAME = 'scraperapi.max_cost=1';
const PROXY_PASSWORD = '88ceedc1ff73b66f37fd97c04974144e'; // <-- enter your API_Key here
const PROXY_SERVER = 'proxy-server.scraperapi.com';
const PROXY_SERVER_PORT = '8001';

puppeteer.launch({ 
  headless: false,
  ignoreHTTPSErrors: true,
  // userDataDir: "/home/gab_galera/.config/google-chrome/Default",
  args: [
      `--proxy-server=http://${PROXY_SERVER}:${PROXY_SERVER_PORT}`
  ],
  defaultViewport: false,

 }).then(async browser => {

  try {
    const page = await browser.newPage();
  
    await page.authenticate({
      username: PROXY_USERNAME,
      password: PROXY_PASSWORD,
    });

    const requestHeaders = {
        'referer': 'https://www.tripadvisor.com',
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'pt-BR,pt;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,es;q=0.4',
        'user-agent': "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      };
  
    await page.setExtraHTTPHeaders({
        ...requestHeaders
      });
   
    const city = "Miami"
    const url = await getUrl({page, city});

    console.log(url)
  
    await page.goto(url,{timeout: 600000, waitUntil: "networkidle0"})

    // await page.reload();
    await page.$$("text/Top results matching");

    let filterHotels = await page.$$("text/Hotels");
    // console.log(submitSearch);
    const test = await Promise.all(filterHotels.map(async (t) => {
      return await t.evaluate(x => {
        console.log(x)
        return x.className
      });
    }));
    
    console.log(test);

    // console.log(filterHotels);
    [filterHotels] = filterHotels;
    // filterHotels.click();
    // console.log(submitSearch)
    
    console.log('Página de hotéis');
    // // // const [btn] = await Promise.all([
    // // //   page.waitForSelector("a[href*='/Orlando']"),
    // // //   page.click("a[href*='/Orlando']"),
    // // // ]);
    // // // // const btn = await page.$$("a[class='bUIiC z _S _F Wc Wh Q B- _G']")
    // // // console.log(btn)
    
    // // // let result2 = [btn[0]].map(async (t) => {
    // // //     return await t.evaluate(x => x.className);
    // // // })
    // // // result2 = await Promise.all(result2)
    
    // // // console.log(result2)
    // // // console.log("acabou")
    // // // const [response]  = await Promise.all([
    // // //   page.waitForNavigation({waitUntil: "networkidle0"}),
    // // //   page.click("button[class='LhcRH _G _H B- G_ _S t u j H0']"),
    // // // ]);
    
    // // // console.log(response)
    
    // // // console.log('aqui 4')
  
    
    // // // page.on('request', interceptedRequest => {
    // // //   console.log(interceptedRequest)
    // // //   if (
    // // //     interceptedRequest.url().endsWith('.png') ||
    // // //     interceptedRequest.url().endsWith('.jpg')
    // // //   )
    // // //     interceptedRequest.abort();
    // // //   else interceptedRequest.continue();
    // // // });
    
    // // // const b = await page.$$("button")
    
    // // // let result3 = await Promise.all(b.map(async (t) => {
    // // //     return await t.evaluate(x => {
    // // //       console.log(x)
    // // //       return x.className
    // // //     });
    // // // }))
    
    // // console.log(result3)
  
    await page.screenshot({
      path: 'hn.png',
      fullPage: true
    });

    // await browser.close();
  } catch(error) {

    console.log(error)  
  }
})

