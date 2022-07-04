import {db} from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import joi from "joi";
import { stripHtml } from "string-strip-html";

async function validateUserSignUp(req, res, next){
   
    const registerSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.any().valid(joi.ref('password')).required()
      });

    const user = req.body;
    const passwordHash = bcrypt.hashSync(user.password, 10);
    const validation = registerSchema.validate(user,{abortEarly: false});
    user.name = stripHtml(user.name).result.trim()

    if(validation.error){
        res.status(422).send(validation.error.details.map(item => item.message))
        return
    }
    delete user.confirmPassword

    try {
        const existingName = await db.collection("users").findOne({name: user.name})
        if (existingName) {
            return res.sendStatus(409);
          }
        
        user.password=passwordHash;
        res.locals.user=user
       
    } catch(error){
        console.error(error);
        res.sendStatus(500)
    }


    next();

}

export default validateUserSignUp;
