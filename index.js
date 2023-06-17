const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const { query } = require("./services/dbService");
const multer = require("multer");
const OracleDB = require("oracledb");
const { v4: uuidv4 } = require("uuid");

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

  var shop_id = "A" + uuidv4().slice(0, 11);
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

app.post("/api/service/create", async (req, res, next) => {
  console.log(req.body);
  const { shop_id, type, chargePerUnit, eta, availability } = req.body;

  var service_id = "S" + uuidv4().slice(0, 9);
  console.log(service_id);

  try {
    const serviceResult = await query(
      `INSERT INTO service (SERVICE_ID, SERVICE_NAME, SERVICE_CHARGE_PER_UNIT, ESTIMATED_TIME_IN_MIN_REQUIRED, SERVICE_AVAILABILITY) 
       VALUES (:service_id, :type, :chargePerUnit, :eta, :availability)`,
      {
        service_id,
        type,
        chargePerUnit,
        eta,
        availability,
      }
    );

    if (serviceResult.rowsAffected == 1) {
      var providesResult = await query(
        `INSERT INTO provides (SHOP_ID, SERVICE_ID) 
         VALUES (:shop_id, :service_id)`,
        {
          shop_id,
          service_id,
        }
      );
    }

    console.log("serviceResult", serviceResult);
    console.log("providesResult", providesResult);

    res.status(200).send({
      serviceCreated: serviceResult.rowsAffected == 1 ? true : false,
      providesCreated: providesResult.rowsAffected == 1 ? true : false,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while creating the service." });
  }
});

app.put("/api/service/update", async (req, res, next) => {
  console.log(req.body);
  const { service_id, type, chargePerUnit, eta, availability } = req.body;

  let updateFields = [];
  let bindValues = {};

  // Check which fields are present in the request body and add them to the updateFields array
  if (type) {
    updateFields.push("SERVICE_NAME = :type");
    bindValues.type = type;
  }
  if (chargePerUnit) {
    updateFields.push("SERVICE_CHARGE_PER_UNIT = :chargePerUnit");
    bindValues.chargePerUnit = chargePerUnit;
  }
  if (eta) {
    updateFields.push("ESTIMATED_TIME_IN_MIN_REQUIRED = :eta");
    bindValues.eta = eta;
  }
  if (availability == 1 || availability == 0) {
    updateFields.push("SERVICE_AVAILABILITY = :availability");
    bindValues.availability = availability;
  }

  let queryString = `UPDATE service SET ${updateFields.join(
    ", "
  )} WHERE service_id = :service_id`;
  bindValues.service_id = service_id;

  console.log("queryString", queryString);

  try {
    const result = await query(queryString, bindValues);

    console.log("result", result);
    res
      .status(200)
      .send({ serviceUpdated: result.rowsAffected == 1 ? true : false });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while updating the shop." });
  }
});

app.delete("/api/service/delete/:serviceId", async (req, res, next) => {
  const serviceId = req.params.serviceId;

  try {
    const deleteServiceResult = await query(
      `DELETE FROM service WHERE SERVICE_ID = :serviceId`,
      {
        serviceId,
      }
    );

    const deleteProvidesResult = await query(
      `DELETE FROM provides WHERE SERVICE_ID = :serviceId`,
      {
        serviceId,
      }
    );

    console.log("deleteServiceResult", deleteServiceResult);
    console.log("deleteProvidesResult", deleteProvidesResult);

    if (
      deleteServiceResult.rowsAffected > 0 ||
      deleteProvidesResult.rowsAffected > 0
    ) {
      res.status(200).send({ serviceDeleted: true });
    } else {
      res.status(404).send({ error: "Service not found." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the service." });
  }
});

app.get("/api/shops/:shopId", async (req, res, next) => {
  const { shopId } = req.params;
  console.log("Shopid", shopId);

  const services = await query(
    `SELECT *
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

app.post("/api/auth/signup/customer", async (req, res, next) => {
  const { email, phone, name, password } = req.body;

  console.log(req.body);

  const cust_id = "CS" + uuidv4().slice(0, 8);
  console.log(cust_id);

  try {
    const result = await query(
      `INSERT INTO CUSTOMERS (cust_id, cust_name, cust_phone, cust_email, cust_pass) VALUES (:cust_id, :name, :phone, :email, :password)`,
      {
        cust_id,
        name,
        phone,
        email,
        password,
      }
    );

    console.log("result", result);
    res.send({
      userCreated: result.rowsAffected == 1 ? true : false,
      CUST_ID: cust_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while signing up." });
  }
});

app.post("/api/auth/login/customer", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    // Perform authentication logic here, e.g., checking credentials against the database
    // You can use the query function or any other method to retrieve the customer details
    const customer = await query(
      `SELECT * FROM CUSTOMERS WHERE cust_email = :email AND cust_pass = :password`,
      { email, password }
    ).then((data) => data.rows[0]);

    if (customer) {
      console.log(customer);
      // Customer login successful
      res.status(200).send(customer);
    } else {
      // Invalid credentials
      res.status(401).send({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while logging in." });
  }
});

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`Smart Printer app listening on port ${port}`);
});
