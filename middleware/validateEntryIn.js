import {db} from "../database/db.js";
import joi from "joi";
import dayjs from "dayjs";

async function validateEntryIn(req, res, next){
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
  
    entry.day = Date.now()
    const session = await db.collection('sessions').findOne({token: token});
  
    if (!session) {
      return res.status(401).send("Sessão não encontrada/expirada");
    }

    entry.userId =session.userId;
    entry.day= dayjs(entry.day).format("DD/MM");

    res.locals.entry = entry;

    next();

}

export default validateEntryIn;