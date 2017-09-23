let mysql = require("mysql");
let con = mysql.createConnection({
    host: "streetfood.in.th",
    user: "admin_sittikiat",
    password: "7856ek31",
    database: "admin_melo"
});

con.connect((err) => {
    if (err) throw err;
    console.log("connect success");
});

module.exports = con;