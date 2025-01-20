const fs = require("fs");

const saveAPage = async ({ 
  page, 
  endpoint,
  folder,
  city, 
}) => {
  await page.goto(`https://www.tripadvisor.com${endpoint}`,
    {waitUntil: "domcontentloaded", timeout: 1000000}
  );
  
  const data = await page.content({"waitUntil": "domcontentloaded"});
  let url = page.url();
  url = url.split("/");
  url = url.pop();
  url = url.replace(".html", "")  
  // console.log(data)
  
  let toSave = "src/pages/"
  toSave += `${folder}/`;
  
  if(city) {
    toSave += `${city}/`
  }
  toSave += `${url}.txt`
  
  fs.writeFile(toSave, data, (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully\n");
      // console.log("The written file has the following contents:");
    }
  });

  return { url, data }
}

module.exports = {
  saveAPage,
}