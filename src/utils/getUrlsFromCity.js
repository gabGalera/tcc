const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const run = ({
    city,
    endpoint,
    cityNameTripAdvisor
}) => {
    let total = 10000000;
    let counter = 0;
    
    urls = { array: [] };
    const checkRepeated = [];

    while(total - counter > 0) {
        let data = "";
        if(counter === 0) {
            data = fs.readFileSync(`src/pages/cities/${city}${endpoint}`);
        } else {
            let nextPage = endpoint.split("-");
            nextPage = nextPage[0] + "-" + nextPage[1] + `-oa${counter}-` + nextPage[2] + "-" + nextPage[3];
            data = fs.readFileSync(`src/pages/cities/${city}${nextPage}`);
        }
        data = data.toString();
        
        const dom = new JSDOM(data);
    
        let values = [];
        
        dom.window.document.querySelectorAll('[data-automation="hotel-card-title"] > a').forEach((elem) => {
            // console.log(elem.href)
            values.push(elem.href);
        });
        
        
        // values = values.filter((value) => value.includes("#REVIEWS"));
        values = [...new Set(values)];
        
        values.forEach((value, index) => {
            if(urls.array.includes(value)){
                checkRepeated.push({
                    [`${counter} - ${index + 1}`]: value
                })
            }
        })

        urls.array = [...urls.array, ...values]
        // urls.array = [...new Set(urls.array)];
        // console.log(urls.array);
        // console.log(values)
        
        if(counter === 0) {
            dom.window.document.querySelectorAll('.Ci').forEach((elem) => {
                total = elem.textContent.split(" ");
                total = total.pop().replace(",", "");
                total = Number(total)
            });
        }
        
        // console.log("length: ", urls.array.length);
        console.log(counter, values.length);
        counter += 30
    }
    console.log(urls.array.length)
    urls.array = [ ...new Set(urls.array)]
    console.log(urls.array.length)
    console.log(checkRepeated.length)

    fs.writeFileSync(`src/pages/urls/${city}.json`, JSON.stringify(urls));
    fs.writeFileSync(`src/pages/urls/repeated.json`, JSON.stringify(checkRepeated));
}

run({
    city: "saoPaulo",
    endpoint: "/Hotels-g303631-Sao_Paulo_State_of_Sao_Paulo-Hotels.txt",
    cityNameTripAdvisor: "Sao_Paulo"
})