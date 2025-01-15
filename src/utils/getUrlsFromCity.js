const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const run = () => {
    let total = 10000000;
    let counter = 0;
    let urls = fs.readFileSync("src/data/urls.json");
    urls = JSON.parse(urls)

    while(total - counter > 0) {
        let data = "";
        if(counter === 0) {
            data = fs.readFileSync("src/pages/cities/florianopolis/Hotels-g303576-Florianopolis_State_of_Santa_Catarina-Hotels.txt");
        } else {
            //
            data = fs.readFileSync(`src/pages/cities/florianopolis/Hotels-g303576-oa${counter}-Florianopolis_State_of_Santa_Catarina-Hotels.txt`);
        }
        data = data.toString();
        
        const dom = new JSDOM(data);
    
        let values = [];
        
        dom.window.document.querySelectorAll('[href*="/Hotel_Review"]').forEach((elem) => {
            values.push(elem.href);
        });
        
        console.log(values)

        values = values.filter((value) => !value.includes("#REVIEWS") && value.includes("Florianopolis"));
        urls.array = [...urls.array, ...values]
        urls.array = [...new Set(urls.array)];
        
        if(counter === 0) {
            dom.window.document.querySelectorAll('.Ci').forEach((elem) => {
                total = elem.textContent.split(" ");
                total = total.pop().replace(",", "");
                total = Number(total)
            });
        }
        
        // console.log("length: ", urls.array.length);
        console.log(total, counter);
        fs.writeFileSync(`src/data/florianoplis.json`, JSON.stringify(urls));
        counter += 30
    }
}

run()