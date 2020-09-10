const request = require("request")
const axios = require('axios')
const rp = require('request-promise')
const async = require('async')
const cheerio = require("cheerio")

let info = []

async function getUnica(unicaRestaurants, mondayDate) {
  unicaRestaurants.forEach(restaurant => {
    let weeksItems = []
    for (let i = 0; i < 7g; i++) {
      let dt = new Date(mondayDate.getTime())
      dt.setDate(dt.getDate() + i)
      let dateString = `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`
      let url = `https://www.unica.fi/api/restaurant/menu/day?date=${dateString}&language=fi&restaurantPageId=${restaurant[1]}`

      let daysItems = []
      axios
        .get(url)
        .then(res => {
          res.data['LunchMenu']['SetMenus'].forEach(menu => {
            let menuItem = menu['Name'] ? `${menu['Name']}: ` : ''
            menu['Meals'].forEach(meal => {
              menuItem += `${meal['Name']}, `
            })
            menuItem = menuItem.charAt(0).toUpperCase() + menuItem.slice(1).toLowerCase()
            daysItems.push({
              meal: menuItem.substring(0, menuItem.length - 2),
              price: menu['Price'] ? `${menu['Price'].substring(0, 4)} €` : '',
              allergies: null
            })
          })
        })
        .catch(err => console.log(err))
      weeksItems.push(daysItems)
    }
    info.push({
      name: restaurant[0],
      portions: weeksItems
    })
  })
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
  const unicaRestaurants = [
    ['Assarin ullakko', '297238'],
    ['Macciavelli', '297392'],
    ['Galilei', '299771'],
    ['Tottisalmi', '297547'],
    ['Kisälli', '297699'],
    ['Linus', '299809'],
    ['Delica', '297825'],
    ['Dental', '299819']
  ]
  const monttu = ["http://juvenes.fi/DesktopModules/Talents.LunchMenu/LunchMenuServices.asmx/GetMenuByDate?KitchenId=50&MenuTypeId=", "&Date=", "&lang=fi"]
  const slRestaurants = ["http://www.studentlunch.fi/fi/lounas/viikonlista?"]

  let currentDate = new Date()
  let mondayDate = new Date()
  let day = mondayDate.getDay() === 0 ? 6 : mondayDate.getDay() - 1
  mondayDate.setDate(mondayDate.getDate()-day)

  await Promise.all([
    getUnica(unicaRestaurants, mondayDate),
    getMonttu(monttu),
    getStudentlunch(slRestaurants)
  ])
}

getInfo()

module.exports = info
