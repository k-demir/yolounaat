const request = require("request");
const rp = require("request-promise");
const async = require('async');
const cheerio = require("cheerio");

let info = [];

async function getUnica(unicaRestaurants) {
  unicaRestaurants.forEach(function(restaurant) {
    request(restaurant,  function(error, response, body) {
      const $ = cheerio.load(body);

      let restaurantName = $(".head h1").text();
      let weeksPortions = [];

      for (let j = 0; j < 7; j++) {
        let daysPortions = [];

        for (let i = 0; i < $("h4[data-dayofweek='" + j + "']+table .lunch").length; i++) {
          if ($("h4[data-dayofweek='" + j + "']+table .lunch").eq(i).text().length > 1) {
            let portion = {
              meal: $("h4[data-dayofweek='" + j + "']+table .lunch").eq(i).text().replace("*", ""),
              price: $("h4[data-dayofweek='" + j + "']+table .price").eq(i).text().replace(/(\t|\n)/gm,"")
                .replace("Hinta:", "")
                .replace(/\/.*/, " €"),
              allergies: ""
            };

            $("h4[data-dayofweek='" + j + "']+table .limitations").eq(i).children().each(function(idx) {
              a = $("h4[data-dayofweek='" + j + "']+table .limitations").eq(i).children().eq(idx).text();
              if (a === "VEG") {
                portion.allergies += "Veg ";
              }
              if (a === "L") {
                portion.allergies += "L ";
              }
              if (a === "M") {
                portion.allergies += "M ";
              }
              if (a === "G") {
                portion.allergies += "G ";
              }

            });
            if (restaurantName == "Piccu Maccia" && portion.price.charAt(1) == '-') {
              continue;
            }
            daysPortions.push(portion);
          }
        }
        weeksPortions.push(daysPortions);
      }

      info.push({
        name: restaurantName,
        portions: weeksPortions
      });
    });
  });
}

async function getSodexo(sodexoRestaurants) {
  let dates = [];
  let sodexoInfo = [];

  let dt = new Date();
  let day = dt.getDay() === 0 ? 6 : dt.getDay() - 1;
  dt.setDate(dt.getDate()-day);

  for (let i = 0; i < 6; i++) {
    let dt2 = new Date(dt.getTime());
    dt2.setDate(dt2.getDate() + i);
    let date = dt2.getFullYear() + "/" + ('0' + (dt2.getMonth()+1)).slice(-2) + "/" + ('0' + dt2.getDate()).slice(-2);
    dates.push(date);
  }

  for (let i = 0; i < sodexoRestaurants.length; i++) {
    let restaurantInfo = [];
    for (let j = 0; j < dates.length; j++) {
      restaurantInfo.push(sodexoRestaurants[i] + dates[j] + "/fi");
    }
    sodexoInfo.push(restaurantInfo);
  }
  for (let sInfo of sodexoInfo) {
    let weeksPortions = [];
    let restaurantName = "";
    await rp(sInfo[0]).then(async function(b) {
      restaurantName = JSON.parse(b).meta.ref_title;
    });
    for (let jsonAddress of sInfo) {
      let daysPortions = [];
      await rp(jsonAddress).then(async function(body) {
        let sodexoJson = JSON.parse(body);

        for (let portion of sodexoJson.courses) {
          restaurantName = sodexoJson.meta.ref_title;
          let allergies = "";

          if (portion.category != undefined && portion.category == "Vegaani") {allergies += "Veg ";}
          if (portion.properties != undefined) {
            if (portion.properties.includes("L")) {allergies += "L ";}
            if (portion.properties.includes("M")) {allergies += "M ";}
            if (portion.properties.includes("G")) {allergies += "G ";}
          }
          daysPortions.push({
            meal: portion.title_fi,
            price: (portion.price != undefined ? portion.price + " €" : "").replace(/\/.*/, " €"),
            allergies: allergies
          });
        }
      });
      weeksPortions.push(daysPortions);
    }
    info.push({
      name: restaurantName,
      portions: weeksPortions
    });
  }
}

async function getMonttu(monttu) {
  let menuTypeIds = ["60", "77"]
  let dates = [];

  let dt = new Date();
  let day = dt.getDay() === 0 ? 6 : dt.getDay() - 1;
  dt.setDate(dt.getDate()-day);

  for (let i = 0; i < 5; i++) {
    let dt2 = new Date(dt.getTime());
    dt2.setDate(dt2.getDate() + i);
    let date = ('0' + dt2.getDate()).slice(-2)  + "." + ('0' + (dt2.getMonth()+1)).slice(-2) + "." + dt2.getFullYear();

    dates.push(date);
  }

  let weeksPortions = [];

  for (let date of dates) {
    let daysPortions = [];
    for (let menuType of menuTypeIds) {
      await rp(monttu[0] + menuType + monttu[1] + date + monttu[2]).then(async function(body) {
        body = body.slice(82, -9);

        let monttuJson = JSON.parse(body);

        for (let portion of monttuJson.MealOptions) {
          let meal = "";
          let price = "";
          let allergies = "";
          let g = true;
          let l = true;
          let veg = true;
          let m = true;

          if (portion.Price == "4.54") {
            price = "2,60 €";
          }

          for (let ml of portion.MenuItems) {
            if (ml.Name_FI) {
              meal += (!meal ? ml.Name_FI : ", " + ml.Name_FI.toLowerCase());

              if (!ml.Diets.includes("VE,") || !ml.Diets.includes(",VE")) {
                veg = false;
              }
              if (!ml.Diets.includes("L,") || !ml.Diets.includes(",L")) {
                l = false;
              }
              if (!ml.Diets.includes("M,") || !ml.Diets.includes(",M")) {
                m = false;
              }
              if (!ml.Diets.includes("G,") || !ml.Diets.includes(",G")) {
                g = false;
              }
            }
          }

          if (g === true) {allergies += "G ";}
          if (l === true) {allergies += "L ";}
          if (m === true) {allergies += "M ";}
          if (veg === true) {allergies += "Veg ";}

          if (meal) {
            daysPortions.push({
              meal: meal,
              price: price,
              allergies: allergies
            });
          }
        }
      });
    }
    weeksPortions.push(daysPortions);
  }

  info.push({
    name: "Monttu",
    portions: weeksPortions
  });
}


async function getStudentlunch(slRestaurant) {
  const restaurantIds = {
    1: "Café Arken",
    2: "Café Gadolinia",
    3: "Café Kåren",
    4: "Café Fänriken"
  }

  let dt = new Date();
  let currentYear = dt.getFullYear();
  let currentDayOfWeek = (dt.getDay()!=0 ? dt.getDay()-1 : 6);
  let jan1 = new Date(currentYear, 0, 1);
  let jan1DayOfWeek = (jan1.getDay()!=0 ? jan1.getDay()-1 : 6);
  let daysFromJan1 = Math.floor((dt - jan1)/(1000*60*60*24));
  let week = Math.floor((daysFromJan1 + 6) / 7);
  if (currentDayOfWeek < jan1DayOfWeek) {
    week++;
  }

  for (let i=1; i <= 4; i++) {
    (function(i) {
      request(slRestaurant + "id=" + i + "&year=" + currentYear + "&week=" + (week<10 ? "0"+week : week), function(error, response, body) {
        const $ = cheerio.load(body);

        let restaurantName = restaurantIds[i];
        let weeksPortions = [];

        let empty_days = 0;

        for (let j = 0; j < 6; j++) {
          let daysPortions = [];

          let day = $("table[class=week-list]").eq(j);
          if (day.find($("tbody")).length > 0) {
            day = $("table[class=week-list] tbody").eq(j - empty_days);
            for (let k = 0; k < day.children("tr").length; k++) {
              if (day.children("tr").eq(k).children(".food").text().length > 2) {
                let item = {
                    meal: day.children("tr").eq(k).children(".food").text().replace("*", ""),
                    price: (day.children("tr").eq(k).children(".price-student").text().length > 2 ?
                      day.children("tr").eq(k).children(".price-student").text() :
                      ""),
                    nutrientContent: "",
                    allergies: ""
                };
                if (day.children("tr").eq(k).children(".food").children("a").attr("title") != undefined) {
                  item.nutrientContent = day.children("tr").eq(k).children(".food").children("a").attr("title");
                }

                day.children("tr").eq(k).children(".food-allergies").children(".food-diet").each(function(idx) {
                  a = day.children("tr").eq(k).children(".food-allergies").children(".food-diet").eq(idx).text();
                  if (a === "Vgn") {
                    item.allergies += "Veg ";
                  }
                  if (a === "L") {
                    item.allergies += "L ";
                  }
                  if (a === "M") {
                    item.allergies += "M ";
                  }
                  if (a === "G") {
                    item.allergies += "G ";
                  }
                });

                daysPortions.push(item);
              }
            }
          } else {
            empty_days += 1;
          }
          weeksPortions.push(daysPortions);
        }

        info.push({
            name: restaurantName,
            portions: weeksPortions
        });
      });
    })(i);
  }
}


async function getInfo() {
  let unicaRestaurants = ["http://www.unica.fi/fi/ravintolat/assarin-ullakko/",
                  "http://www.unica.fi/fi/ravintolat/brygge/",
                  "http://www.unica.fi/fi/ravintolat/delica/",
                  "http://www.unica.fi/fi/ravintolat/deli-pharma/",
                  "http://www.unica.fi/fi/ravintolat/dental/",
                  "http://www.unica.fi/fi/ravintolat/galilei/",
                  "http://www.unica.fi/fi/ravintolat/macciavelli/",
                  "http://www.unica.fi/fi/ravintolat/linus/",
                  "http://www.unica.fi/fi/ravintolat/piccu-maccia/",
                  "http://www.unica.fi/fi/ravintolat/tottisalmi/"];
  let sodexoRestaurants = ["https://www.sodexo.fi/ruokalistat/output/daily_json/34666/",  // Flavoria
                  "https://www.sodexo.fi/ruokalistat/output/daily_json/54/",              // ICT
                ];
  let monttu = ["http://juvenes.fi/DesktopModules/Talents.LunchMenu/LunchMenuServices.asmx/GetMenuByDate?KitchenId=50&MenuTypeId=", "&Date=", "&lang=fi"]
  let slRestaurants = ["http://www.studentlunch.fi/fi/lounas/viikonlista?"]


  await Promise.all([
    getSodexo(sodexoRestaurants),
    getUnica(unicaRestaurants),
    getMonttu(monttu),
    getStudentlunch(slRestaurants)
  ]);
}

getInfo();

module.exports = info
