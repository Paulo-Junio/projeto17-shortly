import connection from '../database/db.js'; 
import { urlSchema } from '../models/urlsModels.js';

export const PostUrlValidation = async (req, res, next)=>{
    const url = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    try {

        const {error} = urlSchema.validate(url);
        if(error){
            return res.sendStatus(422);
        }

        const user = await connection.query(`SELECT * FROM users_token WHERE token = $1;`, [token]);
        
        if(!user.rows[0]){
            return res.sendStatus(401);
        }
        const id = user.rows[0].user_id;
        
        res.locals.url= {...url,id};


    } catch(error){
        console.log(error)
        return res.sendStatus(500);
    }

    next()
};

export const DeleteUrlValidation = async (req, res, next)=>{
    const url_id = req.params.id;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    try {

        const user = await connection.query(`SELECT * FROM users_token WHERE token = $1;`, [token]);
        
        if(!user.rows[0]){
            console.log("foi aqui")
            return res.sendStatus(401);
        };
        console.log(user.rows[0])
        const id = user.rows[0].user_id;

        const url_user = await connection.query(`SELECT * FROM user_urls WHERE id=$1;`, [url_id]);

        if(!url_user.rows[0]){
            return res.sendStatus(404);
        };

        if (id != url_user.rows[0].user_id){
            return res.sendStatus(401);
        };
        
        res.locals.url_id= url_id;


    } catch(error){
        console.log(error)
        return res.sendStatus(500);
    }

    next()
};

export const GetUserUrlsValidation = async (req,res,next) =>{
    try{
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer ', '');

        const user = await connection.query(`SELECT * FROM users_token WHERE token = $1;`, [token]);
        
        if(!user.rows[0]){
            
            return res.sendStatus(401);
        };
        console.log(user.rows[0])
        const id = user.rows[0].user_id;

        const userExist = await connection.query(`SELECT * FROM users WHERE id=$1;`,[id]);

        if(!userExist.rows[0]){
            return res.sendStatus(404);
        }

        const userViews = await connection.query(`SELECT SUM(user_urls.views) AS "visitCount" FROM user_urls WHERE user_urls.user_id=$1 GROUP BY user_urls.user_id;`,[id])
        
        res.locals.userViews = {id, views: userViews.rows[0].visitCount};
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }

    next()
}