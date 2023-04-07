# **Smart printing shop**

### First clone the project and change to project directory

```
git clone https://github.com/Naiem890/Smart-Printing-Shop.git
cd Smart-Printing-Shop
```

### Now to checkout to smart-printer-server branch

```
git checkout smart-printer-server
```

### Create a .env file in root of the project and copy below configuration

```
PORT=3000
DB_USERNAME=YOUR_ORACLE_DB_USER_NAME
DB_PASS=YOUR_ORACLE_DB_PASS
```

Replace `YOUR_ORACLE_DB_USER_NAME` & `YOUR_ORACLE_DB_PASS` with your Oracle 11g Database User Name and Password

### Now install dependency and start the server

```
npm install
npm run dev
```

### **Some other pre-requisite to run this project**

- Node js >= 16
- Npm >= 8
- Oracle 11g express edition
