const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');
//const request = require("request");
const con = mysql.createConnection({
  host: "HOST",
  user: "USER",
  password: "PASS",
  database: "DB_NAME",
  multipleStatements: true //สามารถใช้ Query หบายตัวได้
});
con.query('SET NAMES utf8');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

//Endpoint getDuty
app.post("/getDuty", function (req, res) {
  let dateStart = req.body.dateStart
  let sql = "SELECT `name` FROM com_center WHERE date_time = '" + dateStart + "'"
  con.query(sql, function (err, result) {
    if (err) {
      throw err;
    } else {
      let data = JSON.stringify(result[0])
      let dataParse = JSON.parse(data);
      return res.json({
        dataParse
      });
      // let data = JSON.stringify(result[0])
      // let dataParse = JSON.parse(data);
      // console.log(dataParse.name);


    }
  });
});

//Endpoint getOT
app.post("/getOT", function (req, res) {
  let dateStart = req.body.dateStart
  let sql = "SELECT * FROM ot_comcenter WHERE date_time = '" + dateStart + "'"
  con.query(sql, function (err, result) {
    if (err) {
      throw err;
    } else {
      let data = JSON.stringify(result[0])
      let dataParse = JSON.parse(data);
      return res.json({
        dataParse
      });

    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server up and listening");
});
