const { query } = require("../../services/dbService");

const shopModel = `
CREATE TABLE shop_owner (
  shop_owner_id NUMBER(10) PRIMARY KEY,
  shop_owner_name VARCHAR2(255),
  district VARCHAR2(255),
  city VARCHAR2(255),
  area VARCHAR2(255)
);
`;

exports.createShopOwner = async (req, res, next) => {};

exports.getShops = async (req, res, next) => {
  const result = await query(`
    CREATE TABLE shop (
      shop_id NUMBER(10) PRIMARY KEY,
      shop_name VARCHAR2(255),
      district VARCHAR2(255),
      city VARCHAR2(255),
      area VARCHAR2(255)
    );`);
  res.send(result);
};

exports.addShop = async (req, res, next) => {
  const result = await query(
    "INSERT INTO CSE_TEACHERS (NAME, DESIGNATION, MAIL, SALARY) VALUES ('Solaiman','Lec','solaiman@yahoo.com',100000)"
  );
  res.send(result);
};
