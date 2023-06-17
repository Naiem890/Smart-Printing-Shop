const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const { query } = require("./services/dbService");
const multer = require("multer");
const OracleDB = require("oracledb");

require("dotenv").config();

const upload = multer({ storage: multer.memoryStorage() });

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

  let queryCondition = "";
  let queryParameters = {};

  if (search_by_service) {
    queryCondition = `service.service_id IN (
      SELECT
        service_id
      FROM
        service
      WHERE
        UPPER(service_name) LIKE :search_by_service
    )`;
    queryParameters.search_by_service = `%${search_by_service}%`;
  } else {
    queryCondition = "1 = 1"; // No filtering by service
  }

  const queryString = `
    SELECT
      t.shop_id,
      t.concatenated_services,
      t.shop_name,
      t.SHOP_LOCATION_DISTRICT,
      t.SHOP_LOCATION_CITY,
      t.SHOP_LOCATION_AREA,
      t.SHOP_ACTIVE_HOURS,
      s.SHOP_IMAGE
    FROM (
      SELECT
        shop.shop_id,
        LISTAGG(service.service_name, ', ') WITHIN GROUP (ORDER BY service.service_name) AS concatenated_services,
        MIN(shop.shop_name) AS shop_name,
        MIN(shop.SHOP_LOCATION_DISTRICT) AS SHOP_LOCATION_DISTRICT,
        MIN(shop.SHOP_LOCATION_CITY) AS SHOP_LOCATION_CITY,
        MIN(shop.SHOP_LOCATION_AREA) AS SHOP_LOCATION_AREA,
        MIN(shop.SHOP_ACTIVE_HOURS) AS SHOP_ACTIVE_HOURS
      FROM
        shop
        LEFT JOIN provides ON shop.shop_id = provides.shop_id
        LEFT JOIN service ON provides.service_id = service.service_id
      WHERE
        ${queryCondition}
        AND UPPER(shop.SHOP_LOCATION_DISTRICT) LIKE :district
        AND UPPER(shop.SHOP_LOCATION_CITY) LIKE :city
        AND UPPER(shop.SHOP_LOCATION_AREA) LIKE :area
      GROUP BY
        shop.shop_id
    ) t
    JOIN shop s ON t.shop_id = s.shop_id
  `;

  queryParameters.district = `%${district}%`;
  queryParameters.city = `%${city}%`;
  queryParameters.area = `%${area}%`;

  const result = await query(queryString, queryParameters);

  res.send({ data: result.rows, dataFetched: true });

  // res.send([]);
});

app.post("/api/shop/create", upload.single("image"), async (req, res, next) => {
  console.log("req.body", req.body);
  const { name, district, city, area, activeHour } = req.body;
  const image = req.file.buffer;

  console.log("img", image);

  var currentTime = new Date().getTime();
  var shop_id = "A" + currentTime.toString().slice(-11);
  console.log(shop_id);

  // const result = await query(
  //   `INSERT INTO shop (shop_id, shop_name, shop_location_district, shop_location_city, shop_location_area, shop_active_hours) VALUES ('${shop_id}', '${name}', '${district}', '${city}', '${area}', '${activeHour}')`
  // );

  try {
    const result = await query(
      `INSERT INTO shop (shop_id, shop_name, shop_location_district, shop_location_city, shop_location_area, shop_active_hours, shop_image) VALUES (:shop_id, :name, :district, :city, :area, :activeHour, :image)`,
      {
        shop_id,
        name,
        district,
        city,
        area,
        activeHour,
        image: { type: OracleDB.BLOB, val: image },
      }
    );

    console.log("result", result);
    res
      .status(200)
      .send({ shopCreated: result.rowsAffected == 1 ? true : false });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while creating the shop." });
  }
  // res.send();
});

app.put("/api/shop/update", upload.single("image"), async (req, res, next) => {
  console.log(req.body);
  const { shop_id, name, district, city, area, activeHour } = req.body;
  const image = req.file ? req.file.buffer : null;

  let updateFields = [];
  let bindValues = {};

  console.log("image", image);
  // Check if each field is provided and add it to the updateFields array
  if (name) {
    updateFields.push("shop_name = :name");
    bindValues.name = name;
  }
  if (district) {
    updateFields.push("shop_location_district = :district");
    bindValues.district = district;
  }
  if (city) {
    updateFields.push("shop_location_city = :city");
    bindValues.city = city;
  }
  if (area) {
    updateFields.push("shop_location_area = :area");
    bindValues.area = area;
  }
  if (activeHour) {
    updateFields.push("shop_active_hours = :activeHour");
    bindValues.activeHour = activeHour;
  }
  if (image) {
    updateFields.push("shop_image = :image");
    bindValues.image = { type: OracleDB.BLOB, val: image };
  }

  let queryString = `UPDATE shop SET ${updateFields.join(
    ", "
  )} WHERE shop_id = :shop_id`;
  bindValues.shop_id = shop_id;

  try {
    const result = await query(queryString, bindValues);

    console.log("result", result);
    res
      .status(200)
      .send({ shopUpdated: result.rowsAffected == 1 ? true : false });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while updating the shop." });
  }
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
  ).then((data) => data.rows);

  const shop = await query(
    `SELECT * from shop
	  WHERE shop_id = '${shopId}'
	  `
  ).then((data) => data.rows);

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
  ).then((data) => data.rows);

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

  res.status(200).send({ shopDeleted: true, deletedId: shopId });
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
