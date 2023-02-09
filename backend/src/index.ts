import express,{NextFunction, Request,Response} from 'express';
import {client} from "./databasepg";
const app = express();



function authenticate_user(req:Request,res:Response,next:NextFunction):any {
   console.log('authentication is checking');
   let creds=req.get('Authorization');
   creds=creds?.substring(creds?.indexOf(' ')+1);
   creds=creds?.toString();
   creds=Buffer.from(creds!,'base64').toString('binary');
   let credsArray:string[];
   credsArray=creds.split(':')
   if (credsArray[0]==='umttrk19@gmail.com'&&credsArray[1]==='123456') {
      console.log('authenticated');
      next();
   }else{
      console.log('not authenticated');
      res.status(401).end();
   }
}
app.listen(3000, "0.0.0.0", (): void => {
    console.log("server is listening on port 3000");
});

app.get('/login',authenticate_user,(req:Request,res:Response):any=>{

   res.status(200).end(); 
})
app.get('/logout',authenticate_user,(req:Request,res:Response):any=>{
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