import { nanoid } from 'nanoid';
import connection from '../database/db.js';

export const PostUrl = async (req,res,next) =>{

    try {
        const url = res.locals.url;
        const shortUrl = nanoid();
        
        await connection.query(`INSERT INTO user_urls("url", short_url, user_id) VALUES($1,$2,$3);`,[url.url, shortUrl, url.id]);
        
        return res.status(201).send({shortUrl});
        
    } catch(error){
        console.log(error)
        return res.sendStatus(500);
    }
};

export const GetUrlById = async (req, res) =>{
    try{
        const id = req.params.id;

        const url = await connection.query(`SELECT id, short_url AS "shortUrl", url FROM user_urls WHERE id=$1;`,[id]);

        if(!url.rows[0]){
            return res.sendStatus(404);
        }

        return res.status(200).send(url.rows[0])

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
};

export const OpenUrl = async (req, res) =>{
    try{
        const shortUrl = req.params.shortUrl;
        console.log(shortUrl)

        const url = await connection.query(`SELECT id, url, views FROM user_urls WHERE short_url=$1;`,[shortUrl]);

        if(!url.rows[0]){
            return res.sendStatus(404);

        }
                const newViews = url.rows[0].views + 1;
            await connection.query('UPDATE user_urls SET views=$1 WHERE id=$2',[newViews, url.rows[0].id]);

        return res.redirect(url.rows[0].url)

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
};

export const DeleteUrls = async(req, res) =>{
    try{
        const url_id = res.locals.url_id;

        
        await connection.query(`DELETE FROM user_urls WHERE id=$1;`,[url_id]);
        

        return res.sendStatus(204)

    }catch(error){
        console.log(error)
        return res.sendStatus(500);
    }
};

export const GetUserUrls = async (req,res)=>{
    try{
        const userViews = res.locals.userViews;
        
        const userInfo = await connection.query(`SELECT users.id, users.name FROM users WHERE users.id=$1;`,[userViews.id]);
        const urls = await connection.query(`SELECT user_urls.id, user_urls.short_url AS "shortUrl",user_urls.url ,user_urls.views AS "visitCount" FROM user_urls WHERE user_id = $1;`,[userViews.id]);
        console.log(userViews)
        const userData = {
            ...userInfo.rows[0],
            visitCount: userViews.views,
            shortenedUrls: urls.rows,
        }
        
        return res.status(200).send(userData)
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
};

export const GetRanking = async (req,res)=>{
    try{
        const userRaking = await connection.query(`
        SELECT users.id, users.name, COUNT(user_urls.user_id) AS "linksCount", COALESCE(SUM(user_urls.views),0) AS "visitCount" FROM users LEFT JOIN user_urls ON users.id=user_urls.user_id GROUP BY users.id ORDER BY  SUM(user_urls.views) DESC NULLS LAST LIMIT 10;`)

        return res.status(200).send(userRaking.rows)
    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}