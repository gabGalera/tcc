const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('db', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});

const Hotel = sequelize.define('Hotel', {
        hotelName: DataTypes.STRING,
        location: DataTypes.NUMBER,
        rooms: DataTypes.NUMBER,
        value: DataTypes.NUMBER,
        cleanliness: DataTypes.NUMBER,
        service: DataTypes.NUMBER,
        sleepQuality: DataTypes.NUMBER,    
        city: DataTypes.STRING,    
    }, 
    {   
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    });

const parseInfo = async ({ city }) => {
    console.log(Hotel)
    let urls = fs.readFileSync(`src/pages/urls/${city}.json`);
    urls = JSON.parse(urls);
    urls = urls.array
    let counter = 0;
    while (counter < urls.length) {
        console.log(counter + 1, " / ", urls.length);

        let hotelName = "";
        const test = urls[counter].replace(".html", ".txt");
        let data = fs.readFileSync(`src/pages/hotels/${city}${test}`);
        data = data.toString();
        const dom = new JSDOM(data);

        const content = {};
        const values = []

        dom.window.document.querySelectorAll('.jxnKb > .q').forEach((elem) => {
            values.push(elem.textContent)
        });

        dom.window.document.querySelectorAll('.jxnKb > .o').forEach((elem, index) => {
            if(values[index]) {
                content[elem.textContent] = values[index]
            }
        });

        dom.window.document.querySelectorAll('#HEADING').forEach((elem) => {
            hotelName = elem.textContent.replace("If you own this business, claim it for free now to update business info, respond to reviews, and more.Claim this listing", "");
        });

        let result = {
            hotelName,
            city
        };

        Object.keys(content).forEach((key) => {
            if (key === "Location") {
                result.location = content[key]
            } else if (key === "Rooms") {
                result.rooms = content[key]
            } else if (key === "Value") {
                result.value = content[key]
            } else if (key === "Cleanliness") {
                result.cleanliness = content[key]
            } else if(key === "Service") {
                result.service = content[key]
            } else if (key === "Sleep Quality") {
                result.sleepQuality = content[key]
            }
        });


        await Hotel.create(result);
        // console.log(testing);

        counter += 1;
    }
   
    // console.log(result)
};

(async() => {
    await parseInfo({ city: "portoAlegre" });
    sequelize.close();
})();

module.exports = {
    parseInfo,
}