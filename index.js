let con = require("./module/connect");
let express = require("express")
let bodyParser = require("body-parser");
let fs = require("fs");
let app = express();

// allow post and limit size
app.use(bodyParser.json({ limit: "50mb" }));

// Access-Control-Allow-Origin
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    res.end("Web Service");
});

//------------------------------------------------USER------------------------------------------------//

function renameFile(image) {
    let extension = image.split(".").pop();
    let newFilename = Date.now() + "." + extension;
    return newFilename;
}


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




    fs.mkdir("./images", () => {
        fs.writeFileSync("./images/" + imageFilenameMaster, imageData, "base64");
        console.log("image upload success");
    })
    // ----------------------------------------

    let sql = `INSERT INTO user(username_user, password_user, email_user, image_user) VALUES ('${username}', '${password}', '${email}', '${imageFilenameMaster}')`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            res.json({ "status": "success", "message": "welcome new user" });
        } else {
            res.json({ "status": "fail", "message": "Opps try again" });
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
            res.json({ "status": "success", "message": "Edit user ok" });
        } else {
            res.json({ "status": "fail", "message": "Opps try again" });
        }
    });
});

app.delete("/deluser/:id", (req, res) => {
    let id = req.params.id;

    let sql = `DELETE FROM user WHERE id_user = '${id}'`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            res.json({ "status": "success", "message": "Delete user ok" });
        } else {
            res.json({ "status": "fail", "message": "Opps try again" });
        }
    });
});

//---------------------------------------------RESTAURANT----------------------------------------------//

app.get("/restaurant", (req, res) => {
    let sql = "SELECT * FROM restaurant";
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
});

app.delete("/delrestaurant/:id", (req, res) => {
    let id = req.params.id;

    let sql = `DELETE FROM restaurant WHERE id_restaurant = '${id}'`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            res.json({ "status": "success", "message": "Delete restaurant ok" });
        } else {
            res.json({ "status": "fail", "message": "Opps try again" });
        }
    });
});

app.post("/newrestaurant", (req, res) => {
    let name = req.body.name;
    let comment = req.body.comment;
    let rate = req.body.rate;
    let address = req.body.address;
    let image = req.body.image;
    let category = req.body.category;
    let menu = req.body.menu;

    // ---------------image--------------------
    let imageName = renameFile(image.filename);
    fs.mkdir("./images", () => {
        fs.writeFileSync("./images/" + imageName, image.base64, "base64");
        console.log("insert image success");
    })
    // ---------------------------------------- 
    let sql = `INSERT INTO restaurant (name_restaurant, comment_restaurant, rate_restaurant, address_restaurant, img_restaurant, id_restaurant_category, id_menu) 
               VALUES ('${name}', '${comment}', '${rate}', '${address}', '${imageName}', '${category}', '${menu}')`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            res.json({ "status": "success", "message": "Insert image success" });
        } else {
            res.json({ "status": "fail", "message": "Opps try again" });

        }
    })
})


//--------------------------------------RESTAURANT CATEGORY--------------------------------------------//

app.get("/restaurant_category", (req, res) => {
    let sql = "SELECT * FROM restaurant_category";
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
});

//---------------------------------------------MENU----------------------------------------------//

app.get("/menu", (req, res) => {
    let sql = "SELECT * FROM menu";
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
});

//------------------------------------------RESRAURANT IMAGE----------------------------------------//

app.post("/newrestaurant_image", (req, res) => {
    let image = req.body.image;
    let nameRestaurant = req.body.nameRestaurant;

    // ---------------image--------------------
    let nameImage = renameFile(image.filename);
    fs.mkdir("./images", () => {
        fs.writeFileSync("./images/" + nameImage, image.base64, "base64");
        console.log("insert image success");
    })

    // ---------------------------------------- 

    let sql = `INSERT INTO restaurant_image (name_restaurant_image, id_restaurant) VALUES ('${nameImage}', '${nameRestaurant}')`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            res.json({"status": "success", "message": "Insert Muliple Image Success"});
        } else {
            res.json({"status": "fail", "message": "Opps try again"});
        }
    })
});


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});