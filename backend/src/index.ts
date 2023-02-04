import express,{NextFunction, Request,Response} from 'express';
import {client} from "./databasepg";
const app = express();

app.listen(3000, "0.0.0.0", (): void => {
    console.log("server is listening on port 3000");
});

app.get('/login',(req:Request,res:Response):any=>{
   res.status(200).end(); 
})
app.get('/logout',(req:Request,res:Response):any=>{
   res.status(200).end(); 
})
app.use((req:Request,res:Response,next:NextFunction):any=>{
   res.status(404).send(`Route not found ${req.url}`); 
   next();
})

app.use((err:Error,req:Request,res:Response,next:NextFunction):any=>{
   res.status(500).send(err.message||"Problem"); 
})















// client.query(`select * from users`,(err,result)=>{
//     if (!err) {
//         console.log(result.rows);

//         return res.send(result.rows)
//     }else {
//         console.log(err.message);
//     }
// });