const getUrl = async ({page, city}) => {
    console.log('Entra na página')
    await page.goto('https://www.tripadvisor.com/Hotels', { waitUntil: "domcontentloaded", timeout: 60000 })
    
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
    console.log("aqui")
    
    await Promise.all([
        page.waitForNavigation({timeout: 60000}),
        searchBtn.click()
    ]);
    
    
    let url = page.url().split("?")
    console.log(url)
    
    url = url[0] + "?" + `q=${city}&geo=1&ssrc=h&searchNearby=false&` + url[1] 
    url = url.split("&")
    console.log(url)
    url.pop()
    
    url = url.join("&") + "&offset=0"
    return url
}

module.exports = {
    getUrl
}