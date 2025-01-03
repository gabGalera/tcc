// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality

// ...
const puppeteer = require('puppeteer')

// add stealth plugin and use defaults (all evasion techniques)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())

const PROXY_USERNAME = 'scraperapi';
const PROXY_PASSWORD = '88ceedc1ff73b66f37fd97c04974144e'; // <-- enter your API_Key here
const PROXY_SERVER = 'proxy-server.scraperapi.com';
const PROXY_SERVER_PORT = '8001';

// http://proxy-server.scraperapi.com:8001
puppeteer.launch({ 
  headless: false,
  ignoreHTTPSErrors: true,
  args: [
      `--proxy-server=http://${PROXY_SERVER}:${PROXY_SERVER_PORT}`
  ],
  // defaultBrowser: "firefox",
  defaultViewport: false,
  // executablePath: "/opt/google/chrome/google-chrome",
  // userDataDir: "/home/gab_galera/.config/google-chrome/Default",
  // userDataDir: "./temp"
  // args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
 }).then(async browser => {
//  const browser = await puppeteer.launch({
//     headless: 'new',
// });
  try {
    const page = await browser.newPage();
  
    await page.authenticate({
      username: PROXY_USERNAME,
      password: PROXY_PASSWORD,
    });

    const requestHeaders = {
        'referer': 'https://www.tripadvisor.com.br',
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'pt-BR,pt;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,es;q=0.4',
        'user-agent': "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      };
  
    await page.setExtraHTTPHeaders({
        ...requestHeaders
      });
  
  page.on('request', request => {
    if(request.url().includes("api.scraperapi.com") && request.url().length < 10000) {
      let url = request.url()
      console.log('Request URL:', url);
      // url = url.replace("api.scraperapi.com", "tripadvisor")
    } 
    // console.log('Request URL:', request.url());

  });
  // // Navigate the page to a URL.
  
  console.log('Entra na página')
  await page.goto('https://www.tripadvisor.com', { waitUntil: "networkidle0", timeout: 60000 })
  // await page.setViewport({width: 1024, height: 20000});
  
  const acceptCokkies = await page.$("#onetrust-accept-btn-handler")
  console.log(acceptCokkies)
  await acceptCokkies.click()
  
  const searchHotels = await page.$("a[href*='/Hotels']")
  console.log(searchHotels)
  await searchHotels.evaluate(x => x.click());
  
  console.log('Abre a busca');
  let openSearch = await page.$$("button[class='rmyCe _G B- z _S c Wc wSSLS AeLHi huqcv']")
  console.log(openSearch);
  [openSearch] = openSearch
  await openSearch.evaluate(x => x.click());

  console.log('Digita o nome da cidade');
  const input = await page.waitForSelector('input[placeholder="Hotel name or destination"]');
  console.log(input)
  await input.type("Orlando")

  console.log('Clica no botão de busca');
  const searchBtn = await page.waitForSelector('button[class="LhcRH _G _H B- G_ _S t u j H0"]');
  // await page.click('button[class="LhcRH _G _H B- G_ _S t u j H0"]');
  
  await Promise.all([
    page.waitForNavigation({timeout: 60000}),
    searchBtn.click()
  ]);


  // let url = page.url().split("?")
  // console.log(url)

  // url[0] = "https://www.tripadvisor.com.br/Search"
  // url = url[0] + "?" + `q=Orlando&geo=1&ssrc=a&searchNearby=false&` + url[1] 
  // url = url.split("&")
  // console.log(url)
  // url.pop()
  
  // url = url.join("&") + "&offset=0"
  

  // url = `https://api.scraperapi.com/?api_key=88ceedc1ff73b66f37fd97c04974144e&url=${url}&max_cost=1`

  // url = url.replace(":", "%3A").replace("/", "%2F")
  // console.log(url)
  
  // await page.goto(url,{timeout: 60000, waitUntil: "networkidle0"})

  // let submitSearch = await page.$$("button[class='LhcRH _G _H B- G_ _S t u j H0']")
  // console.log(submitSearch);
  // // const test = await Promise.all(submitSearch.map(async (t) => {
  // //   return await t.evaluate(x => {
  // //     console.log(x)
  // //     return x.className
  // //   });
  // // }));
  // // console.log(test);
  // [submitSearch] = submitSearch;
  // console.log(submitSearch)
  
  console.log('Página de hotéis')
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
    })

    // await browser.close();
  } catch(error) {

    console.log(error)  
  }
})

