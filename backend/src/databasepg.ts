import { Client } from 'pg';


const client =new Client({
    host:"localhost",
    user:"postgres",
    port:8080,
    password:"295003",
    database:"my_translate_list"
});


client.connect();
export {client};
