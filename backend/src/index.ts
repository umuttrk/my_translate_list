import express, { NextFunction, Request, Response } from 'express';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { client } from "./databasepg";
const app = express();
app.use(express.json());
function check_mail(req: any, res: Response, next: NextFunction): any {
   console.log('authentication is checking');
   let creds = req.get('Authorization');
   creds = creds?.substring(creds?.indexOf(' ') + 1);
   creds = creds?.toString();
   creds = Buffer.from(creds!, 'base64').toString('binary');
   let credsArray: string[];
   credsArray = creds.split(':')
   client.query(`select * from users where email='${credsArray[0]}'`)
      .then(response => {
         req.user = { password: credsArray[1], database_res: response.rows[0] };
         if (!response) return res.status(401).end();
         next()
      })
      .catch(err => console.log(err));
}

function check_password(req: any, res: Response, next: NextFunction): any {
   console.log('password is checking');
   let { password, database_res } = req.user;
   console.log(req.user);
   if (database_res.password === password) {
      next();
   } else {
      console.log('wrong password');
      return res.status(401).end();
   }
}





app.listen(3000, "0.0.0.0", (): void => {
   console.log("server is listening on port 3000");
});

app.get('/login', check_mail, check_password, (req: Request, res: Response): any => {
   console.log('login api is called');
   res.status(200).end();
});
app.get('/logout', check_mail, (req: Request, res: Response): any => {
   console.log('logout api is called');
   return res.status(200).end();
});

app.post('/register', (req: Request, res: Response): any => {
   const { first_name, last_name, email, pass } = req.body;
   console.log(req.body);
   if (first_name && last_name && email && pass) {
      client.query(`insert into users(user_id,first_name,last_name,email,password) values (${Math.random() * 5000},'${first_name}','${last_name}','${email}','${pass}')`)
         .then((response) => {
            console.log('inserted');
            return res.status(200).end();
         }).catch(err => {
           // console.log(err);
            if (err.code === '23505') {
               console.log('duplicate girildi');
               return res.status(409).end();
            }
            return res.status(400).end();
         });

   } else {
      console.log('bad req');
      return res.status(400).end();
   }


});



app.use((req: Request, res: Response, next: NextFunction): any => {
   res.status(404).send(`Route not found ${req.url}`);
   next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction): any => {
   res.status(500).send(err.message || "Problem");
});















// client.query(`select * from users`,(err,result)=>{
//     if (!err) {
//         console.log(result.rows);

//         return res.send(result.rows)
//     }else {
//         console.log(err.message);
//     }
// });