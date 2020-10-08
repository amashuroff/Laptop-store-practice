const fs = require("fs"); // file system module
const http = require("http");
const url = require("url");

const jsonLaptops = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");

const laptopsData = JSON.parse(jsonLaptops);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  // PRODUCT OVERVIEW
  if (pathName === "/products" || pathName === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    fs.readFile(
      `${__dirname}/templates/template-overview.html`,
      "utf-8",
      (err, data) => {
        let overviewOutput = data;

        fs.readFile(
          `${__dirname}/templates/template-card.html`,
          "utf-8",
          (err, data) => {
            const cardsOutput = laptopsData
              .map((el) => replaceTemplate(data, el))
              .join("");

            overviewOutput = overviewOutput.replace("{%CARDS%}", cardsOutput);

            res.end(overviewOutput);
          }
        );
      }
    );
  }
  // LAPTOP DETAIL
  else if (pathName === "/laptop" && id < laptopsData.length) {
    res.writeHead(200, { "Content-type": "text/html" });

    fs.readFile(
      `${__dirname}/templates/template-laptop.html`,
      "utf-8",
      (err, data) => {
        const laptop = laptopsData[id];
        const replacedOutput = replaceTemplate(data, laptop);
        res.end(replacedOutput);
      }
    );
  }
  // IMAGES
  else if (/\.(jpeg|jpg|png|gif)$/i.test(pathName)) {
    fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
      res.writeHead(200, { "Content-type": "image/jpg" });
      res.end(data);
    });
  }

  // URL NOT FOUND
  else {
    res.writeHead(404, { "Content-type": "text/html" });

    res.end("Was not found on the server");
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("listening to events");
});

function replaceTemplate(originalHTML, laptop) {
  let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);
  return output;
}
