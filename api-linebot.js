const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
//const request = require("request");
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "db_name",
    multipleStatements: true //สามารถใช้ Query หบายตัวได้
});
con.query("SET NAMES utf8");

// const connectHosxp = mysql.createConnection({
//     host: "192.168.77.32",
//     user: "sa",
//     password: "sa",
//     database: "hos",
//     multipleStatements: true //สามารถใช้ Query หบายตัวได้
// });
// connectHosxp.query("SET NAMES utf8");

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());


// app.post("/update", function(req, res) {
//     let dateTime = req.body.dateTime;
//     let idUser =
//         req.body.idUser <= 7
//             ? "name_admin = '" + req.body.idUser + "'"
//             : "name_tech = '" + req.body.idUser + "'";

//     let sql =
//         "UPDATE ot_comcenter_new \
//             SET " +
//         idUser +
//         " \
//         WHERE  date_time = '" +
//         dateTime +
//         "'";
//     con.query(sql, function(err, result) {
//         if (err) {
//             throw err;
//         } else {
//             return res.json({
//                 status: 200,
//                 data: "success"
//             });
//         }
//     });
// });

app.post("/getOTofMonth", function (req, res) {
    let dateStart = req.body.dateStart;
    let sql =
        "SELECT DISTINCT admins.*,tech.nameTech \
        FROM ( \
            SELECT CONCAT(ot.date_time,'') dateTime,nc.name_comcenter AS nameAdmin,ot.name_admin,ot.name_tech  FROM ot_comcenter_new ot \
            INNER JOIN tb_name_comcenter nc ON ot.name_admin = nc.id_name \
            WHERE date_time BETWEEN date_add(date_add(LAST_DAY(CURDATE()),interval 1 DAY),interval -1 MONTH) \
            AND LAST_DAY(CURDATE()) \
        ) as admins \
        JOIN ( \
            SELECT DISTINCT nc.name_comcenter AS nameTech, ot.name_tech  FROM ot_comcenter_new ot \
            INNER JOIN tb_name_comcenter nc ON ot.name_tech = nc.id_name \
            WHERE date_time BETWEEN date_add(date_add(LAST_DAY(CURDATE()),interval 1 DAY),interval -1 MONTH) \
            AND LAST_DAY(CURDATE()) \
        ) as tech ON admins.name_tech = tech.name_tech";
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else {
            let data = JSON.stringify(result);
            let dataParse = JSON.parse(data);
            //console.log(dataParse);
            return res.json({
                dataParse
            });
        }
    });
});
// //Endpoint getDuty
// app.post("/getOTofMonth", function(req, res) {
//     let dateStart = req.body.dateStart;
//     let sql =
//         "SELECT CONCAT(date_time,'') date_time,name_admin,name_tech FROM ot_comcenter \
//         WHERE date_time BETWEEN date_add(date_add(LAST_DAY(CURDATE()),interval 1 DAY),interval -1 MONTH) \
//             AND LAST_DAY(CURDATE())";
//     con.query(sql, function(err, result) {
//         if (err) {
//             throw err;
//         } else {
//             let data = JSON.stringify(result);
//             let dataParse = JSON.parse(data);
//             //console.log(dataParse);
//             return res.json({
//                 dataParse
//             });
//         }
//     });
// });
app.post("/getDuty", function (req, res) {
    let dateStart = req.body.dateStart;
    let sql =
        "SELECT `name` FROM com_center WHERE date_time = '" + dateStart + "'";
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else {
            let data = JSON.stringify(result[0]);
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
    let dateStart = req.body.dateStart;
    let sql =
        "SELECT DISTINCT \
	admins.*, \
	tech.nameTech \
FROM \
	( \
	SELECT \
		EXTRACT( DAY FROM ot.date_time ) AS date_time, \
		nc.name_comcenter AS nameAdmin, \
		ot.name_admin, \
		ot.name_tech \
	FROM \
		ot_comcenter_new ot \
		INNER JOIN tb_name_comcenter nc ON ot.name_admin = nc.id_name \
	WHERE \
		ot.date_time BETWEEN ( CURDATE( ) ) \
		AND ( CURDATE( ) + INTERVAL 1 DAY ) \
	) AS admins \
	JOIN ( \
	SELECT \
		EXTRACT( DAY FROM ot.date_time ) AS date_time, \
		nc.name_comcenter AS nameTech, \
		ot.name_admin, \
		ot.name_tech \
	FROM \
		ot_comcenter_new ot \
		INNER JOIN tb_name_comcenter nc ON ot.name_tech = nc.id_name \
	WHERE \
		ot.date_time BETWEEN ( CURDATE( ) ) \
	AND ( CURDATE( ) + INTERVAL 1 DAY ) \
	) AS tech ON admins.name_tech = tech.name_tech";
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else {
            let data = JSON.stringify(result);
            let dataParse = JSON.parse(data);
            return res.json({
                dataParse
            });
        }
    });
});
//Endpoint getOT
// app.post("/getOT", function(req, res) {
//     let dateStart = req.body.dateStart;
//     let sql =
//         "SELECT EXTRACT(DAY FROM date_time) as date_time,name_admin,name_tech FROM ot_comcenter WHERE date_time BETWEEN (CURDATE()) AND (CURDATE() + INTERVAL 1 DAY)";
//     con.query(sql, function(err, result) {
//         if (err) {
//             throw err;
//         } else {
//             let data = JSON.stringify(result);
//             let dataParse = JSON.parse(data);
//             return res.json({
//                 dataParse
//             });
//         }
//     });
// });

app.get("/checkRegister/:userId", function (req, res) {
    let userId = req.params.userId;
    let sql =
        "SELECT *, '200' as code FROM register_queue_linebot WHERE userId = '" +
        userId +
        "'";
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else {
            let data = JSON.stringify(result[0]);
            let dataParse = "";
            if (data != undefined) {
                //console.log(data);
                dataParse = JSON.parse(data);
            } else {
                dataParse = {
                    code: 400
                };
            }
            return res.json({
                dataParse
            });
        }
    });
});

// app.post("/checkPttype", function(req, res) {
//     let userId = req.body.userId;
//     let sql =
//         "SELECT * FROM register_queue_linebot WHERE userId = '" + userId + "'";
//     con.query(sql, function(err, result) {
//         if (err) {
//             throw err;
//         } else {
//             let data = JSON.stringify(result[0]);
//             let dataParse = "";
//             if (data != undefined) {
//                 dataParse = JSON.parse(data);
//                 let cid = dataParse.cid;
//                 let sqlPttype =
//                     "SELECT pt.`name` as ptname, '200' as code FROM patient p LEFT JOIN pttype pt ON p.pttype = pt.pttype WHERE p.cid ='" +
//                     cid +
//                     "'";
//                 connectHosxp.query(sqlPttype, function(err, result) {
//                     let data = JSON.stringify(result[0]);
//                     let pttype = JSON.parse(data);
//                     return res.json({ pttype });
//                 });
//             } else {
//                 return res.json({
//                     pttype: {
//                         code: "400"
//                     }
//                 });
//             }
//         }
//     });
// });

// app.get("/getData/:keyword", function(req, res) {
//     let keyword = req.params.keyword;
//     let arr = keyword.split(" ");
//     let fname = arr[0]
//     let lname = arr[1]
//     let sql =
//         "SELECT CONCAT(fname,' ', lname) fullname ,cid, informaddr, informtel,CONCAT(birthday,'') as birthday FROM patient \
//         WHERE fname LIKE '%" +
//         fname +
//         "%' AND lname LIKE '%" +
//         lname +
//         "%'";
//     connectHosxp.query(sql, function(err, result) {
//         let data = JSON.stringify(result)
//         return res.json({ result });
//     });
// });

app.listen(process.env.PORT || 3000, function () {
    console.log("Server up and listening " + 3000);
});
