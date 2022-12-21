import bcrypt from 'bcrypt';
import connection from '../database/db.js'; 

import { userRegisterSchema, userSchema } from '../models/usersModels.js';

export const userRegisterValidation = (req, res, next)=>{
    const user = req.body;

    const {error}= userRegisterSchema.validate(user, { abortEarly: false });

    if(error){
        console.log(error);
        return res.status(422).send(error);
    };

    if(user.password != user.confirmPassword){
        return res.status(422).send("As senhas não são iguais")
    }

    res.locals.user = user;
    next();
};

export const userValidation = async (req, res, next)=>{
    const {email, password} = req.body;
    const {error} = userSchema.validate({email,password});

    if(error){
        return res.sendStatus(422);
    };

    try{
        
        
        const userExist = await connection.query("SELECT * FROM users WHERE email= $1;",[email]);

        if(!userExist.rows[0]){
            return res.sendStatus(401);
        };

        const passwordEquals = bcrypt.compareSync(password, userExist.rows[0].password);
        if(!passwordEquals){
            return res.sendStatus(401)
        };

        res.locals.user = userExist.rows[0];
    }catch(error){
        console.log(error);
        return res.status(500).send(error);
    }

    next();
};