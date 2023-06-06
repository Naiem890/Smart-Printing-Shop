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
    const result = await query(`
      SELECT DISTINCT shop.shop_id, shop_name, SHOP_LOCATION_DISTRICT, SHOP_LOCATION_CITY, SHOP_LOCATION_AREA, SHOP_ACTIVE_HOURS
      FROM shop
      LEFT JOIN provides ON shop.shop_id = provides.shop_id
      LEFT JOIN service ON provides.service_id = service.service_id
      WHERE UPPER(shop_location_district) LIKE '%${district}%'
        AND UPPER(shop_location_city) LIKE '%${city}%'
        AND UPPER(shop_location_area) LIKE '%${area}%'
    `);

    res.send(result);
  }

  // res.send([]);
});

app.post("/api/shop/create", async (req, res, next) => {
  const { name, district, city, area, activeHour } = req.body;

  var currentTime = new Date().getTime();
  var shop_id = "A" + currentTime.toString().slice(-3);
  console.log(shop_id);

  const result = await query(
    `INSERT INTO shop (shop_id, shop_name, shop_location_district, shop_location_city, shop_location_area, shop_active_hours) VALUES ('${shop_id}', '${name}', '${district}', '${city}', '${area}', '${activeHour}')`
  );

  res.status(200).send({ shopCreated: true });
});

app.put("/api/shop/update", async (req, res, next) => {
  const { shop_id, name, district, city, area, activeHour } = req.body;

  console.log(req.body);

  const result = await query(
    `UPDATE shop
    SET shop_name = '${name}',
        shop_location_district = '${district}',
        shop_location_city = '${city}',
        shop_location_area = '${area}',
        shop_active_hours = '${activeHour}'
    WHERE shop_id = '${shop_id}'`
  );

  res.status(200).send({ shopUpdated: true });
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

app.delete("/api/shops/:shopId", async (req, res, next) => {
  const { shopId } = req.params;
  console.log("Shopid", shopId);

  const services = await query(
    `SELECT SERVICE_ID
	  FROM provides
	  WHERE shop_id = '${shopId}'
	  `
  );

  await query(
    `Delete 
	  FROM service
    WHERE service_id IN ('${services.map((s) => s.SERVICE_ID).join("', '")}')`
  );

  await query(
    `Delete 
	  FROM provides
    WHERE shop_id = '${shopId}'`
  );

  await query(
    `Delete 
	  FROM shop
    WHERE shop_id = '${shopId}'`
  );

  res.status(200).send({ shopDeleted: true });
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
