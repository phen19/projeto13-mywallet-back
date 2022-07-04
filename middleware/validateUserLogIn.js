import {db} from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import joi from "joi";

async function validateUserLogIn(req, res, next){
   
    const {email, password} = req.body;

    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
      });
    
      const { error } = loginSchema.validate({email, password});
    
      if (error) {
        res.status(422).send(error.details.map(item => item.message));
      }

    const user = await db.collection("users").findOne({email});

    if(user && bcrypt.compareSync(password, user.password)){
        const token = uuid();
        
        const session = {userId: user._id, token: token}
        user.token = token
        delete user.password
    
        res.locals.user = user
    }else{
        res.status(401).send("Email e/ou senha incorretos")
    }

    next();

}

export default validateUserLogIn;
