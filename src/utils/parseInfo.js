const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
// const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize();

// const Hotel = sequelize.define('Hotel', {
//     hotelName: DataTypes.STRING,
//     location: DataTypes.NUMBER,
//     rooms: DataTypes.NUMBER,
//     value: DataTypes.NUMBER,
//     cleanliness: DataTypes.NUMBER,
//     service: DataTypes.NUMBER,
//     sleepQuality: DataTypes.NUMBER
// });

const parseInfo = async () => {
    let urls = fs.readFileSync("src/data/urls.json");
    urls = JSON.parse(urls);
    urls = urls.array

    // urls.forEach((url) => {
    let hotelName = ""
    const test = urls[0].replace(".html", ".txt");
    console.log(test);
    let data = fs.readFileSync(`src/pages/hotels/florianopolis${test}`);
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

    const result = {};
    result.hotelName = hotelName;
    
    Object.keys(content).forEach((key) => {
        if (key === "Location") {
            result.hotelName.location = content[key]
        } else if (key === "Rooms") {
            result.hotelName.rooms = content[key]
        } else if (key === "Value") {
            result.hotelName.value = content[key]
        } else if (key === "Cleanliness") {
            result.hotelName.cleanliness = content[key]
        } else if(key === "Service") {
            result.hotelName.service = content[key]
        } else if (key === "Sleep Quality") {
            result.hotelName.sleepQuality = content[key]
        }
    })

    // await Hotel.create(result)
    // })
};

parseInfo();

module.exports = {
    parseInfo,
}