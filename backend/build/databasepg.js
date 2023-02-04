"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client = new pg_1.Client({
    host: "localhost",
    user: "postgres",
    port: 8080,
    password: "295003",
    database: "my_translate_list"
});
client.connect();
client.query(`select * from users`, (err, res) => {
    if (!err) {
        console.log(res.rows);
    }
    else {
        console.log(err.message);
    }
});
