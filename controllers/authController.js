import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import { db } from "../database/db.js";
import joi from "joi";

export async function signUp (req, res){
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
      
          
        await db.collection("users").insertOne({...user, password:passwordHash})
        res.sendStatus(201)
    } catch(error){
        console.error(error);
        res.sendStatus(500)
    }
    
  }

export async function logIn(req, res){
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
            
            await db.collection("sessions").insertOne({
                userId: user._id,
                token
            })
            res.send(token)
        }else{
            res.status(401).send("Email e/ou senha incorretos")
        }
};
