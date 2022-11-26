const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3000;
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { request } = require('express');
const e = require('express');

app.use(cookieParser());
app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

const connect = mysql.createConnection({
    // host : "localhost",
    // user : "root",
    // password : "0991947939",
    // database : "mydata"

    host : "localhost",
    user : "root",
    password : "bb18052545",
    database : "labsarb_user"
})

connect.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})
let tablename = "userInfo";
const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        connect.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post("/addDB",async (req,res) => {
    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userInfo (username, email, password) VALUES ("${req.body.username}", "${req.body.email}", "${req.body.password}")`;
    result = await queryDB(sql);
    console.log("New record created successfullyone");
    return res.redirect('login.html');
})

app.post('/checkLogin',async (req,res) => 
{ 
    let sql = `SELECT id, username, password FROM ${tablename}`;
    let result = await queryDB(sql);
    result = Object.assign({ }, result);
    console.log(result);
    const username = req.body.typeusername;
    const password = req.body.typepassword;

    let obj = Object.keys(result);
    var isCorrect = false;
    for (var i = 0; i < obj.length; i++) {
        var temp = result[obj[i]];
        var dataUsername = temp.username;
        var dataPassword = temp.password;
        if (dataUsername == username && dataPassword == password) {
            console.log("----");
            isCorrect = true;
            res.cookie('username', username);
        }
    }

    if (isCorrect == true) {
        console.log("login");
        res.redirect('shopping.html');
    }
    else {
        console.log("Try again");
        res.redirect('login.html?error=1');
    }
})

function getCookie(name) {
    var value = "";
    try {
        value = req.headers.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
        return value
    } catch (err) {
        return false
    }
}

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/Login.html`);
});