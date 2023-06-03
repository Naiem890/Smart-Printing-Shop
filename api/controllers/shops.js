const { query } = require("../../services/dbService");

exports.createShop = async (req, res, next) => {};

exports.getShops = async (req, res, next) => {
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
};

exports.getShop = async (req, res, next) => {
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
};

exports.addShop = async (req, res, next) => {
  const result = await query(
    "INSERT INTO CSE_TEACHERS (NAME, DESIGNATION, MAIL, SALARY) VALUES ('Solaiman','Lec','solaiman@yahoo.com',100000)"
  );
  res.send(result);
};
