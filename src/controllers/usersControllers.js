import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import connection from "../database/db.js"


export const SignIn = async (req, res) => {
    const user = res.locals.user;
    const token = uuid(); 

    try {
        
        const userRegistred = await connection.query(`SELECT * FROM users WHERE email = $1;`,[user.email]);

        const id = userRegistred.rows[0].id;
        console.log("id: ",id)
        const tokenExist = await connection.query(`SELECT token FROM users_token WHERE user_id=$1;`,[id]);

        if(tokenExist.rows[0]){
            return res.status(200).send(tokenExist.rows[0]);
        }
        
        await connection.query(`INSERT INTO users_token (token, user_id) VALUES ($1, $2);`,[token, userRegistred.rows[0].id]);
        
        return res.status(200).send({token});
    } catch (error){
        console.log(error)
        return res.sendStatus(500);
    }
}


export const SignUp = async (req, res) => {
    const {name, email, password} = res.locals.user;
    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        
        await connection.query(`INSERT INTO users (name, email,password) VALUES ($1, $2, $3);`, [name, email,passwordHash])

        return res.status(201).send('OK');

    } catch(error){

        return res.status(409).send(error);
    }
}
