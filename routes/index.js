const { default: axios } = require("axios");
const cheerio = require("cheerio");
var express = require("express");
var router = express.Router();
var _ = require("lodash");

const URL =
  "https://www.salute.gov.it/portale/nuovocoronavirus/dettaglioContenutiNuovoCoronavirus.jsp?area=nuovoCoronavirus&id=5351&lingua=italiano&menu=vuoto";

async function scrapeData() {
  try {
    console.log("Scraping data...");
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);
    const item = $("div .col-md-3 div");
    var zone = [];
    var coloreZona = "";

    item.each((i, el) => {
      el.children.forEach((child) => {
        if (child.type === "script") {
          coloreZona = child.children[0].data.substring(
            15,
            child.children[0].data.length - 2
          );
          if (coloreZona === "noRegione") {
            return;
          }

          var objRegion = {
            [coloreZona]: [],
          };

          zone.push(objRegion);
        }

        if (child.type === "text") {
          _.last(zone)[coloreZona].push(child.data);
        }
      });
    });
    //console.log(zone)
    return zone;
  } catch (err) {
    console.log(err);
  }
}

/* GET home page. */
router.get("/", async function (req, res, next) {
  var result = await scrapeData();
  console.log(result);
  res.json(result);
});

module.exports = router;
