import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import { db } from "../database/db.js";
import joi from "joi";


export async function signUp (req, res){
   
      const user = res.locals.user
      await db.collection("users").insertOne({...user})
      res.sendStatus(201)
        
  
  }

export async function logIn(req, res){
            const user = res.locals.user
        await db.collection("sessions").insertOne({userId:user._id, token: user.token})
      res.send(user)
};
