const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {

    //-----------------------------------------------------------------------
    const firstName = req.body.fName;
    const lastNmae = req.body.lName;
    const email = req.body.email;

    const data = {              // above working for this
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastNmae
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);  // above data array for this

    //-----------------------------------------------------------------------------
    const url = "https://us12.api.mailchimp.com/3.0/lists/270ba6ee6d";

    const options = {
        method: "POST",
        auth: "example:b879275748158ccccaaace0466004217-us12"
    }

    // url and optins created for this
    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    //-------------------------------------------------------------------------------
    request.write(jsonData);    // request constant made above is used here
    request.end();
})

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
})

// API Key
// b879275748158ccccaaace0466004217-us12

// List ID
// 270ba6ee6d