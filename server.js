const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3001;
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// ใส่ค่าตามที่เราตั้งไว้ใน mysql
const con = mysql.createConnection({
    // host: "127.0.0.1",
    // user: "root",
    // password: "1234",
    // database: "kaydatabase"

    host: "localhost",
    user: "root",
    password: "bb18052545",
    database: "labsarb_user"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

let tablename = "userInfo";

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

// create table and add data to database
app.post("/addDB",async (req,res) => {
    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100),Adress VARCHAR(100))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userInfo (username, password,email) VALUES ("${req.body.username}", "${req.body.password}","${req.body.email}")`;
    result = await queryDB(sql);
    console.log("New record created successfullyone");
    //res.end("New record created successfully");
    return res.redirect("login.html");
})

app.post("/checkLogin",async (req,res) => {
    console.log("check login");
    let sql = `SELECT id, username, password FROM ${tablename}`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
    
    console.log(result);
    // const username = req.body.username;
    // const password = req.body.password;

    let keys = Object.keys(result);
    var isCorrect = false;
    
    for(var i = 0; i < keys.length; i++){
        console.log(isCorrect);

        var data = result[keys[i]];
        var dataUsername = data.username;
        var dataPassword = data.password;

        if(dataUsername == req.body.username && dataPassword == req.body.password){
            isCorrect = true;
            
            res.cookie('username', username);
            res.cookie('password', password);
        }
    }
    if(isCorrect = true){
        console.log("correct");
        return res.redirect("Shopping.html");
    }
    else{
        console.log("Wrong");
        return res.redirect("login.html?error=1");
    }


})
 
 app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/login.html`);
});