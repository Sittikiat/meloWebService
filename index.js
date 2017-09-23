let con = require("./module/connect");
let express = require("express")
let bodyParser = require("body-parser");
let fs = require("fs");
let app = express();

// allow post
app.use(bodyParser.json());

// Access-Control-Allow-Origin
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    res.end("Web Service");
});

//------------------------------------------------USER------------------------------------------------//


app.get("/user", (req, res) => {
    let sql = "SELECT * FROM user";
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.post("/newuser", (req, res) => {

    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    // ---------------image-------------------- 
    let imageFilenameOrignal = req.body.image.filename;
    let imageData = req.body.image.base64;
    let imageFilenameMaster = renameFile(imageFilenameOrignal);


    function renameFile(image) {
        let extension = image.split(".").pop();
        let newFilename = Date.now() + "." + extension;
        return  newFilename;
    }


    fs.mkdir("./images", () => {
        fs.writeFileSync("./images/" + imageFilenameMaster, imageData, "base64");
        console.log("image upload success");
    })
    // ----------------------------------------

    let sql = `INSERT INTO user(username_user, password_user, email_user, image_user) VALUES ('${username}', '${password}', '${email}', '${imageFilenameMaster}')`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            res.json({"status": "success", "message": "welcome new user"});
        } else {
            res.json({"status": "fail", "message": "Opps try again"});
        }
    }); 
});

app.put("/edituser", (req, res) => {
    let id = req.body.id;
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    let sql = `UPDATE user SET username_user = '${username}', password_user = '${password}', email_user = '${email}' WHERE id_user = '${id}'`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            res.json({"status": "success", "message": "Edit user ok"});
        } else {
            res.json({"status": "fail", "message": "Opps try again"});
        }
    });
});

app.delete("/deluser/:id", (req, res) => {
    let id = req.params.id;

    let sql = `DELETE FROM user WHERE id_user = '${id}'`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            res.json({"status": "success", "message": "Delete user ok"});
        } else {
            res.json({"status": "fail", "message": "Opps try again"});
        }
    });
});

//---------------------------------------------RESTAURANT----------------------------------------------//



app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});