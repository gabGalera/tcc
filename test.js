const axios = require("axios");
const fs = require('fs');

// Data which will write in a file.


(async() => {
  const { data } = await axios({
    data: {
      apiKey: '88ceedc1ff73b66f37fd97c04974144e',
      urls: ["https://www.tripadvisor.com.br/Search?q=orlando&geo=1&ssrc=h&searchNearby=false&searchSessionId=0013e68224568629.ssid&offset=0"]
    },
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    url: 'https://async.scraperapi.com/jobs'
  });

  console.log(data);
  fs.writeFile('Output.txt', data, (err) => {

    // In case of a error throw err.
if (err) throw err;})
})();


// axios.get('https://www.tripadvisor.com.br/Search?q=orlando&geo=1&ssrc=h&searchNearby=false&searchSessionId=0013e68224568629.ssid&offset=0', {
//     method: 'GET',
//     proxy: {
//       host: 'proxy-server.scraperapi.com',
//       port: 8001,
//       auth: {
//         username: 'scraperapi',
//         password: '88ceedc1ff73b66f37fd97c04974144e'
//       },
//       protocol: 'http'
//     }
//   })
//     .then((response) => {
//         console.log(response);
//         // Write data in 'Output.txt' .
//         fs.writeFile('Output.txt', response.data, (err) => {

//             // In case of a error throw err.
//         if (err) throw err;
// })
//     })
//     .catch(console.error);