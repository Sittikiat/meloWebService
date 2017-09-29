let mysql = require("mysql");
let con = mysql.createConnection({
    host: "localhost",
    user: "sittikiat",
    password: "7856ek31",
    database: "melo_db"
});

con.connect((err) => {
    if (err) throw err;
    console.log("connect success");
});

module.exports = con;
