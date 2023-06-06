const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const { query } = require("./services/dbService");

require("dotenv").config();

const port = process.env.PORT || 3000;

// Middleware Array
const middleware = [
  logger("dev"),
  cors(),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
];

app.use(middleware);

app.get("/api/shops", async (req, res, next) => {
  const search_by_service = (req.query.search_by_service || "").toUpperCase();
  const district = (req.query.district || "").toUpperCase();
  const city = (req.query.city || "").toUpperCase();
  const area = (req.query.area || "").toUpperCase();

  console.log(req.query);

  if (search_by_service) {
    const result = await query(
      `SELECT *
		FROM provides 
		JOIN service using(service_ID)
		JOIN shop using(shop_id)
		WHERE service_id IN (
			SELECT service_id
			FROM service
			where UPPER(service_name) like '%${search_by_service}%'
		)
		and UPPER(shop_location_district) like '%${district}%'
		and UPPER(shop_location_city) like '%${city}%'
		and UPPER(shop_location_area) like '%${area}%'
		`
    );
    res.send(result);
  } else {
    const result = await query(
      `SELECT distinct(shop_id), shop_name, SHOP_LOCATION_DISTRICT, SHOP_LOCATION_CITY, SHOP_LOCATION_AREA, SHOP_ACTIVE_HOURS
		FROM provides 
		JOIN service using(service_ID)
		JOIN shop using(shop_id)
		where UPPER(shop_location_district) like '%${district}%'
		and UPPER(shop_location_city) like '%${city}%'
		and UPPER(shop_location_area) like '%${area}%'
		`
    );
    res.send(result);
  }

  // res.send([]);
});

app.get("/api/shops/:shopId", async (req, res, next) => {
  const { shopId } = req.params;
  console.log("Shopid", shopId);

  const services = await query(
    `SELECT SERVICE_ID, SERVICE_NAME, SERVICE_CHARGE_PER_UNIT, ESTIMATED_TIME_IN_MIN_REQUIRED
	  FROM provides
	  JOIN service USING(service_id)
	  WHERE shop_id = '${shopId}'
	  `
  );

  const shop = await query(
    `SELECT * from shop
	  WHERE shop_id = '${shopId}'
	  `
  );

  //inserting the service info to shop
  if (shop[0]) {
    shop[0].SHOP_SERVICES = services;
    res.send(shop[0]);
  } else {
    res.send({});
  }
});

app.post("/api/signup/customer", async (req, res, next) => {
  const { email, phone, name, password } = req.body;

  console.log(req.body);

  var currentTime = new Date().getTime();
  var customer_id = "CS-" + currentTime.toString().slice(-7);
  console.log(customer_id);

  //   console.log(newCustomer);
  const result = await query(
    `INSERT INTO CUSTOMERS (cust_id, cust_name, cust_phone, cust_email, cust_pass) VALUES ('${customer_id}','${name}','${phone}','${email}','${password}')`
  );
  res.send({});
});

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`Smart Printer app listening on port ${port}`);
});
