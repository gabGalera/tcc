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
            data = fs.readFileSync("src/pages/cities/portoAlegre/Hotels-g303546-Porto_Alegre_State_of_Rio_Grande_do_Sul-Hotels.txt");
        } else {
            //
            data = fs.readFileSync(`src/pages/cities/portoAlegre/Hotels-g303546-oa${counter}-Porto_Alegre_State_of_Rio_Grande_do_Sul-Hotels.txt`);
        }
        data = data.toString();
        
        const dom = new JSDOM(data);
    
        let values = [];
        
        dom.window.document.querySelectorAll('[href*="/Hotel_Review"]').forEach((elem) => {
            values.push(elem.href);
        });
        
        console.log(values)

        values = values.filter((value) => !value.includes("#REVIEWS") && value.includes("Porto_Alegre"));
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
        fs.writeFileSync(`src/data/portoAlegre.json`, JSON.stringify(urls));
        counter += 30
    }
}

run()