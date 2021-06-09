require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const morgan = require("morgan");
const compression = require('compression');
const errorHandler = require('./middleware/error-handler');
require('dotenv').config();

var dbOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    charset: process.env.DB_CHARSET
}

global.conn = mysql.createConnection(dbOptions);

var password = "atulassan"; 
var hashedPassword = bcrypt.hashSync(password, 8);

var passwordIsValid = bcrypt.compareSync("atulassan", hashedPassword);

console.log("Hashed Password+++++++", hashedPassword);
console.log(passwordIsValid);

//connect to database
conn.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Mysql Connected...');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.get("/", (req, res) => {
    res.send("Testing testing testeing");
});

// global error handler
app.use(errorHandler);

var appRoutes = require('./routes/index');

function QueryFn(sql, args = {}) {
    return new Promise((resolve, reject) => {
        conn.query(sql, args, (err, rows) => {
            if (err) {
                console.error('err', sql);
                return reject(err);
            }
            resolve(rows);
        });
    });
}

global.runQuery = async function (sql, args = {}) {
    try {
        let items = await QueryFn(sql, args);
        let result = await items;
        return { "status": true, "error": false, "result": JSON.parse(JSON.stringify(result)) };
    } catch (error) {
        console.log(error);
        return { "status": false, "error": true, code: error.code, "sqlMessage": error.sqlMessage };
    }
}

app.use(morgan('dev')); //develop morgan
app.use(compression()); // Compress all Responses
app.use(appRoutes); // Site Routes

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));