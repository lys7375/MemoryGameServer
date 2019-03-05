var express = require('express');
var app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const port = process.env.PORT || 8000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());


function getConnection(){
    return mysql.createConnection({
        host: "sql3.freemysqlhosting.net",
        user: "sql3281084",
        password: "qR9dITRBLR",
        database: "sql3281084"
    })
  }

app.post('/endpoint', function(req, res){


    // let obj = req.body;
    // console.log(obj[0]);

    let score = req.body[0].score;
    let name = req.body[0].name;

    console.log("score: " + score + " name: " + name);

    const queryString = "INSERT INTO leaderboard (name, score) VALUE (?,?)"
    getConnection().query(queryString, [name, score], (err, results, fields) =>{
        if(err){
            console.log("Failded to insert: " + err)
            res.sendStatus(500);
            return
        }

        console.log("Insert");
    })

	res.send(req.body);
});

app.get("/frontend", (req, res) => {
    let sql = "select * from leaderboard"
        
    getConnection().query(sql, function (err, result) {
        if (err) throw err;
        console.log("result: " + result.length);

        let arr = [];
        let num = 0;
        let index = 0;

        for(let i = 0; i < 5; i++){
            for(let ii = 0; ii < result.length; ii++){
                if(result[ii].score > num){
                    num = result[ii].score;
                    index = ii;
                }
            }

            let myObj = {name: "", score: ""};
            myObj.name = result[index].name;
            myObj.score = result[index].score;
            arr.push(myObj);
            result[index].score = -1;    
            num = 0;
            index = 0;        
        }

        console.log(arr);

        res.send(arr);
    });
    
});

console.log("Listen port 8000")

app.listen(port);