import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import { db } from "../database/db.js";
import joi from "joi";
import { stripHtml } from "string-strip-html";

export async function entryIn(req, res){
  
    const entry = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const entrySchema = joi.object({
      amount: joi.number().precision(2).positive().required().options({convert: false}),
      description: joi.string().required()
    });
  
    const { error } = entrySchema.validate(entry);
  
    if (error) {
      return res.status(422).send(error.details.map(item => item.message));
    }
  
    const session = await db.collection('sessions').findOne({token: token});
  
    if (!session) {
      return res.status(401).send("Sessão não encontrada/expirada");
    }
    
    await db.collection('entries').insertOne({ ...entry, userId: session.userId });
    res.status(201).send('Entrada salva com sucesso');
  }

export async function entryOut(req, res){
  
    const entry = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const entrySchema = joi.object({
      amount: joi.number().precision(2).negative().required().options({convert: false}),
      description: joi.string().required()
    });
  
    const { error } = entrySchema.validate(entry);
  
    if (error) {
      return res.status(422).send(error.details.map(item => item.message));
    }
  
    const session = await db.collection('sessions').findOne({token: token});
  
    if (!session) {
      return res.status(401).send("Sessão não encontrada/expirada");
    }
    
    await db.collection('entries').insertOne({ ...entry, userId: session.userId });
    res.status(201).send('Entrada salva com sucesso');
  }

